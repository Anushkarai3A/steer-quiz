/**
 * End-to-end smoke test for the Steer prototype.
 *
 * Runs the real app in headless Chrome (system Chrome, no browser download),
 * walks the complete six-screen flow, checks responsive overflow at every
 * breakpoint, above-the-fold fit of the hook, every new interaction (signal
 * concepts, pathway steps, comparison cards, concern explanations), keyboard
 * access, reduced-motion behaviour, browser back-navigation, concern-specific
 * summaries, the pressure-free finish path, analytics events and console
 * errors.
 *
 * Usage:
 *   npm run build && npm run preview      (serves dist on :4173)
 *   npm run smoke
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const outDir = path.join(root, "smoke-output");
fs.mkdirSync(outDir, { recursive: true });

const BASE = process.env.SMOKE_URL ?? "http://localhost:4173/";
const CHROME =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

/** Generous wait after a hook tap (reply + Discover press + transition). */
const AFTER_HOOK_MS = 1350;

const VIEWPORTS = [
  { w: 320, h: 640, name: "mobile-320" },
  { w: 375, h: 780, name: "mobile-375" },
  { w: 390, h: 844, name: "mobile-390" },
  { w: 430, h: 900, name: "mobile-430" },
  { w: 768, h: 1024, name: "tablet-768" },
  { w: 1280, h: 900, name: "desktop-1280" },
];

let failures = 0;
const pass = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures += 1;
};

const ignoreError = (text) =>
  /Failed to load resource|net::ERR|fonts\.gstatic|fonts\.googleapis|favicon/i.test(text);

function watch(page, bag) {
  page.on("console", (msg) => {
    if (msg.type() === "error" && !ignoreError(msg.text())) bag.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => bag.push(`pageerror: ${err.message}`));
}

async function overflowReport(page) {
  return page.evaluate(() => {
    const se = document.scrollingElement;
    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
      })
      .slice(0, 6)
      .map((el) => (typeof el.className === "string" && el.className ? `.${el.className.split(" ")[0]}` : el.tagName));
    return { scrollWidth: se.scrollWidth, clientWidth: se.clientWidth, offenders };
  });
}

async function measure(page, label, acc) {
  const rep = await overflowReport(page);
  const clean = rep.scrollWidth <= rep.clientWidth + 1 && rep.offenders.length === 0;
  pass(clean, `${label}: no horizontal overflow (${rep.scrollWidth}/${rep.clientWidth}${rep.offenders.length ? ` offenders=${rep.offenders.join(",")}` : ""})`);
  acc.push({ label, ...rep });
}

/** Hook screen must fit above the fold: headline + supporting + question + all answers. */
async function measureHookFold(page, label) {
  const fold = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".answer-card")];
    const last = cards[cards.length - 1]?.getBoundingClientRect();
    const support = document.querySelector(".screen-hook .hook-support")?.getBoundingClientRect();
    const question = document.querySelector(".screen-hook .hook-question")?.getBoundingClientRect();
    const h1 = document.querySelector(".screen-hook h1")?.getBoundingClientRect();
    return {
      cards: cards.length,
      lastBottom: last ? Math.round(last.bottom) : null,
      supportBottom: support ? Math.round(support.bottom) : null,
      questionBottom: question ? Math.round(question.bottom) : null,
      h1Bottom: h1 ? Math.round(h1.bottom) : null,
      vh: window.innerHeight,
    };
  });
  pass(
    fold.cards === 3 && fold.lastBottom !== null && fold.lastBottom <= fold.vh,
    `${label}: all answers above the fold (last card bottom ${fold.lastBottom}px of ${fold.vh}px)`,
  );
  pass(
    fold.h1Bottom !== null && fold.h1Bottom <= fold.vh &&
      fold.supportBottom !== null && fold.supportBottom <= fold.vh &&
      fold.questionBottom !== null && fold.questionBottom <= fold.vh,
    `${label}: headline, supporting text and question above the fold (question bottom ${fold.questionBottom}px of ${fold.vh}px)`,
  );
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
}

/** Picks a hook answer, asserts the instant reply, then discovers how it works. */
async function answerAndContinue(page, answerIndex = 1) {
  await page.locator(".answer-list .answer-card").nth(answerIndex).click();
  const cont = page.getByRole("button", { name: /^Discover how it works/ });
  await cont.waitFor({ state: "visible", timeout: 3000 });
  await cont.click();
  await page.waitForTimeout(900);
}

/** Walks the full experience and asserts the key interactions. */
async function runFlow(page, errors, tag, { takeShots = true } = {}) {
  await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector(".answer-card");
  if (takeShots) await shot(page, `${tag}-1-hook`);

  // 1. Hook: eyebrow/headline visible; pick the weight answer; reply appears at once.
  const eyebrow = await page.locator(".screen-hook .kicker").innerText();
  pass(eyebrow.includes("A NOTE FOR YOU"), `${tag}: hook eyebrow reads "A NOTE FOR YOU"`);
  const headline = await page.locator(".screen-hook h1").innerText();
  pass(
    /You've been trying so hard/i.test(headline) && /feel so difficult/i.test(headline),
    `${tag}: hook headline matches the empathetic opening`,
  );
  const support = await page.locator(".screen-hook .hook-support").innerText();
  pass(
    /more complicated than willpower alone/i.test(support),
    `${tag}: supporting line present under the headline`,
  );
  const meta = await page.locator(".progress-meta span").first().innerText();
  pass(meta.includes("THE QUESTION"), `${tag}: progress shows stage label "${meta}"`);
  pass(
    (await page.getByRole("button", { name: /^Discover how it works/ }).count()) === 0,
    `${tag}: no "Discover how it works" button before an answer is chosen`,
  );
  const answerPatterns = [
    /brain, digestive system, hormones, sleep/i,
    /many interacting factors/i,
    /interconnected signals to regulate appetite and blood glucose/i,
  ];
  for (let i = 0; i < 3; i += 1) {
    await page.locator(".answer-list .answer-card").nth(i).click();
    const response = await page.locator(".answer-response").innerText();
    pass(answerPatterns[i].test(response), `${tag}: answer ${i + 1} shows its own explanation`);
    pass(
      (await page.locator(".answer-response").count()) === 1,
      `${tag}: answer ${i + 1} shows exactly one explanation`,
    );
  }
  await page.locator(".answer-list .answer-card").nth(1).click();
  const cont = page.getByRole("button", { name: /^Discover how it works/ });
  pass(await cont.isVisible(), `${tag}: "Discover how it works" appears with the reply`);
  await cont.click();
  await page.waitForTimeout(900);
  pass((await page.locator(".kicker").innerText()).includes("THE SIGNALS"), `${tag}: Continue transitions to the signals screen`);
  if (takeShots) await shot(page, `${tag}-2-signals`);

  // 2. Signals: all three concepts respond with distinct explanations + sources.
  pass(
    (await page.locator(".signal-concept").count()) === 3,
    `${tag}: three selectable hunger-signal concepts`,
  );
  const conceptTexts = [];
  const conceptNames = ["Hunger", "Fullness", "Digestion"];
  const conceptPatterns = [
    /messages between your gut, brain and body/i,
    /stretch and hormone signals/i,
    /digestive system is part of the conversation/i,
  ];
  for (let i = 0; i < 3; i += 1) {
    const concept = page.locator(".signal-concept").nth(i);
    await concept.click();
    pass(
      (await concept.getAttribute("aria-pressed")) === "true",
      `${tag}: concept "${conceptNames[i]}" exposes aria-pressed after tapping`,
    );
    const text = await page.locator(".signal-explain-text").innerText();
    conceptTexts.push(text);
    pass(
      conceptPatterns[i].test(text),
      `${tag}: concept "${conceptNames[i]}" reveals its explanation`,
    );
    pass(
      (await page.locator(".signal-explain .claim-sources").count()) === 1,
      `${tag}: concept "${conceptNames[i]}" shows sources next to the explanation`,
    );
  }
  pass(new Set(conceptTexts).size === 3, `${tag}: all three concepts render distinct copy`);
  if (takeShots) await shot(page, `${tag}-3-signals-selected`);

  // 3. Myth flip opens; sources are one tap away (collapsed by default).
  const myth = page.locator(".flip-card").first();
  await myth.locator(".flip-trigger").click();
  await page.waitForTimeout(700);
  pass((await myth.locator(".flip-trigger").getAttribute("aria-expanded")) === "true", `${tag}: myth flip reports aria-expanded=true`);
  pass(await myth.locator(".flip-back").isVisible(), `${tag}: myth flip reveals back face`);
  const align = await page.locator(".flip-text").first().evaluate((el) => getComputedStyle(el).textAlign);
  pass(align === "left", `${tag}: flip card copy is left-aligned (${align})`);
  pass(!(await page.locator(".claim-sources a").first().isVisible()), `${tag}: sources start collapsed`);
  await page.locator(".claim-sources summary").first().click();
  pass(await page.locator(".claim-sources a").first().isVisible(), `${tag}: source links visible after opening the panel`);
  if (takeShots) await shot(page, `${tag}-4-mythflipped`);

  // 4. GLP-1 pathway: three clickable steps + takeaway.
  await page.getByRole("button", { name: /What about GLP-1/i }).click();
  await page.waitForTimeout(900);
  pass((await page.locator(".kicker").innerText()).includes("THE PATHWAY"), `${tag}: reaches the GLP-1 pathway screen`);
  pass(
    (await page.locator(".claim-sources").count()) === 1,
    `${tag}: pathway screen consolidates sources into one block`,
  );
  const takeaway = await page.locator(".screen-glp1 .takeaway-card p").innerText();
  pass(/isn't the whole story/i.test(takeaway), `${tag}: takeaway frames GLP-1 as one signal among many`);
  pass(
    (await page.locator(".pathway-trigger").count()) === 3,
    `${tag}: pathway shows three steps`,
  );
  pass(
    (await page.locator(".pathway-trigger").nth(0).getAttribute("aria-expanded")) === "true",
    `${tag}: step 1 starts open`,
  );
  await page.locator(".pathway-trigger").nth(1).click();
  await page.waitForTimeout(450);
  pass(
    (await page.locator(".pathway-trigger").nth(1).getAttribute("aria-expanded")) === "true" &&
      (await page.locator(".pathway-trigger").nth(0).getAttribute("aria-expanded")) === "false",
    `${tag}: tapping step 2 highlights it and collapses step 1`,
  );
  const stepTwo = await page.locator(".pathway-detail").nth(1).innerText();
  pass(/pancreas/i.test(stepTwo), `${tag}: step 2 reveals its explanation`);
  await page.locator(".pathway-trigger").nth(2).click();
  await page.waitForTimeout(450);
  const stepThree = await page.locator(".pathway-detail").nth(2).innerText();
  pass(/depends on glucose/i.test(stepThree), `${tag}: step 3 reveals its explanation`);
  await page.locator(".pathway-trigger").nth(2).click();
  await page.waitForTimeout(450);
  pass(
    (await page.locator(".pathway-trigger").nth(2).getAttribute("aria-expanded")) === "false",
    `${tag}: tapping the active step collapses it`,
  );
  if (takeShots) await shot(page, `${tag}-5-pathway`);

  // 5. Natural vs medicines: two tap-to-expand cards.
  await page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).click();
  await page.waitForTimeout(900);
  pass(
    (await page.locator(".kicker").innerText()).includes("NATURAL VS MEDICINES"),
    `${tag}: reaches the natural-vs-medicines screen`,
  );
  pass((await page.locator(".compare-card").count()) === 2, `${tag}: two comparison cards`);
  pass(
    (await page.locator(".compare-trigger").nth(0).getAttribute("aria-expanded")) === "false" &&
      (await page.locator(".compare-trigger").nth(1).getAttribute("aria-expanded")) === "false",
    `${tag}: both cards start collapsed`,
  );
  await page.locator(".compare-trigger").nth(0).click();
  await page.waitForTimeout(450);
  const naturalBody = await page.locator(".compare-detail").nth(0).innerText();
  pass(
    (await page.locator(".compare-trigger").nth(0).getAttribute("aria-expanded")) === "true" &&
      /releases GLP-1 after a meal/i.test(naturalBody),
    `${tag}: natural GLP-1 card expands with its explanation`,
  );
  await page.locator(".compare-trigger").nth(1).click();
  await page.waitForTimeout(450);
  const medicineBody = await page.locator(".compare-detail").nth(1).innerText();
  pass(
    (await page.locator(".compare-trigger").nth(1).getAttribute("aria-expanded")) === "true" &&
      /not appropriate for everyone/i.test(medicineBody),
    `${tag}: medicines card expands with its explanation`,
  );
  pass(
    /qualified clinician/i.test(await page.locator(".screen-medicines .note").innerText()),
    `${tag}: clinician note present on the comparison screen`,
  );
  pass(
    (await page.locator(".claim-sources").count()) === 1,
    `${tag}: comparison screen consolidates sources into one block`,
  );
  if (takeShots) await shot(page, `${tag}-6-medicines`);

  // 6. Concern selection shows an inline explanation + sources.
  await page.getByRole("button", { name: /My biggest question/i }).click();
  await page.waitForTimeout(900);
  const continueBtn = page.getByRole("button", { name: /My takeaway/i });
  pass(await continueBtn.isDisabled(), `${tag}: continue disabled before a concern is chosen`);
  await page.locator(".concern-card").nth(1).click();
  pass((await page.locator(".concern-card").nth(1).getAttribute("aria-pressed")) === "true", `${tag}: concern card exposes aria-pressed`);
  await page.waitForTimeout(400);
  const markBg = await page
    .locator(".concern-mark.is-on")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  pass(markBg === "rgb(192, 78, 42)", `${tag}: selection indicator uses brand rust (${markBg})`);
  pass(await page.locator(".concern-answer").isVisible(), `${tag}: selecting a concern shows an inline explanation`);
  pass(
    (await page.locator(".concern-answer .claim-sources").count()) === 1,
    `${tag}: inline concern explanation carries source links`,
  );
  pass(await continueBtn.isEnabled(), `${tag}: continue enabled after selection`);
  if (takeShots) await shot(page, `${tag}-7-concern`);
  await continueBtn.click();
  await page.waitForTimeout(1100);

  // 7. Summary must match the chosen concern (side effects) and recap the journey.
  const stamp = await page.locator(".notes-stamp").innerText();
  pass(stamp.includes("YOUR FIELD NOTES"), `${tag}: summary shows YOUR FIELD NOTES stamp`);
  pass(
    (await page.locator(".screen-summary h1").innerText()).includes("Better questions"),
    `${tag}: final screen headline is "Better questions. Clearer conversations."`,
  );
  const heading = await page.locator(".summary-card h2").innerText();
  pass(/side effects and safety/i.test(heading), `${tag}: summary heading matches selected concern ("${heading}")`);
  const body = await page.locator(".summary-card").innerText();
  pass(/side effects/i.test(body), `${tag}: concern-specific summary copy rendered`);
  pass(!/hunger and fullness/i.test(body), `${tag}: summary does not render other concerns' copy`);
  const recapItems = await page.locator(".recap-list li").allInnerTexts();
  pass(recapItems.length === 3, `${tag}: recap shows three takeaways`);
  pass(
    /not a character flaw/i.test(recapItems[0]) &&
      /GLP-1 is one of those signals/i.test(recapItems[1]) &&
      /Medicines act on the same pathway/i.test(recapItems[2]),
    `${tag}: recap reflects the journey (signals → pathway → medicines)`,
  );
  if (takeShots) await shot(page, `${tag}-8-summary`);

  // 8. Optional CTA, pressure-free finish, restart.
  const cta = page.locator("a.link-button");
  const href = await cta.getAttribute("href");
  pass(href === "https://steerclub.com/", `${tag}: CTA points at the verified Steer URL (${href})`);
  await page.evaluate(() => {
    document.querySelector("a.link-button")?.addEventListener("click", (e) => e.preventDefault(), true);
  });
  await cta.click();
  await page.waitForTimeout(300);
  const quiet = page.getByRole("button", { name: /I'm happy with what I learned/i });
  pass(await quiet.isVisible(), `${tag}: quiet secondary option sits next to the CTA`);

  await quiet.click();
  await page.waitForTimeout(500);
  const finishHeadline = await page.locator(".finish-panel h2").innerText();
  pass(/end of the field notes/i.test(finishHeadline), `${tag}: finishing without the CTA shows a quiet completion panel`);
  pass(
    (await page.locator(".finish-panel .quiet-link").getAttribute("href")) === "https://steerclub.com/",
    `${tag}: finish panel keeps a secondary Steer link`,
  );
  pass(await page.locator(".summary-card").isVisible(), `${tag}: field notes remain visible after finishing`);
  if (takeShots) await shot(page, `${tag}-9-finished`);

  await page.getByRole("button", { name: /Start over/i }).click();
  await page.waitForTimeout(900);
  pass(await page.locator(".answer-card").first().isVisible(), `${tag}: restart returns to the hook`);

  const events = await page.evaluate(() => JSON.parse(localStorage.getItem("steer:fieldnotes:events:v1") ?? "[]").join("|"));
  for (const expected of [
    "experience_started",
    "hook_answer_selected",
    "signal_concept_selected",
    "pathway_step_selected",
    "compare_card_opened",
    "science_card_opened",
    "concern_selected",
    "experience_completed",
    "steer_cta_clicked",
    "experience_finished",
    "experience_restarted",
  ]) {
    pass(events.includes(expected), `${tag}: analytics recorded ${expected}`);
  }

  pass(errors.length === 0, `${tag}: no console/page errors${errors.length ? ` → ${errors.join(" ; ")}` : ""}`);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

// --- responsive pass -------------------------------------------------------
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  const acc = [];
  try {
    await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector(".answer-card");
    await measure(page, `${vp.name} hook`, acc);
    await measureHookFold(page, vp.name);
    await shot(page, `${vp.name}-hook`);

    await answerAndContinue(page, 2);
    await measure(page, `${vp.name} signals`, acc);
    await shot(page, `${vp.name}-signals`);

    await page.getByRole("button", { name: /What about GLP-1/i }).click();
    await page.waitForTimeout(900);
    await measure(page, `${vp.name} glp1`, acc);

    await page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).click();
    await page.waitForTimeout(900);
    await measure(page, `${vp.name} medicines`, acc);

    await page.getByRole("button", { name: /My biggest question/i }).click();
    await page.waitForTimeout(900);
    await measure(page, `${vp.name} concern`, acc);
    await shot(page, `${vp.name}-concern`);

    await page.locator(".concern-card").nth(3).click();
    await page.getByRole("button", { name: /My takeaway/i }).click();
    await page.waitForTimeout(1100);
    await measure(page, `${vp.name} summary`, acc);
    await shot(page, `${vp.name}-summary`);

    pass(errors.length === 0, `${vp.name}: no console/page errors${errors.length ? ` → ${errors.join(" ; ")}` : ""}`);
  } catch (err) {
    pass(false, `${vp.name}: flow threw → ${err.message}`);
  }
  await ctx.close();
}

// --- keyboard pass ---------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  await page.goto(BASE, { waitUntil: "load" });
  let focusedAnswer = false;
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press("Tab");
    const cls = await page.evaluate(() => document.activeElement?.className ?? "");
    if (typeof cls === "string" && cls.includes("answer-card")) {
      focusedAnswer = true;
      break;
    }
  }
  pass(focusedAnswer, "keyboard: answer card is reachable with Tab");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  pass(await page.locator(".answer-response").isVisible(), "keyboard: reply appears after Enter");
  let focusedContinue = false;
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    const cls = await page.evaluate(() => document.activeElement?.className ?? "");
    if (typeof cls === "string" && cls.includes("hook-continue")) {
      focusedContinue = true;
      break;
    }
  }
  pass(focusedContinue, "keyboard: Discover button is reachable with Tab");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  pass((await page.locator(".kicker").innerText()).includes("THE SIGNALS"), "keyboard: Enter on Discover advances to the signals screen");
  // signal concept via keyboard
  await page.locator(".signal-concept").first().focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(350);
  pass(
    (await page.locator(".signal-concept").first().getAttribute("aria-pressed")) === "true",
    "keyboard: Enter activates a signal concept",
  );
  const myth = page.locator(".flip-card").first();
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press("Tab");
    const cls = await page.evaluate(() => document.activeElement?.className ?? "");
    if (typeof cls === "string" && cls.includes("flip-trigger")) break;
  }
  await page.keyboard.press("Enter");
  await page.waitForTimeout(650);
  pass(await myth.locator(".flip-back").isVisible(), "keyboard: myth flip opens with Enter");
  pass(errors.length === 0, `keyboard: no errors ${errors.join(" ; ")}`);
  await ctx.close();
}

// --- refresh resets to the hook; the local event log survives ---------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  await page.goto(BASE, { waitUntil: "load" });
  await page.locator(".answer-list .answer-card").nth(0).click();
  await answerAndContinue(page, 0);
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector(".answer-card");
  pass(await page.locator(".answer-card").first().isVisible(), "refresh: returns to the hook (no stale in-progress screen)");
  pass((await page.locator(".progress-meta span").first().innerText()).includes("THE QUESTION"), "refresh: progress resets to step 1");
  const kept = await page.evaluate(() => localStorage.getItem("steer:fieldnotes:events:v1") ?? "");
  pass(kept.includes("hook_answer_selected"), "refresh: anonymous event log is preserved");
  pass(errors.length === 0, `refresh: no errors ${errors.join(" ; ")}`);
  await ctx.close();
}

// --- browser back-navigation stays inside the experience --------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  try {
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector(".answer-card");
    await answerAndContinue(page, 1); // hook → signals
    await page.getByRole("button", { name: /What about GLP-1/i }).click();
    await page.waitForTimeout(900); // signals → glp1

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.evaluate(() => history.back());
    await page.waitForTimeout(700);
    pass(
      (await page.locator(".kicker").innerText()).includes("THE SIGNALS"),
      "back-nav: browser Back returns to the signals screen",
    );
    pass(
      (await page.evaluate(() => Math.round(window.scrollY))) === 0,
      "back-nav: returned screen starts at scroll position 0",
    );

    await page.evaluate(() => history.back());
    await page.waitForTimeout(700);
    pass(await page.locator(".answer-card").first().isVisible(), "back-nav: Back again returns to the hook");
    pass(
      (await page.locator(".progress-meta span").first().innerText()).includes("THE QUESTION"),
      "back-nav: progress follows the history entry",
    );
    // The chosen answer must survive the round trip (needed downstream).
    pass(
      (await page.locator(".answer-card.is-selected").count()) === 1 &&
        (await page.locator(".answer-card.is-selected .answer-response").isVisible()),
      "back-nav: selected hook answer is preserved with its explanation",
    );
    pass(
      await page.getByRole("button", { name: /^Discover how it works/ }).isVisible(),
      "back-nav: Discover action still available for the preserved answer",
    );
    pass(errors.length === 0, `back-nav: no errors ${errors.join(" ; ")}`);
  } catch (err) {
    pass(false, `back-nav: flow threw → ${err.message}`);
  }
  await ctx.close();
}

// --- reduced-motion pass ---------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  await runFlow(page, errors, "reduced-motion", { takeShots: false });
  await ctx.close();
}

// --- full flow, screenshots ------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  await runFlow(page, errors, "flow");
  await ctx.close();
}

// --- scroll position must reset on every screen change ---------------------
{
  for (const vp of [
    { w: 320, h: 640, name: "scroll-mobile" },
    { w: 1280, h: 900, name: "scroll-desktop" },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    watch(page, errors);
    try {
      await page.goto(BASE, { waitUntil: "load" });
      await page.waitForSelector(".answer-card");

      const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
      /** Scrolls the page to its maximum, then reports { y, max } — returns y before the click. */
      const scrollMax = async () =>
        page.evaluate(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          const el = document.scrollingElement;
          return { y: Math.round(window.scrollY), max: Math.round(el.scrollHeight - el.clientHeight) };
        });
      const atTop = async (label, wasY) => {
        const y = await scrollY();
        pass(y === 0, `${vp.name} ${label}: opens at the very top (scrollY ${y}; was scrolled to ${wasY})`);
        const progressTop = await page
          .locator(".progress-block")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top));
        pass(progressTop >= 0 && progressTop < vp.h / 2, `${vp.name} ${label}: progress bar visible at top of viewport (top ${progressTop}px)`);
      };

      // hook → signals (answer first, then the Discover CTA from the bottom)
      const hookMax = await scrollMax();
      await page.locator(".answer-card").nth(1).click();
      const continueBtn = page.getByRole("button", { name: /^Discover how it works/ });
      await continueBtn.scrollIntoViewIfNeeded();
      const beforeSignals = await scrollY();
      await continueBtn.click();
      await page.waitForTimeout(900);
      await atTop("signals", beforeSignals);
      pass(hookMax.max > 0, `${vp.name} signals: scroll test is meaningful (hook scrolled ${hookMax.y}px of ${hookMax.max}px)`);

      // same-screen interactions must NOT reset scroll: myth flip on signals
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const flip = page.locator(".flip-card").last().locator(".flip-trigger");
      await flip.scrollIntoViewIfNeeded();
      const yBeforeFlip = await scrollY();
      pass(yBeforeFlip > 0, `${vp.name} same-screen: positioned mid-page before flipping (scrollY ${yBeforeFlip})`);
      await flip.click();
      await page.waitForTimeout(700);
      pass(
        (await flip.getAttribute("aria-expanded")) === "true" && Math.abs((await scrollY()) - yBeforeFlip) <= 2,
        `${vp.name} same-screen: myth flip keeps the scroll position (${yBeforeFlip} → ${await scrollY()})`,
      );

      // signals → glp1
      let before = await page.getByRole("button", { name: /What about GLP-1/i }).boundingBox();
      pass(before !== null, `${vp.name} glp1: continue button present`);
      await page.getByRole("button", { name: /What about GLP-1/i }).scrollIntoViewIfNeeded();
      before = await scrollY();
      await page.getByRole("button", { name: /What about GLP-1/i }).click();
      await page.waitForTimeout(900);
      await atTop("glp1", before);

      // same-screen: pathway step opens without resetting scroll (from the bottom).
      // Selecting step 3 collapses the open step 1 ABOVE it, which legitimately
      // shifts scrollY (content above shrank) — so assert what matters: the
      // click does not reset scroll to the top, the step expands, and the thing
      // you clicked stays visible in the viewport.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const step3 = page.locator(".pathway-trigger").nth(2);
      await step3.scrollIntoViewIfNeeded();
      const yBeforeStep = await scrollY();
      pass(yBeforeStep > 0, `${vp.name} same-screen: positioned mid-page before opening a pathway step (scrollY ${yBeforeStep})`);
      await step3.click();
      await page.waitForTimeout(500);
      const yAfterStep = await scrollY();
      const step3Expanded = (await step3.getAttribute("aria-expanded")) === "true";
      const step3InView = await step3.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= -1 && r.top < window.innerHeight;
      });
      pass(
        step3Expanded && yAfterStep > 0 && step3InView,
        `${vp.name} same-screen: opening a pathway step expands in place without a scroll reset (${yBeforeStep} → ${yAfterStep}, in view: ${step3InView})`,
      );

      // glp1 → medicines
      await page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).scrollIntoViewIfNeeded();
      before = await scrollY();
      await page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).click();
      await page.waitForTimeout(900);
      await atTop("medicines", before);

      // medicines → concern
      await page.getByRole("button", { name: /My biggest question/i }).scrollIntoViewIfNeeded();
      before = await scrollY();
      await page.getByRole("button", { name: /My biggest question/i }).click();
      await page.waitForTimeout(900);
      await atTop("concern", before);

      // concern → summary
      await page.locator(".concern-card").nth(1).click();
      before = await scrollMax();
      await page.getByRole("button", { name: /My takeaway/i }).scrollIntoViewIfNeeded();
      before = await scrollY();
      await page.getByRole("button", { name: /My takeaway/i }).click();
      await page.waitForTimeout(1100);
      await atTop("summary", before);

      // summary → restart (Start over navigates back to the hook)
      before = await scrollMax();
      await page.getByRole("button", { name: /Start over/i }).scrollIntoViewIfNeeded();
      before = await scrollY();
      await page.getByRole("button", { name: /Start over/i }).click();
      await page.waitForTimeout(900);
      await atTop("hook after restart", before);

      pass(errors.length === 0, `${vp.name} scroll: no console/page errors${errors.length ? ` → ${errors.join(" ; ")}` : ""}`);
    } catch (err) {
      pass(false, `${vp.name} scroll: flow threw → ${err.message}`);
    }
    await ctx.close();
  }
}

// --- network: no unexpected external requests ------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const urls = [];
  page.on("request", (req) => {
    const u = new URL(req.url());
    if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") urls.push(u.hostname);
  });
  await page.goto(BASE, { waitUntil: "load" });
  await page.locator(".answer-list .answer-card").nth(0).click();
  await answerAndContinue(page, 0);
  await page.getByRole("button", { name: /What about GLP-1/i }).click();
  await page.waitForTimeout(400);
  const hosts = [...new Set(urls)];
  pass(
    hosts.every((h) => h.includes("google") || h.includes("gstatic")),
    `no third-party calls beyond fonts (${hosts.join(", ") || "none"})`,
  );
  await ctx.close();
}

// --- each concern must produce its own summary -----------------------------
{
  const cases = [
    { idx: 0, heading: /Will I regain weight/i, body: /regain/i },
    { idx: 1, heading: /side effects and safety/i, body: /side effects/i },
    { idx: 2, heading: /hunger and fullness/i, body: /hunger and fullness/i },
    { idx: 3, heading: /appropriate for me/i, body: /cannot determine/i },
  ];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  watch(page, errors);
  const bodies = [];
  const inlineSummaries = [];
  for (const c of cases) {
    await page.goto(BASE, { waitUntil: "load" });
    await page.locator(".answer-list .answer-card").nth(0).click();
    await answerAndContinue(page, 0);
    await page.getByRole("button", { name: /What about GLP-1/i }).click();
    await page.waitForTimeout(900);
    await page.getByRole("button", { name: /Natural GLP-1 vs medicines/i }).click();
    await page.waitForTimeout(900);
    await page.getByRole("button", { name: /My biggest question/i }).click();
    await page.waitForTimeout(900);
    await page.locator(".concern-card").nth(c.idx).click();
    const inline = await page.locator(".concern-answer p").innerText();
    inlineSummaries.push(inline);
    await page.getByRole("button", { name: /My takeaway/i }).click();
    await page.waitForTimeout(1100);
    const heading = await page.locator(".summary-card h2").innerText();
    const body = await page.locator(".summary-card").innerText();
    pass(
      c.heading.test(heading) && c.body.test(body),
      `concern #${c.idx}: summary matches selection ("${heading}")`,
    );
    pass(
      c.body.test(inline),
      `concern #${c.idx}: inline explanation shown on selection matches too`,
    );
    bodies.push(body);
    if (c.idx === 0) await shot(page, "flow-summary-regain");
  }
  pass(new Set(bodies).size === 4, `all four concerns render distinct summary copy (${new Set(bodies).size}/4)`);
  pass(
    !bodies.some((b) => /you qualify|you are eligible|you should take/i.test(b)),
    "summaries never claim eligibility or prescribe",
  );
  pass(
    !inlineSummaries.some((b) => /you qualify|you are eligible|you should take/i.test(b)),
    "inline explanations never claim eligibility or prescribe",
  );
  pass(errors.length === 0, `concern sweep: no console/page errors ${errors.join(" ; ")}`);
  await ctx.close();
}

await browser.close();

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
