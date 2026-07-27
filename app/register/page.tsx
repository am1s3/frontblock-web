"use client";
import { useState } from "react";
import Panel from "@/components/Panel";
import { api } from "@/lib/api";

export default function Register() {
  const [nick, setNick] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setBusy(true);
    const r = await api("/api/auth/register", { method: "POST", body: JSON.stringify({ nickname: nick, password: pass }) });
    setBusy(false);
    if (!r.ok) { setOk(false); setMsg(r.data?.error || "ошибка связи"); return; }
    setOk(true); setMsg("Аккаунт создан. В игре введи /login и этот же пароль.");
  }
  return (
    <>
      <h1 className="page-h">Регистрация</h1>
      <Panel label="РЕГИСТРАЦИЯ">
        <form className="form" onSubmit={submit}>
          <div className="field"><label>НИКНЕЙМ (как в игре)</label><input value={nick} onChange={(e) => setNick(e.target.value)} autoComplete="username" /></div>
          <div className="field"><label>ПАРОЛЬ (минимум 6 символов)</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" /></div>
          <button className="btn btn--tpa" disabled={busy}>{busy ? "Подожди…" : "Зарегистрироваться"}</button>
          {msg && <p className={`msg ${ok ? "ok" : "err"}`}>{msg}</p>}
          <p className="muted" style={{ margin: 0 }}>Фракцию нужно будет выбрать один раз в игре командой /faction.</p>
        </form>
      </Panel>
    </>
  );
}
