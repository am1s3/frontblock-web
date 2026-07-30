"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import NewsFeed from "@/components/NewsFeed";
import DevNotice from "@/components/DevNotice";
import { api } from "@/lib/api";

type Row = { nickname: string; faction: string | null; kills: number; deaths: number; kd: number };

export default function Home() {
  const [top, setTop] = useState<Row[]>([]);
  const [tpa, setTpa] = useState(0);
  const [vss, setVss] = useState(0);

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
        <section className="hero" style={{ gridTemplateColumns: "1fr" }}>
          <div className="brief clip" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="brief__stamp" style={{ justifyContent: "center", color: "var(--amber)" }}>
              <span className="devnotice__dot" /> СЕРВЕР В РАЗРАБОТКЕ
            </div>
            <h1 style={{ textTransform: "none", fontSize: "clamp(3rem,9vw,6rem)" }}>Front <span className="tpa">Block</span></h1>
            <p className="brief__sub" style={{ margin: "10px auto 0", fontSize: "1.4rem", color: "var(--txt)" }}>Новый милитари-сервер</p>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 13, marginTop: 16, color: "var(--mut)" }}>
              <span><span className="tpa">ТПА</span> {tpa} в строю</span>
              <span style={{ color: "var(--mut2)" }}>·</span>
              <span><span className="vss">ВСС</span> {vss} в строю</span>
            </div>

            <DevNotice />

            <div className="brief__cta" style={{ justifyContent: "center" }}>
              <Link href="/register" className="btn btn--amber">Занять место в строю</Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <div className="section-h"><h2>Фракции</h2><span>// выбор один раз</span></div>
        <div className="factions">
          <div className="fac fac--tpa clip">
            <div className="fac__tag">ТПА</div>
            <h3>Повстанческая армия</h3>
            <p>Партизаны, рейды и засады. Тактика быстрого удара и FPV-дронов.</p>
            <div className="fac__count">в строю: <b>{tpa}</b></div>
          </div>
          <div className="fac fac--vss clip">
            <div className="fac__tag">ВСС</div>
            <h3>Силы сопротивления</h3>
            <p>Регулярная армия, оборона рубежей и бронетехника.</p>
            <div className="fac__count">в строю: <b>{vss}</b></div>
          </div>
        </div>
      </Reveal>

      <div className="grid-2">
        <Reveal delay={120}>
          <Panel label="НОВОСТИ"><NewsFeed /></Panel>
        </Reveal>
        <Reveal delay={160}>
          <Panel label="ЛУЧШИЕ ИГРОКИ">
            {top.length ? (
              <table className="tbl">
                <thead><tr><th>#</th><th>Игрок</th><th>Фр.</th><th>K/D</th></tr></thead>
                <tbody>{top.map((r, i) => (
                  <tr key={r.nickname}>
                    <td className="mono">{i + 1}</td>
                    <td>{r.nickname}</td>
                    <td className={(r.faction || "").toLowerCase()}>{r.faction || "—"}</td>
                    <td className="mono">{r.kd}</td>
                  </tr>
                ))}</tbody>
              </table>
            ) : <div className="muted">пока нет данных.</div>}
            <div style={{ marginTop: 12 }}><Link href="/leaderboard" className="btn btn--ghost btn--sm">Весь рейтинг →</Link></div>
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
