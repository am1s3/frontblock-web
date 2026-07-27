import type { D1Database } from "@cloudflare/workers-types";

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  API_KEY: string;
};

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export const err = (msg: string, status = 400) => json({ error: msg }, status);

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try { return await req.json() as T; } catch { return null; }
}

/** Проверка ключа плагина. Публичные эндпоинты сайта (register/login) её НЕ зовут. */
export function checkApiKey(req: Request, env: Env): Response | null {
  if (req.headers.get("X-Api-Key") !== env.API_KEY) return err("unauthorized", 401);
  return null;
}

/** Читаем cookie по имени (для сессии сайта). */
export function cookie(req: Request, name: string): string | null {
  const c = req.headers.get("cookie") ?? "";
  const m = c.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function setCookie(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}
