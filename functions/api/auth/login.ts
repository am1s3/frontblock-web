import bcrypt from "bcryptjs";
import { Env, json, err, readJson, setCookie } from "../../../src/lib/api";
import { signJwt } from "../../../src/lib/jwt";

export const runtime = "edge";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<{ nickname?: string; password?: string }>(request);
  const row = await env.DB.prepare(
    "SELECT uuid, nickname, password_hash, is_banned FROM players WHERE nickname = ?"
  ).bind(body?.nickname ?? "").first<{ uuid: string; nickname: string; password_hash: string; is_banned: number }>();

  if (!row) return err("неверный ник или пароль", 401);
  if (row.is_banned) return err("аккаунт забанен", 403);
  const ok = await bcrypt.compare(body?.password ?? "", row.password_hash);
  if (!ok) return err("неверный ник или пароль", 401);

  const token = await signJwt({ sub: row.uuid, nick: row.nickname, exp: Math.floor(Date.now() / 1000) + 7 * 86400 }, env.JWT_SECRET);
  return new Response(JSON.stringify({ ok: true, nickname: row.nickname }), {
    status: 200,
    headers: { "content-type": "application/json", "set-cookie": setCookie("fb_session", token) },
  });
};
