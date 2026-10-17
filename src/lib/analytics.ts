/**
 * Lightweight analytics abstraction for the Steer hackathon prototype.
 *
 * Design goals (see docs/ANALYTICS.md):
 * - No third-party service, no API keys, no network calls.
 * - Only anonymous interaction events. Never names, phone numbers, medical
 *   records, free text, or anything that identifies a person.
 * - The selected health concern stays on this device (localStorage) and is
 *   never transmitted anywhere.
 * - Swappable adapter: replace `localAdapter` with a privacy-reviewed vendor
 *   adapter later without touching call sites.
 */

export type AnalyticsEventName =
  | "experience_started"
  | "hook_answer_selected"
  | "signal_concept_selected"
  | "pathway_step_selected"
  | "compare_card_opened"
  | "science_card_opened"
  | "concern_selected"
  | "experience_completed"
  | "steer_cta_clicked"
  | "experience_finished"
  | "experience_restarted";

export type AnalyticsProps = Record<string, string | number | boolean>;

/** A persisted record: either a bare event name or `name {"prop":...}`. */
export type StoredEvent = string;

export type AnalyticsAdapter = {
  name: string;
  track: (event: AnalyticsEventName, props?: AnalyticsProps) => void;
};

const STORAGE_KEY = "steer:fieldnotes:events:v1";
const MAX_EVENTS = 200;

const readEvents = (): StoredEvent[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: StoredEvent[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    /* storage disabled (private mode) — analytics becomes in-memory only */
  }
};

/** In-memory buffer so the demo works even when storage is unavailable. */
let memoryEvents: StoredEvent[] = [];

/**
 * Default adapter: stores a capped, anonymous event log in localStorage and
 * mirrors it onto `window.__steerAnalytics` so the demo can be inspected in
 * the browser console or asserted in automated tests.
 */
const localAdapter: AnalyticsAdapter = {
  name: "local",
  track: (event, props) => {
    const record: StoredEvent = props && Object.keys(props).length
      ? `${event} ${JSON.stringify(props)}`
      : event;

    memoryEvents = [...memoryEvents, record].slice(-MAX_EVENTS);
    const stored = [...readEvents(), record].slice(-MAX_EVENTS);
    writeEvents(stored);

    if (typeof window !== "undefined") {
      window.__steerAnalytics = {
        name: localAdapter.name,
        events: memoryEvents,
        stored: readEvents(),
        clearedAt: (window.__steerAnalytics as { clearedAt?: number } | undefined)?.clearedAt,
      };
    }

    if (import.meta.env.DEV) {
      console.debug("[analytics]", event, props ?? {});
    }
  },
};

let adapter: AnalyticsAdapter = localAdapter;

export function useAnalyticsAdapter(next: AnalyticsAdapter) {
  adapter = next;
}

/** Records an anonymous interaction event. Never throws. */
export function track(event: AnalyticsEventName, props?: AnalyticsProps) {
  try {
    adapter.track(event, props);
  } catch {
    /* analytics must never break the experience */
  }
}

export function getStoredEvents(): StoredEvent[] {
  if (typeof window === "undefined") return memoryEvents;
  const stored = readEvents();
  return stored.length ? stored : memoryEvents;
}

/** Clears the local event log (used by the demo / restart flow). */
export function clearStoredEvents() {
  memoryEvents = [];
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

declare global {
  interface Window {
    __steerAnalytics?: {
      name: string;
      events: StoredEvent[];
      stored: StoredEvent[];
      clearedAt?: number;
    };
  }
}
