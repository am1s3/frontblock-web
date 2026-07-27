import bcrypt from "bcryptjs";
import { Env, json, err, readJson, checkApiKey } from "../../../src/lib/api";

export const runtime = "edge";

// Ответ ПОЛЯМИ совпадает с parseProfile в плагине — не меняй имена ключей!
type Out = {
  uuid: string; nickname: string; rank: number; faction: string | null; subteam: string | null;
  kills: number; deaths: number; headshots: number; money: number; playtime_seconds: number;
  prefix: string | null; is_banned: boolean; ban_reason: string | null;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const denied = checkApiKey(request, env);   // плагин обязан прислать X-Api-Key
  if (denied) return denied;

  const body = await readJson<{ nickname?: string; password?: string; uuid?: string }>(request);
  const nick = body?.nickname ?? "";
  const mcUuid = body?.uuid ?? "";            // uuid пришёл ОТ плагина

  const row = await env.DB.prepare("SELECT * FROM players WHERE nickname = ?").bind(nick).first<any>();
  if (!row) return err("no account", 404);    // плагин поймёт 404 как «нет аккаунта»
  const ok = await bcrypt.compare(body?.password ?? "", row.password_hash);
  if (!ok) return err("bad password", 401);

  // привязка minecraft uuid при первом логине (дыра, которую закрыли)
  if (mcUuid && (!row.minecraft_uuid || row.minecraft_uuid !== mcUuid)) {
    await env.DB.prepare("UPDATE players SET minecraft_uuid = ?, last_seen = ? WHERE uuid = ?")
      .bind(mcUuid, Math.floor(Date.now() / 1000), row.uuid).run();
    row.minecraft_uuid = mcUuid;
  } else {
    await env.DB.prepare("UPDATE players SET last_seen = ? WHERE uuid = ?")
      .bind(Math.floor(Date.now() / 1000), row.uuid).run();
  }

  const out: Out = {
    uuid: row.minecraft_uuid ?? row.uuid,     // плагину отдаём minecraft uuid как ключ
    nickname: row.nickname, rank: row.rank, faction: row.faction, subteam: row.subteam,
    kills: row.kills, deaths: row.deaths, headshots: row.headshots,
    money: row.money, playtime_seconds: row.playtime_seconds,
    prefix: row.prefix, is_banned: !!row.is_banned, ban_reason: row.ban_reason,
  };
  return json(out);
};
