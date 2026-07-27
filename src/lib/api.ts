// Мозг один на всех. Сайт ходит с Bearer-токеном, плагин — с X-Api-Key (сайт ключ НЕ видит).
export const WORKER = "https://frontblock-api.shushko-art.workers.dev";
export const GITHUB_RELEASES = "https://github.com/ТВОЙ_ЛОГИН/frontblock-modpack"; // для downloads
export const GITHUB_API_RELEASES = "https://api.github.com/repos/ТВОЙ_ЛОГИН/frontblock-modpack/releases/latest";
export const SERVER_IP = "play.frontblock.dev"; // впиши реальный IP/домен сервера

export type ApiResp<T = any> = { ok: boolean; status: number; data: T | null };

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<ApiResp<T>> {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("fb_token") : null;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (token) headers["authorization"] = "Bearer " + token;
  try {
    const r = await fetch(WORKER + path, { ...opts, headers });
    const data = await r.json().catch(() => null);
    return { ok: r.ok, status: r.status, data };
  } catch (e: any) {
    return { ok: false, status: 0, data: { error: "связь с фронтом потеряна: " + (e?.message ?? e) } };
  }
}
