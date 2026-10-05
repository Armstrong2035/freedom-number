export type AnalyticsEvent =
  | "landing_view"
  | "assessment_started"
  | "question_completed"
  | "assessment_abandoned"
  | "assessment_completed"
  | "results_viewed"
  | "lead_capture_started"
  | "lead_captured"
  | "consultation_clicked"
  | "share_clicked";

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

const isBrowser = typeof window !== "undefined";

export function track(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {},
): void {
  if (!isBrowser) return;

  const payload = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  // V1: log locally. Wire to a provider (e.g. Supabase or a tag manager) in Phase 2.
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }

  // Keep an in-memory queue for later forwarding.
  const queue = (window as unknown as { __okunboEvents?: unknown[] })
    .__okunboEvents ?? [];
  queue.push(payload);
  (window as unknown as { __okunboEvents?: unknown[] }).__okunboEvents = queue;
}
