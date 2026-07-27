"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import CopyIp from "@/components/CopyIp";
import NewsFeed from "@/components/NewsFeed";
import StatBlock from "@/components/StatBlock";
import { api } from "@/lib/api";

type Row = { nickname: string; faction: string | null; kills: number; deaths: number; kd: number };

export default function Home() {
  const [top, setTop] = useState<Row[]>([]);
  const [tpa, setTpa] = useState(0); const [vss, setVss] = useState(0);
  useEffect(() => {
    api<Row[]>("/api/leaderboard").then((r) => {
      if (r.ok && Array.isArray(r.data)) {
        setTop(r.data.slice(0, 3));
        setTpa(r.data.filter((x) => x.faction === "TPA").length);
        setVss(r.data.filter((x) => x.faction === "VSS").length);
      }
    });
  }, []);

  return (
    <>
      <Reveal>
        <section className="hero">
          <div className="brief clip">
            <div className="brief__stamp"><span className="live-dot" /> ФРОНТ АКТИВЕН · СЕКТОР A–F</div>
            <h1>ВОЙНА<br />ЗА <em>КАЖДЫЙ</em><br />МЕТР</h1>
            <p className="brief__sub">Милитари-сервер на 1.20.1. Две фракции, линия фронта в 5 километров, танки, вертолёты и FPV-дроны. Без регистрации на сайте в бой не пустят.</p>
            <div className="brief__coords">
              <span>LAT 50.4501</span><span>LON 30.5234</span><span>GRID 36U</span><span>v1.20.1 / FORGE</span>
            </div>
            <div className="brief__cta">
              <Link href="/register" className="btn btn--tpa">Встать в строй</Link>
              <Link href="/downloads" className="btn btn--ghost">Скачать сборку</Link>
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            <CopyIp />
            <Panel label="СИЛЫ СТОРОН">
              <div className="grid-2" style={{ margin: 0 }}>
                <StatBlock value={tpa} label="ТПА в строю" accent="tpa" />
                <StatBlock value={vss} label="ВСС в строю" accent="vss" />
              </div>
            </Panel>
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <div className="section-h"><h2>Фракции</h2><span>// выбери один раз — намертво</span></div>
        <div className="factions">
          <div className="fac fac--tpa clip">
            <div className="fac__tag">ТПА</div>
            <h3>Повстанческая армия</h3>
            <p>Партизаны, рейды, засады и рои FPV-дронов. Красная повязка, лесной камуфляж, тактика удара и ухода.</p>
            <div className="fac__count">в строю: <b>{tpa}</b></div>
          </div>
          <div className="fac fac--vss clip">
            <div className="fac__tag">ВСС</div>
            <h3>Силы сопротивления</h3>
            <p>Регулярка, оборона рубежей и бронетехника. Синяя повязка, стандарт НАТО, дисциплина и огневой вал.</p>
            <div className="fac__count">в строю: <b>{vss}</b></div>
          </div>
        </div>
      </Reveal>

      <div className="grid-2">
        <Reveal delay={120}>
          <Panel label="СВОДКИ С ФРОНТА"><NewsFeed /></Panel>
        </Reveal>
        <Reveal delay={160}>
          <Panel label="ТОП БОЙЦОВ">
            {top.length ? (
              <table className="tbl"><thead><tr><th>#</th><th>Боец</th><th>Фр.</th><th>K/D</th></tr></thead>
                <tbody>{top.map((r, i) => (
                  <tr key={r.nickname}><td className="mono">{i + 1}</td><td>{r.nickname}</td>
                    <td className={(r.faction || "").toLowerCase()}>{r.faction || "—"}</td><td className="mono">{r.kd}</td></tr>
                ))}</tbody></table>
            ) : <div className="muted">пока пусто — иди навоюй.</div>}
            <div style={{ marginTop: 12 }}><Link href="/leaderboard" className="btn btn--ghost btn--sm">Весь рейтинг →</Link></div>
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
