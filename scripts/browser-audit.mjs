import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cdpBaseUrl = process.env.CDP_URL || "http://127.0.0.1:9222";
const siteUrl = process.env.AUDIT_URL || "http://127.0.0.1:3000";
const outputDirectory = path.resolve("auditoria/final");

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.eventWaiters = new Map();
    this.consoleErrors = [];
    this.networkErrors = [];
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.webSocket.addEventListener("open", resolve, { once: true });
      this.webSocket.addEventListener("error", reject, { once: true });
    });

    this.webSocket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }

      if (message.method === "Runtime.exceptionThrown") {
        this.consoleErrors.push(message.params.exceptionDetails.text);
      }

      if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
        this.consoleErrors.push(message.params.entry.text);
      }

      if (message.method === "Network.loadingFailed" && !message.params.canceled) {
        this.networkErrors.push(message.params.errorText);
      }

      const waiters = this.eventWaiters.get(message.method) || [];
      this.eventWaiters.delete(message.method);
      waiters.forEach((resolve) => resolve(message.params));
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.webSocket.send(JSON.stringify({ id, method, params }));
    });
  }

  waitForEvent(method, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const waiters = this.eventWaiters.get(method) || [];
      waiters.push(resolve);
      this.eventWaiters.set(method, waiters);
      setTimeout(() => reject(new Error(`Timeout waiting for ${method}`)), timeout);
    });
  }

  async evaluate(expression) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });

    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.text);
    }

    return response.result.value;
  }

  close() {
    this.webSocket.close();
  }
}

async function createClient() {
  const response = await fetch(`${cdpBaseUrl}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });

  if (!response.ok) throw new Error(`CDP tab creation failed: ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await Promise.all([
    client.send("Page.enable"),
    client.send("Runtime.enable"),
    client.send("Network.enable"),
    client.send("Log.enable"),
  ]);
  return client;
}

async function setViewport(client, width, height, reducedMotion = false) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 768,
    screenWidth: width,
    screenHeight: height,
  });
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      {
        name: "prefers-reduced-motion",
        value: reducedMotion ? "reduce" : "no-preference",
      },
    ],
  });
}

async function navigate(client, url) {
  const loaded = client.waitForEvent("Page.loadEventFired");
  await client.send("Page.navigate", { url });
  await loaded;
  await client.evaluate("document.fonts.ready.then(() => true)");
  await delay(700);
}

async function capture(client, name) {
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(path.join(outputDirectory, name), Buffer.from(screenshot.data, "base64"));
}

async function getLayoutState(client, label) {
  return client.evaluate(`(() => {
    const root = document.documentElement;
    const visibleElements = [...document.querySelectorAll("body *")]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      });
    const rightEdge = visibleElements.reduce((maximum, element) => {
      const rect = element.getBoundingClientRect();
      return Math.max(maximum, rect.right);
    }, 0);
    return {
      label: ${JSON.stringify(label)},
      viewport: { width: innerWidth, height: innerHeight },
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      overflow: root.scrollWidth > root.clientWidth,
      rightEdge: Math.round(rightEdge),
      h1Count: document.querySelectorAll("h1").length,
      imageFailures: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
      technicalText: /\\b(undefined|null|NaN|Error fetching data|Failed request)\\b/.test(document.body.innerText),
      deadLinks: [...document.querySelectorAll("a[href]")].filter((link) => link.getAttribute("href") === "#").length,
    };
  })()`);
}

async function run() {
  await mkdir(outputDirectory, { recursive: true });
  const client = await createClient();
  const results = {
    layouts: [],
    interactions: {},
    reducedMotion: {},
    consoleErrors: [],
    networkErrors: [],
  };

  try {
    await setViewport(client, 1440, 900);
    await navigate(client, siteUrl);
    await capture(client, "cdp-desktop-hero-1440.png");
    results.layouts.push(await getLayoutState(client, "1440x900"));

    await client.evaluate(`(() => {
      document.querySelector("#colecao")?.scrollIntoView({ block: "start" });
      scrollBy(0, -90);
      return true;
    })()`);
    await delay(500);
    await capture(client, "cdp-desktop-catalogo-1440.png");

    const viewports = [
      [320, 720], [360, 800], [375, 812], [390, 844], [412, 915], [430, 932], [768, 900],
      [1024, 768], [1280, 800], [1366, 768], [1440, 800], [1920, 1080],
    ];

    for (const [width, height] of viewports) {
      await setViewport(client, width, height);
      await client.evaluate("scrollTo(0, 0); true");
      await delay(180);
      results.layouts.push(await getLayoutState(client, `${width}x${height}`));
    }

    await setViewport(client, 390, 844);
    await navigate(client, siteUrl);
    await capture(client, "cdp-mobile-hero-390.png");

    results.interactions.menu = await client.evaluate(`(() => {
      document.querySelector(".menu-button")?.click();
      return true;
    })()`);
    await delay(120);
    results.interactions.menu = await client.evaluate(`({
      opened: Boolean(document.querySelector(".mobile-menu")),
      bodyLocked: getComputedStyle(document.body).overflow === "hidden",
      focus: document.activeElement?.getAttribute("aria-label"),
    })`);
    await client.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); true`);
    await delay(120);
    results.interactions.menu.closedWithEscape = !(await client.evaluate("Boolean(document.querySelector('.mobile-menu'))"));

    await client.evaluate(`document.querySelector("#colecao")?.scrollIntoView({ block: "start" }); true`);
    await delay(500);
    await capture(client, "cdp-mobile-catalogo-390.png");
    await client.evaluate(`document.querySelector(".mobile-filter-button")?.click(); true`);
    await delay(120);
    results.interactions.filters = await client.evaluate(`({
      opened: Boolean(document.querySelector("#catalog-filters")),
      bodyLocked: getComputedStyle(document.body).overflow === "hidden",
      focus: document.activeElement?.getAttribute("aria-label"),
    })`);

    await client.evaluate(`(() => {
      const selects = document.querySelectorAll("#catalog-filters select");
      selects[0].value = "Vestidos";
      selects[0].dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()`);
    await delay(120);
    results.interactions.filters.categoryCount = await client.evaluate("document.querySelectorAll('.product-card').length");
    await client.evaluate(`(() => {
      const selects = document.querySelectorAll("#catalog-filters select");
      selects[1].value = "12";
      selects[1].dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()`);
    await delay(120);
    results.interactions.filters.emptyState = await client.evaluate("Boolean(document.querySelector('.catalog-empty'))");
    await client.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); true`);
    await delay(120);
    results.interactions.filters.closedWithEscape = !(await client.evaluate("Boolean(document.querySelector('#catalog-filters'))"));
    await client.evaluate(`document.querySelector(".catalog-empty .button")?.click(); true`);
    await delay(120);
    results.interactions.filters.resetCount = await client.evaluate("document.querySelectorAll('.product-card').length");

    await client.evaluate(`document.querySelector(".product-image")?.click(); true`);
    await delay(150);
    await capture(client, "cdp-mobile-modal-390.png");
    results.interactions.modal = await client.evaluate(`({
      opened: Boolean(document.querySelector(".product-modal")),
      bodyLocked: getComputedStyle(document.body).overflow === "hidden",
      focus: document.activeElement?.getAttribute("aria-label"),
    })`);
    await client.evaluate(`(() => {
      const size = [...document.querySelectorAll(".product-modal .size-options button")]
        .find((button) => button.textContent.trim() === "4");
      size?.click();
      return true;
    })()`);
    await delay(120);
    const whatsappHref = await client.evaluate("document.querySelector('.product-modal a[href*=\"wa.me\"]')?.href");
    results.interactions.modal.whatsappMessage = whatsappHref
      ? new URL(whatsappHref).searchParams.get("text")
      : null;
    await client.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); true`);
    await delay(120);
    results.interactions.modal.closedWithEscape = !(await client.evaluate("Boolean(document.querySelector('.product-modal'))"));
    results.interactions.modal.focusRestored = await client.evaluate("document.activeElement?.classList.contains('product-image')");

    await setViewport(client, 390, 844);
    await navigate(client, `${siteUrl}/produtos/vestido-jardim-coral-infantil`);
    await capture(client, "cdp-mobile-produto-390.png");
    results.layouts.push(await getLayoutState(client, "produto-390x844"));

    await setViewport(client, 1440, 900);
    await navigate(client, `${siteUrl}/produtos/vestido-jardim-coral-infantil`);
    await capture(client, "cdp-desktop-produto-1440.png");
    results.layouts.push(await getLayoutState(client, "produto-1440x900"));

    await setViewport(client, 390, 844, true);
    await navigate(client, siteUrl);
    await client.evaluate(`document.querySelector("#colecao")?.scrollIntoView({ block: "start" }); true`);
    await delay(200);
    results.reducedMotion = await client.evaluate(`(() => {
      const cards = [...document.querySelectorAll(".product-card")];
      return {
        enabled: matchMedia("(prefers-reduced-motion: reduce)").matches,
        visibleCards: cards.filter((card) => {
          const style = getComputedStyle(card);
          return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
        }).length,
        totalCards: cards.length,
      };
    })()`);

    results.consoleErrors = [...new Set(client.consoleErrors)];
    results.networkErrors = [...new Set(client.networkErrors)];
    await writeFile(
      path.join(outputDirectory, "browser-audit.json"),
      `${JSON.stringify(results, null, 2)}\n`,
      "utf8",
    );
    process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  } finally {
    client.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
