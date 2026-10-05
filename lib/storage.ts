import type { AssessmentInput, StoredResult } from "@/types/assessment";

export interface DraftState {
  step: number;
  answers: Partial<AssessmentInput>;
}

const DRAFT_KEY = "okunbo:assessment-draft";
const RESULTS_KEY = "okunbo:results";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable. Ignore silently.
  }
}

export function generateId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function saveDraft(draft: DraftState): void {
  writeJSON(DRAFT_KEY, draft);
}

export function loadDraft(): DraftState | null {
  return readJSON<DraftState>(DRAFT_KEY);
}

export function clearDraft(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore.
  }
}

export function saveResult(result: StoredResult): void {
  const results = readJSON<Record<string, StoredResult>>(RESULTS_KEY) ?? {};
  results[result.id] = result;
  writeJSON(RESULTS_KEY, results);
}

export function loadResult(id: string): StoredResult | null {
  const results = readJSON<Record<string, StoredResult>>(RESULTS_KEY) ?? {};
  return results[id] ?? null;
}

export function saveLead(lead: unknown): void {
  const leads = readJSON<unknown[]>("okunbo:leads") ?? [];
  leads.push(lead);
  writeJSON("okunbo:leads", leads);
}
