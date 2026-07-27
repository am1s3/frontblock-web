"use client";
import { useEffect, useState } from "react";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import { GITHUB_RELEASES, GITHUB_API_RELEASES } from "@/lib/api";

type Asset = { name: string; size: number; browser_download_url: string };
type Release = { tag_name: string; name: string; published_at: string; assets: Asset[] };
const mb = (b: number) => (b / 1048576).toFixed(1) + " МБ";

export default function Downloads() {
  const [rel, setRel] = useState<Release | null>(null); const [err, setErr] = useState("");
  useEffect(() => {
    fetch(GITHUB_API_RELEASES).then((r) => r.ok ? r.json() : Promise.reject()).then(setRel).catch(() => setErr("не удалось достать релиз — бери напрямую на GitHub."));
  }, []);
  return (
    <>
      <h1 className="page-h">Сборки <small>// клиент для боя</small></h1>
      <Reveal>
        <Panel label="АКТУАЛЬНАЯ СБОРКА">
          <div className="dl clip">
            <div className="dl__icon">⬡</div>
            <div><h3>Front Block Modpack</h3><p>Forge 1.20.1 · все моды, конфиги и ресурс-пак в одном архиве.</p></div>
            <a className="btn btn--tpa dl__btn" href={GITHUB_RELEASES + "/releases/latest"} target="_blank" rel="noreferrer">Скачать</a>
          </div>
          {rel && rel.assets.map((a) => (
            <div className="asset clip" key={a.name}>
              <code>{a.name}</code><span className="sz">{mb(a.size)}</span>
              <a className="btn btn--ghost btn--sm" href={a.browser_download_url}>↓</a>
            </div>
          ))}
          {err && <p className="msg err" style={{ marginTop: 10 }}>{err}</p>}
          <p className="muted" style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 12 }}>версия {rel?.tag_name || "—"} · обновлено {rel ? new Date(rel.published_at).toLocaleDateString("ru-RU") : "—"}</p>
        </Panel>
      </Reveal>
      <Reveal delay={80}>
        <Panel label="КАК ЗАЙТИ">
          <ol style={{ margin: 0, paddingLeft: 18, color: "var(--mut)", lineHeight: 1.9 }}>
            <li>Скачай и распакуй сборку.</li>
            <li>Зарегистрируйся на сайте и запомни пароль.</li>
            <li>Запусти клиент, зайди на сервер — ты в лобби.</li>
            <li>В чат: <code>/login пароль</code> → <code>/faction TPA</code> или <code>VSS</code>.</li>
            <li>На базе бери кит и — на фронт.</li>
          </ol>
        </Panel>
      </Reveal>
    </>
  );
}
