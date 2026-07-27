
import { Env, json, err, readJson, checkApiKey } from "../../../src/lib/api";

export const runtime = "edge";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const denied = checkApiKey(request, env);
  if (denied) return denied;

  const b = await readJson<any>(request);
  if (!b?.uuid) return err("no uuid");
  const now = Math.floor(Date.now() / 1000);

  // upsert по minecraft_uuid: обновляем боевую статистику, которую прислал плагин
  const res = await env.DB.prepare(
    `UPDATE players SET
       kills = ?, deaths = ?, headshots = ?, vehicles_destroyed = ?,
       money = ?, playtime_seconds = ?, rank = ?, faction = ?, subteam = ?, last_seen = ?
     WHERE minecraft_uuid = ?`
  ).bind(b.kills ?? 0, b.deaths ?? 0, b.headshots ?? 0, b.vehicles_destroyed ?? 0,
         b.money ?? 0, b.playtime_seconds ?? 0, b.rank ?? 1, b.faction ?? null, b.subteam ?? null,
         now, b.uuid).run();

  if ((res.meta?.changes ?? 0) === 0) {
    // строки по minecraft_uuid нет — значит аккаунт есть по нику, но uuid ещё не привязан; не падаем
    return json({ ok: true, linked: false });
  }
  return json({ ok: true, linked: true });
};
