/**
 * Status koneksi akun GitHub (mock), disimpan di localStorage.
 */

const STORAGE_KEY = "sepaham:githubConnected";

export function isGithubConnected(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setGithubConnected(connected: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, connected ? "true" : "false");
  } catch {}
}
