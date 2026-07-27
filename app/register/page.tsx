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
    setOk(true); setMsg("Боец зарегистрирован. Тем же паролем жми /login в игре.");
  }
  return (
    <>
      <h1 className="page-h">Призыв <small>// новый боец</small></h1>
      <Panel label="РЕГИСТРАЦИЯ">
        <form className="form" onSubmit={submit}>
          <div className="field"><label>ПОЗЫВНОЙ (как в игре)</label><input value={nick} onChange={(e) => setNick(e.target.value)} autoComplete="username" /></div>
          <div className="field"><label>ПАРОЛЬ (мин. 6)</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" /></div>
          <button className="btn btn--tpa" disabled={busy}>{busy ? "ОБРАБОТКА…" : "ВСТУПИТЬ"}</button>
          {msg && <p className={`msg ${ok ? "ok" : "err"}`}>{msg}</p>}
          <p className="muted" style={{ margin: 0 }}>После регистрации фракцию выберешь один раз в игре через /faction.</p>
        </form>
      </Panel>
    </>
  );
}
