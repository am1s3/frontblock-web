"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";

type Row = { nickname: string; rank: number; faction: string | null; kills: number; deaths: number; kd: number };

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]); const [loaded, setLoaded] = useState(false);
  useEffect(() => { api<Row[]>("/api/leaderboard").then((r) => { if (r.ok && Array.isArray(r.data)) setRows(r.data); setLoaded(true); }); }, []);
  return (
    <>
      <h1 className="page-h">Рейтинг игроков</h1>
      <Reveal>
        <Panel label="ТАБЛИЦА ИГРОКОВ">
          {!loaded ? <div className="muted">загрузка…</div> : !rows.length ? <div className="muted">Пока нет данных.</div> : (
            <table className="tbl"><thead><tr><th>#</th><th>Игрок</th><th>Фракция</th><th>Ранг</th><th>Убийства</th><th>Смерти</th><th>K/D</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={r.nickname}>
                  <td className="mono">{i + 1}</td><td><b>{r.nickname}</b></td>
                  <td className={(r.faction || "").toLowerCase()}>{r.faction || "—"}</td><td className="mono">{r.rank}</td>
                  <td className="mono tpa">{r.kills}</td><td className="mono">{r.deaths}</td><td className="mono" style={{ color: "var(--amber)" }}>{r.kd}</td>
                </tr>
              ))}</tbody></table>
          )}
        </Panel>
      </Reveal>
    </>
  );
}
