
import bcrypt from "bcryptjs";
import { Env, json, err, readJson } from "../../../src/lib/api";

export const runtime = "edge";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<{ nickname?: string; password?: string }>(request);
  const nick = body?.nickname?.trim();
  const pass = body?.password ?? "";
  if (!nick || nick.length < 3 || nick.length > 16) return err("ник 3-16 символов");
  if (!/^[a-zA-Z0-9_]+$/.test(nick)) return err("ник: только латиница, цифры, _");
  if (pass.length < 6) return err("пароль минимум 6 символов");

  const exists = await env.DB.prepare("SELECT 1 FROM players WHERE nickname = ?").bind(nick).first();
  if (exists) return err("ник занят", 409);

  const hash = await bcrypt.hash(pass, 10);
  const now = Math.floor(Date.now() / 1000);
  // minecraft_uuid = null: привяжется при первом /login с плагина
  await env.DB.prepare(
    `INSERT INTO players (nickname, password_hash, rank, created_at, last_seen)
     VALUES (?, ?, 1, ?, ?)`
  ).bind(nick, hash, now, now).run();

  return json({ ok: true, nickname: nick });
};
