/**
 * State moderasi dosen (localStorage): grup yang dibanned & request yang ditutup.
 */

const BANNED_KEY = "sepaham:bannedGroups";
const CLOSED_KEY = "sepaham:closedRequests";

function readSet(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function writeSet(key: string, ids: string[]): void {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch {}
}

function toggle(key: string, id: string): string[] {
  const ids = readSet(key);
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  writeSet(key, next);
  return next;
}

export const getBannedGroups = () => readSet(BANNED_KEY);
export const toggleBanGroup = (id: string) => toggle(BANNED_KEY, id);
export const getClosedRequests = () => readSet(CLOSED_KEY);
export const toggleCloseRequest = (id: string) => toggle(CLOSED_KEY, id);
