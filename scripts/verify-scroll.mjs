/**
 * Verification: reproduce the reported scroll bug scenario exactly.
 * Sequence: load → header visible → scroll to bottom → navigate →
 * next screen must start at top WITH the header in its intended position.
 * Also samples scrollY during a transition (unexpected-jump check) and
 * verifies a same-screen card flip does NOT reset scroll.
 */
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGETS = [
  { base: "http://localhost:4173/", name: "production preview" },
  { base: "http://localhost:5199/", name: "dev server" },
];
const VIEWPORTS = [
  { w: 390, h: 844, n: "mobile-390" },
  { w: 1280, h: 900, n: "desktop-1280" },
];

let failures = 0;
const pass = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures += 1;
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const target of TARGETS) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource|fonts|favicon/.test(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    const tag = `${target.name} @ ${vp.n}`;

    const y = () => page.evaluate(() => Math.round(window.scrollY));
    const headerAtTop = () =>
      page.evaluate(() => {
        const r = document.querySelector(".topbar").getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      });
    const scrollMax = () =>
      page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        return Math.round(window.scrollY);
      });

    await page.goto(target.base, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector(".answer-card");

    // 1. Load: header visible at its intended position
    let h = await headerAtTop();
    pass(h.top === 0 && h.bottom > 0 && (await y()) === 0, `${tag}: loads at top with header visible (header top ${h.top}px)`);

    const nav = async (label, act) => {
      const before = await scrollMax();
      await act();
      await page.waitForTimeout(1350);
      const after = await y();
      h = await headerAtTop();
      pass(
        after === 0 && h.top === 0 && h.bottom <= vp.h,
        `${tag}: ${label} opens at the top with header visible (scrolled ${before}px → scrollY ${after}px, header top ${h.top}px)`,
      );
    };

    const answerAndContinue = async (index = 1) => {
      await page.locator(".answer-card").nth(index).click();
      await page.waitForTimeout(300);
      const cont = page.getByRole("button", { name: /^Discover how it works/ });
      await cont.scrollIntoViewIfNeeded();
      await cont.click();
    };

    // 2–7. Every forward transition after scrolling to the bottom
    await nav("hook → signals", () => answerAndContinue(1));

    // same-screen flip must keep scroll position (from mid-page)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const flip = page.locator(".flip-card").last().locator(".flip-trigger");
    await flip.scrollIntoViewIfNeeded();
    const yb = await y();
    await flip.click();
    await page.waitForTimeout(700);
    const ya = await y();
    pass(
      (await flip.getAttribute("aria-expanded")) === "true" && Math.abs(ya - yb) <= 2,
      `${tag}: same-screen card flip keeps scroll (flip ${yb}px → ${ya}px, aria-expanded true)`,
    );

    await nav("signals → GLP-1", () => page.getByRole("button", { name: /What about GLP-1/i }).click());
    await nav("GLP-1 → medicines", () =>
      page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).click(),
    );
    await nav("medicines → concern", () => page.getByRole("button", { name: /My biggest question/i }).click());
    await nav("concern → summary", async () => {
      await page.locator(".concern-card").nth(1).click();
      await page.getByRole("button", { name: /My takeaway/i }).click();
    });

    // 8. Backward: restart from the summary (in-app "back" to the hook)
    await nav("summary → hook (Start over)", () => page.getByRole("button", { name: /Start over/i }).click());

    // Unexpected-jump check: sample scrollY during a transition from the bottom
    await scrollMax();
    const samples = await (async () => {
      await page.evaluate(() => {
        window.__ySamples = [];
        window.__yTimer = setInterval(() => window.__ySamples.push(Math.round(window.scrollY)), 25);
      });
      await answerAndContinue(1);
      await page.waitForTimeout(900);
      return page.evaluate(() => {
        clearInterval(window.__yTimer);
        return window.__ySamples;
      });
    })();
    const settledAtZero = samples[samples.length - 1] === 0;
    const droppedToZeroOnce = samples.filter((s) => s === 0).length >= 1;
    pass(settledAtZero && droppedToZeroOnce, `${tag}: transition ends at scrollY 0 (sample trace: ${samples.join(",")})`);

    pass(errors.length === 0, `${tag}: no console/page errors${errors.length ? ` → ${errors.join(" ; ")}` : ""}`);
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${failures === 0 ? "ALL VERIFICATIONS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
