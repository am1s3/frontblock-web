"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type P = { nickname: string; rank: number; faction: string | null; is_banned: number; is_admin: number; kills: number; deaths: number; money: number; exp: number };

// СИНХРОНИЗИРУЙ с plugins/FrontBlockApi/ranks.yml (пороги опыта по рангам)
const RANK_EXP = [0, 100, 300, 700, 1500, 3000];
const rankFromExp = (exp: number) => { let r = 1; RANK_EXP.forEach((t, i) => { if (exp >= t) r = i + 1; }); return Math.min(r, 6); };

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const [players, setPlayers] = useState<P[]>([]);
  const [msg, setMsg] = useState("");
  const [nt, setNt] = useState({ title: "", body: "" });
  const reload = () => api<P[]>("/api/admin/players").then((r) => { if (r.ok && Array.isArray(r.data)) setPlayers(r.data); });
  useEffect(() => { if (!loading && isAdmin) reload(); }, [isAdmin, loading]);
  const act = async (path: string, body: any) => { const r = await api(path, { method: "POST", body: JSON.stringify(body) }); setMsg(r.ok ? "✓ выполнено" : (r.data?.error || "ошибка")); if (r.ok) reload(); };
  const postNews = async (e: React.FormEvent) => { e.preventDefault(); const r = await api("/api/admin/news", { method: "POST", body: JSON.stringify(nt) }); setMsg(r.ok ? "✓ новость опубликована" : (r.data?.error || "ошибка")); if (r.ok) setNt({ title: "", body: "" }); };
  if (loading) return <div className="muted">Проверка прав…</div>;
  if (!isAdmin) return <Panel label="НЕТ ДОСТУПА"><p className="msg err">Эта страница только для администраторов.</p></Panel>;
  return (
    <>
      <h1 className="page-h">Админ-панель</h1>
      {msg && <p className="msg ok" style={{ marginBottom: 8 }}>{msg}</p>}
      <Panel label="ИГРОКИ">
        <table className="tbl">
          <thead><tr><th>Игрок</th><th>Ранг</th><th>EXP</th><th>Фр.</th><th>K/D</th><th>¤</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>{players.map((p) => (
            <tr key={p.nickname}>
              <td><b>{p.nickname}</b>{p.is_admin ? <span className="vss"> ★</span> : null}</td>
              <td className="mono">{p.rank}</td>
              <td className="mono">{p.exp || 0}</td>
              <td className={(p.faction || "").toLowerCase()}>{p.faction || "—"}</td>
              <td className="mono">{p.deaths ? (p.kills / p.deaths).toFixed(1) : p.kills}</td>
              <td className="mono">{p.money}</td>
              <td>{p.is_banned ? <span className="tpa">БАН</span> : <span style={{ color: "var(--ok)" }}>актив</span>}</td>
              <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button className="btn btn--ghost btn--sm" onClick={() => act(p.is_banned ? "/api/admin/unban" : "/api/admin/ban", { nickname: p.nickname, reason: "нарушение правил" })}>{p.is_banned ? "Разбан" : "Бан"}</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { const v = prompt("Ранг (1-6)", String(p.rank)); if (v) { const rv = Number(v); act("/api/admin/setrank", { nickname: p.nickname, value: rv, exp: RANK_EXP[rv - 1] || 0 }); } }}>Ранг</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { const n = prompt("Добавить EXP", "100"); if (n) { const ne = (p.exp || 0) + Number(n); act("/api/admin/setexp", { nickname: p.nickname, value: ne, rank: rankFromExp(ne) }); } }}>+EXP</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { const n = prompt("Задать EXP", String(p.exp || 0)); if (n !== null) { const ne = Number(n); act("/api/admin/setexp", { nickname: p.nickname, value: ne, rank: rankFromExp(ne) }); } }}>=EXP</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { if (confirm("Сбросить статистику " + p.nickname + "?")) act("/api/admin/resetstats", { nickname: p.nickname }); }}>Сброс</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { const v = prompt("Префикс (пусто = сброс)", ""); if (v !== null) act("/api/admin/setprefix", { nickname: p.nickname, value: v || null }); }}>Префикс</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { const v = prompt("Фракция TPA/VSS (пусто = сброс)", p.faction || ""); if (v !== null) act("/api/admin/setfaction", { nickname: p.nickname, value: v.toUpperCase() || null }); }}>Фракция</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        <p className="muted" style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11 }}>Ранг/опыт/сброс с сайта применяются в игре при следующем входе игрока. Мгновенно — через /fb в игре.</p>
      </Panel>
      <Panel label="НОВОСТИ">
        <form className="form" onSubmit={postNews} style={{ maxWidth: "100%" }}>
          <div className="field"><label>ЗАГОЛОВОК</label><input value={nt.title} onChange={(e) => setNt({ ...nt, title: e.target.value })} /></div>
          <div className="field"><label>ТЕКСТ</label><input value={nt.body} onChange={(e) => setNt({ ...nt, body: e.target.value })} /></div>
          <button className="btn btn--amber" style={{ justifySelf: "start" }}>Опубликовать</button>
        </form>
      </Panel>
    </>
  );
}
