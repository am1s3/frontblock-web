"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import StatBlock from "@/components/StatBlock";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Me = { nickname: string; rank: number; faction: string | null; subteam: string | null; kills: number; deaths: number; headshots: number; vehicles_destroyed: number; money: number; playtime_seconds: number; is_admin: boolean };

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setErr(""); setBusy(true);
      const t = getToken();                       // читаем токен НАПРЯМУЮ из хранилища
      if (!t) { if (alive) { setErr("Сначала войди в систему."); setBusy(false); } return; }
      const r = await api<Me>("/api/me");
      if (!alive) return;
      if (r.ok && r.data) { setMe(r.data); setBusy(false); }
      else { setErr("Сессия истекла — войди заново."); setBusy(false); }
    };
    load();                                       // сразу при открытии
    window.addEventListener("fb:auth", load);     // токен появился/пропал в этой вкладке
    window.addEventListener("storage", load);     // токен изменился в другой вкладке
    return () => { alive = false; window.removeEventListener("fb:auth", load); window.removeEventListener("storage", load); };
  }, []);

  if (busy) return <div className="muted">Загрузка профиля…</div>;
  if (err) return <Panel label="ДОСТУП"><p className="msg err">{err}</p></Panel>;
  if (!me) return null;

  const h = Math.floor(me.playtime_seconds / 3600), m = Math.floor((me.playtime_seconds % 3600) / 60);
  const kd = me.deaths === 0 ? me.kills : +(me.kills / me.deaths).toFixed(2);
  const fac = (me.faction || "—");

  return (
    <>
      <h1 className="page-h">Профиль <small>// {me.nickname}</small></h1>
      <Reveal>
        <Panel label="ОБ ИГРОКЕ" accent={me.faction === "TPA" ? "tpa" : me.faction === "VSS" ? "vss" : undefined}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "baseline" }}>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>НИКНЕЙМ</div><h2 style={{ fontSize: "2rem" }}>{me.nickname}</h2></div>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>РАНГ</div><div style={{ fontSize: "1.3rem", color: "var(--amber)" }}>Ранг {me.rank}</div></div>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>ФРАКЦИЯ</div><div className={fac.toLowerCase()} style={{ fontSize: "1.3rem" }}>{fac}</div></div>
            <div><div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>ОТРЯД</div><div style={{ fontSize: "1.3rem" }}>{me.subteam || "—"}</div></div>
          </div>
        </Panel>
      </Reveal>
      <Reveal delay={80}>
        <div className="grid-4">
          <Panel><StatBlock value={me.kills} label="Убийства" accent="tpa" /></Panel>
          <Panel><StatBlock value={me.deaths} label="Смерти" /></Panel>
          <Panel><StatBlock value={kd} label="K / D" accent="amber" /></Panel>
          <Panel><StatBlock value={me.headshots} label="В голову" /></Panel>
          <Panel><StatBlock value={me.vehicles_destroyed} label="Техника" accent="vss" /></Panel>
          <Panel><StatBlock value={me.money} label="Монеты ¤" accent="amber" /></Panel>
          <Panel><StatBlock value={h} label="Часов в игре" suffix={`ч ${m}м`} /></Panel>
          <Panel><StatBlock value={me.is_admin ? 1 : 0} label={me.is_admin ? "Админ" : "Игрок"} /></Panel>
        </div>
      </Reveal>
    </>
  );
}
