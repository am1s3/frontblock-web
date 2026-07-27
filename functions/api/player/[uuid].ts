
import { Env, json, err } from "../../../src/lib/api";

export const runtime = "edge";

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;
  // ищем по minecraft_uuid (плагин шлёт именно его); чувствительные поля НЕ отдаём
  const row = await env.DB.prepare(
    `SELECT nickname, rank, faction, subteam, kills, deaths, headshots,
            vehicles_destroyed, money, playtime_seconds, prefix
     FROM players WHERE minecraft_uuid = ? OR uuid = ?`
  ).bind(uuid, uuid).first();
  if (!row) return err("not found", 404);
  return json(row);
};
