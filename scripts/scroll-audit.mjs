/**
 * Scroll audit — instrumented verification of scroll reset on every screen
 * transition. Designed to FAIL when the scroll reset is missing (it is run
 * both with and without the fix to prove the check is sensitive).
 *
 * For each transition it records:
 *   - the document scrollTop AFTER manually scrolling to the bottom
 *   - the document scrollTop mid-transition (old screen exiting)
 *   - the document scrollTop + Steer header position AFTER the new screen
 *   - scrollTop of any nested overflow-y container (should none exist)
 *
 * Usage:
 *   node scripts/scroll-audit.mjs                 # audits preview + dev
 *   AUDIT_URL=http://localhost:4173/ node scripts/scroll-audit.mjs
 */
import { chromium } from "playwright-core";

const CHROME =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGETS = process.env.AUDIT_URL
  ? [{ base: process.env.AUDIT_URL, name: process.env.AUDIT_NAME ?? process.env.AUDIT_URL }]
  : [
      { base: "http://localhost:4173/", name: "preview(build)" },
      { base: "http://localhost:5199/", name: "dev" },
    ];
const VIEWPORTS = [
  { w: 320, h: 640, n: "320x640" },
  { w: 390, h: 844, n: "390x844" },
  { w: 1280, h: 900, n: "1280x900" },
];

let failures = 0;
const pass = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures += 1;
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

/** Inspects the live DOM to identify which element actually owns scrolling. */
async function diagnose(page) {
  return page.evaluate(() => {
    const doc = document.scrollingElement;
    const scrollers = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const oy = getComputedStyle(el).overflowY;
        return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1;
      })
      .map((el) => ({
        el: typeof el.className === "string" && el.className ? `.${el.className.split(" ")[0]}` : el.tagName,
        scrollTop: Math.round(el.scrollTop),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      }));
    return {
      scrollOwner: doc ? doc.tagName : "none",
      docScrollTop: doc ? Math.round(doc.scrollTop) : -1,
      docScrollHeight: doc ? doc.scrollHeight : -1,
      docClientHeight: doc ? doc.clientHeight : -1,
      htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      scrollers,
    };
  });
}

const snap = (page) =>
  page.evaluate(() => {
    const doc = document.scrollingElement;
    const header = document.querySelector(".topbar")?.getBoundingClientRect();
    const nested = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const oy = getComputedStyle(el).overflowY;
        return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1;
      })
      .map((el) => ({
        el: typeof el.className === "string" && el.className ? `.${el.className.split(" ")[0]}` : el.tagName,
        scrollTop: Math.round(el.scrollTop),
      }));
    return {
      y: Math.round(window.scrollY),
      headerTop: header ? Math.round(header.top) : null,
      headerBottom: header ? Math.round(header.bottom) : null,
      nested,
    };
  });

for (const target of TARGETS) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource|fonts|favicon/.test(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    const tag = `${target.name} ${vp.n}`;

    try {
      await page.goto(target.base, { waitUntil: "load", timeout: 30000 });
      await page.waitForSelector(".answer-card");
      // Fonts swap changes layout (and max scroll); wait so measurements are stable.
      await page.evaluate(() => document.fonts.ready);

      // --- Step 1: which element owns the scroll? --------------------------
      const diag = await diagnose(page);
      if (vp.n === "390x844" && target.name.includes("preview")) {
        console.log(
          `DIAG  scroll owner=${diag.scrollOwner} (html overflow-y=${diag.htmlOverflowY}, body overflow-y=${diag.bodyOverflowY}); ` +
            `nested overflow-y scrollers=${diag.scrollers.length ? diag.scrollers.map((s) => s.el).join(",") : "NONE"}`,
        );
      }
      pass(
        diag.scrollOwner === "HTML" && diag.scrollers.length === 0,
        `${tag}: document is the scrolling element, no nested scroller (owner=${diag.scrollOwner})`,
      );

      /**
       * Navigate while scrolled to the bottom. The click target is brought into
        * view BEFORE snapshotting so any pre-click scroll (Playwright
        * actionability) lands outside the measurement window — after that,
        * `mid`/`after` capture only what happens because of the click itself.
        * `setup` runs before the scroll (e.g. picking a hook answer so the
        * "Discover how it works" button exists).
        */
      const step = async (label, target, setup) => {
        if (setup) await setup();
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await target.scrollIntoViewIfNeeded();
        await page.waitForTimeout(80);
        const before = await snap(page);
        await target.click();
        await page.waitForTimeout(60); // mid-transition: old screen exiting
        const mid = await snap(page);
        await page.waitForTimeout(1350); // after new screen painted
        const after = await snap(page);

        const scrolled = before.y > 0 || label.includes("hook");
        pass(
          scrolled,
          `${tag} ${label}: scrolled current screen to ${before.y}px before navigating`,
        );
        pass(
          mid.y === before.y,
          `${tag} ${label}: no premature jump while old screen exits (mid ${mid.y}px, was ${before.y}px)`,
        );
        pass(
          after.y === 0,
          `${tag} ${label}: next screen at scroll position 0 (before=${before.y} mid=${mid.y} after=${after.y})`,
        );
        pass(
          after.headerTop === 0 && after.headerBottom > 0 && after.headerBottom <= vp.h,
          `${tag} ${label}: Steer header back at top of viewport (header top=${after.headerTop}, bottom=${after.headerBottom})`,
        );
        pass(
          after.nested.every((n) => n.scrollTop === 0),
          `${tag} ${label}: no nested container holding a stale scrollTop (${after.nested.length ? JSON.stringify(after.nested) : "none"})`,
        );
      };

      const pickAnswer = (index) => async () => {
        await page.locator(".answer-card").nth(index).click();
        await page.waitForTimeout(350); // reply + Discover button render
      };
      const continueBtn = page.getByRole("button", { name: /^Discover how it works/ });

      // --- Steps 2-4: every screen transition ------------------------------
      await step("hook→signals", continueBtn, pickAnswer(1));
      await step("signals→glp1", page.getByRole("button", { name: /What about GLP-1/i }));
      await step(
        "glp1→medicines",
        page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }),
      );
      await step(
        "medicines→concern",
        page.getByRole("button", { name: /My biggest question/i }),
      );
      // concern must be chosen while its card is in view (before scrolling to the CTA)
      await page.locator(".concern-card").nth(1).click();
      await step("concern→summary", page.getByRole("button", { name: /My takeaway/i }));
      await step("summary→hook (Start over)", page.getByRole("button", { name: /Start over/i }));
      await step("hook→signals again", continueBtn, pickAnswer(0));
      // backward path: the header restart button (header sits at the top, so it
      // is reachable without scrolling); landing must be the hook at scroll 0
      await page.getByRole("button", { name: /Restart experience/i }).click();
      await page.waitForTimeout(900);
      const back = await snap(page);
      pass(
        back.y === 0 && back.headerTop === 0,
        `${tag} backward (header restart): lands on hook at top (scrollY ${back.y}, header top ${back.headerTop})`,
      );

      // navigate hook → signals (flips live on the signals screen)
      await step("hook→signals (for flip test)", continueBtn, pickAnswer(1));

      // same-screen interaction must NOT reset scroll
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const flip = page.locator(".flip-card").last().locator(".flip-trigger");
      await flip.scrollIntoViewIfNeeded();
      const yb = (await snap(page)).y;
      await flip.click();
      await page.waitForTimeout(700);
      const ya = (await snap(page)).y;
      pass(
        (await flip.getAttribute("aria-expanded")) === "true" && Math.abs(ya - yb) <= 2,
        `${tag} same-screen flip keeps scroll (${yb}px → ${ya}px, aria-expanded true)`,
      );

      pass(errors.length === 0, `${tag}: no console/page errors${errors.length ? ` → ${errors.join(" ; ")}` : ""}`);
    } catch (err) {
      pass(false, `${tag}: audit threw → ${err.message}`);
    }
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${failures === 0 ? "AUDIT PASSED — all screens start at 0" : `AUDIT FAILED — ${failures} check(s)`}`);
process.exit(failures === 0 ? 0 : 1);
