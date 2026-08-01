"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import StatBlock from "@/components/StatBlock";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Me = { nickname: string; rank: number; faction: string | null; subteam: string | null; kills: number; deaths: number; headshots: number; vehicles_destroyed: number; money: number; playtime_seconds: number; exp: number; is_admin: boolean };

// СИНХРОНИЗИРУЙ с plugins/FrontBlockApi/ranks.yml (пороги exp и названия)
const RANKS = [
  { rank: 1, name: "Новобранец", exp: 0 },
  { rank: 2, name: "Рядовой", exp: 100 },
  { rank: 3, name: "Ефрейтор", exp: 300 },
  { rank: 4, name: "Сержант", exp: 700 },
  { rank: 5, name: "Лейтенант", exp: 1500 },
  { rank: 6, name: "Капитан", exp: 3000 },
];

function rankInfo(exp: number, rank: number) {
  const cur = RANKS.find((r) => r.rank === rank) || RANKS[0];
  const next = RANKS.find((r) => r.rank === rank + 1);
  const into = Math.max(0, exp - cur.exp);
  const size = next ? next.exp - cur.exp : 0;
  const pct = next ? Math.max(0, Math.min(100, (into / size) * 100)) : 100;
  return { cur, next, into, size, pct };
}

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setErr(""); setBusy(true);
      const t = getToken();
      if (!t) { if (alive) { setErr("Сначала войди в систему."); setBusy(false); } return; }
      const r = await api<Me>("/api/me");
      if (!alive) return;
      if (r.ok && r.data) { setMe(r.data); setBusy(false); }
      else { setErr("Сессия истекла — войди заново."); setBusy(false); }
    };
    load();
    window.addEventListener("fb:auth", load);
    window.addEventListener("storage", load);
    return () => { alive = false; window.removeEventListener("fb:auth", load); window.removeEventListener("storage", load); };
  }, []);

  if (busy) return <div className="muted">Загрузка профиля…</div>;
  if (err) return <Panel label="ДОСТУП"><p className="msg err">{err}</p></Panel>;
  if (!me) return null;

  const h = Math.floor(me.playtime_seconds / 3600), m = Math.floor((me.playtime_seconds % 3600) / 60);
  const kd = me.deaths === 0 ? me.kills : +(me.kills / me.deaths).toFixed(2);
  const fac = me.faction || "—";
  const ri = rankInfo(me.exp || 0, me.rank);

  return (
    <>
      <h1 className="page-h">Профиль <small>// {me.nickname}</small></h1>

      <Reveal>
        <Panel label="РАНГ И ОПЫТ" accent={me.faction === "TPA" ? "tpa" : me.faction === "VSS" ? "vss" : undefined}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--amber)" }}>РАНГ {ri.cur.rank}</div>
            <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)" }}>{ri.cur.name}</div>
            {ri.next && <div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>→ {ri.next.name}</div>}
          </div>
          <div style={{ marginTop: 14, position: "relative", height: 22, background: "var(--bg2)", border: "1px solid var(--line2)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, width: `${ri.pct}%`, background: "linear-gradient(90deg, var(--amber), #f0c060)", transition: "width .6s ease" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#10141a", mixBlendMode: "difference" }}>
              <span>{Math.round(ri.pct)}%</span>
              <span>{me.exp || 0} EXP</span>
            </div>
          </div>
          <div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 6 }}>
            {ri.next ? `${ri.into} / ${ri.size} до следующего ранга` : "максимальный ранг достигнут ★"}
          </div>
        </Panel>
      </Reveal>

      <Reveal delay={60}>
        <Panel label="ОБ ИГРОКЕ" accent={me.faction === "TPA" ? "tpa" : me.faction === "VSS" ? "vss" : undefined}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "baseline" }}>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>НИКНЕЙМ</div><h2 style={{ fontSize: "2rem" }}>{me.nickname}</h2></div>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>ФРАКЦИЯ</div><div className={fac.toLowerCase()} style={{ fontSize: "1.3rem" }}>{fac}</div></div>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>ОТРЯД</div><div style={{ fontSize: "1.3rem" }}>{me.subteam || "—"}</div></div>
          </div>
        </Panel>
      </Reveal>

      <Reveal delay={120}>
        <div className="grid-4">
          <Panel><StatBlock value={me.kills} label="Убийства" accent="tpa" /></Panel>
          <Panel><StatBlock value={me.deaths} label="Смерти" /></Panel>
          <Panel><StatBlock value={kd} label="K / D" accent="amber" /></Panel>
          <Panel><StatBlock value={me.headshots} label="В голову" /></Panel>
          <Panel><StatBlock value={me.vehicles_destroyed} label="Техника" accent="vss" /></Panel>
          <Panel><StatBlock value={me.money} label="Монеты ¤" accent="amber" /></Panel>
          <Panel><StatBlock value={h} label="Часов в игре" suffix={`ч ${m}м`} /></Panel>
          <Panel><StatBlock value={me.exp || 0} label="Опыт EXP" accent="amber" /></Panel>
        </div>
      </Reveal>
    </>
  );
}
