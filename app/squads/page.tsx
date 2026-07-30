"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Squad = { id: number; name: string; leader_nickname: string; faction: string | null; approved: number; created_at: number };

export default function Squads() {
  const { isAdmin, nick, loading: authLoading } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = () => api<Squad[]>("/api/squads").then((r) => { if (r.ok && Array.isArray(r.data)) setSquads(r.data); setLoaded(true); });
  useEffect(() => { reload(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(""); setBusy(true);
    const r = await api("/api/squads", { method: "POST", body: JSON.stringify({ name }) });
    setBusy(false);
    if (r.ok) { setMsg("✓ Отряд создан, ждёт одобрения."); setName(""); reload(); }
    else setMsg(r.data?.error || "ошибка");
  };

  const approve = async (id: number, val: boolean) => {
    await api(`/api/squads/${id}/${val ? "approve" : "reject"}`, { method: "POST" });
    reload();
  };

  const approved = squads.filter((s) => s.approved);
  const pending = squads.filter((s) => !s.approved);

  return (
    <>
      <h1 className="page-h">Отряды <small>// боевые единицы</small></h1>

      {msg && <p className="msg ok" style={{ marginBottom: 10 }}>{msg}</p>}

      <Reveal>
        <Panel label="СПИСОК ОТРЯДОВ">
          {!loaded ? <div className="muted">загрузка…</div> : !approved.length ? <div className="muted">Пока нет одобренных отрядов.</div> : (
            <table className="tbl">
              <thead><tr><th>Отряд</th><th>Командир</th><th>Фракция</th><th>Статус</th>{isAdmin && <th>Действия</th>}</tr></thead>
              <tbody>{approved.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.name}</b></td>
                  <td>{s.leader_nickname}</td>
                  <td className={(s.faction || "").toLowerCase()}>{s.faction || "—"}</td>
                  <td style={{ color: "var(--ok)" }}>одобрен</td>
                  {isAdmin && <td><button className="btn btn--ghost btn--sm" onClick={() => approve(s.id, false)}>Отозвать</button></td>}
                </tr>
              ))}</tbody>
            </table>
          )}
        </Panel>
      </Reveal>

      {isAdmin && pending.length > 0 && (
        <Reveal delay={80}>
          <Panel label="НА ОДОБРЕНИИ" accent="amber">
            <table className="tbl">
              <thead><tr><th>Отряд</th><th>Командир</th><th>Фракция</th><th>Действия</th></tr></thead>
              <tbody>{pending.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.name}</b></td>
                  <td>{s.leader_nickname}</td>
                  <td className={(s.faction || "").toLowerCase()}>{s.faction || "—"}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => approve(s.id, true)}>✓ Одобрить</button>
                    <button className="btn btn--ghost btn--sm" onClick={() => approve(s.id, false)}>✕ Отклонить</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </Panel>
        </Reveal>
      )}

      {!authLoading && nick && (
        <Reveal delay={160}>
          <Panel label="СОЗДАТЬ ОТРЯД (ранг 4+)">
            <form className="form" onSubmit={create} style={{ maxWidth: "100%" }}>
              <div className="field"><label>НАЗВАНИЕ ОТРЯДА</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="2-24 символа" /></div>
              <button className="btn btn--amber" style={{ justifySelf: "start" }} disabled={busy}>{busy ? "Создание…" : "Создать"}</button>
              <p className="muted" style={{ margin: "8px 0 0" }}>Отряд появится в списке после одобрения администратора.</p>
            </form>
          </Panel>
        </Reveal>
      )}
    </>
  );
}
