"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Panel from "@/components/Panel";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function Register() {
  const [nick, setNick] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setBusy(true);
    const creds = { nickname: nick, password: pass };
    const r = await api("/api/auth/register", { method: "POST", body: JSON.stringify(creds) });
    if (!r.ok) { setBusy(false); setOk(false); setMsg(r.data?.error || "ошибка связи"); return; }
    const lr = await api("/api/auth/login", { method: "POST", body: JSON.stringify(creds) });
    setBusy(false);
    if (lr.ok && lr.data?.token) {
      setToken(lr.data.token);
      setOk(true); setMsg("Аккаунт создан, вход выполнен. Открываем профиль…");
      setTimeout(() => router.push("/profile"), 600);
    } else {
      setOk(true); setMsg("Аккаунт создан, но авто-вход не удался — войди вручную.");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1 className="page-h" style={{ textAlign: "center" }}>Регистрация</h1>
        <Panel label="РЕГИСТРАЦИЯ">
          <form className="form" onSubmit={submit}>
            <div className="field"><label>НИКНЕЙМ (как в игре)</label><input value={nick} onChange={(e) => setNick(e.target.value)} autoComplete="username" /></div>
            <div className="field"><label>ПАРОЛЬ (минимум 6 символов)</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" /></div>
            <button className="btn btn--tpa" disabled={busy}>{busy ? "Подожди…" : "Зарегистрироваться"}</button>
            {msg && <p className={`msg ${ok ? "ok" : "err"}`}>{msg}</p>}
            <p className="muted" style={{ margin: 0 }}>Фракцию нужно будет выбрать один раз в игре командой /faction.</p>
          </form>
        </Panel>
      </div>
    </div>
  );
}
