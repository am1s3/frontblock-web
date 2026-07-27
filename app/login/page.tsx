"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Panel from "@/components/Panel";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function Login() {
  const [nick, setNick] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setBusy(true);
    const r = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ nickname: nick, password: pass }) });
    setBusy(false);
    if (!r.ok) { setOk(false); setMsg(r.data?.error || "ошибка связи"); return; }
    setToken(r.data.token); setOk(true); setMsg("Вход выполнен. Переход в профиль…");
    setTimeout(() => router.push("/profile"), 700);
  }
  return (
    <>
      <h1 className="page-h">Вход</h1>
      <Panel label="АВТОРИЗАЦИЯ">
        <form className="form" onSubmit={submit}>
          <div className="field"><label>НИКНЕЙМ</label><input value={nick} onChange={(e) => setNick(e.target.value)} autoComplete="username" /></div>
          <div className="field"><label>ПАРОЛЬ</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" /></div>
          <button className="btn btn--vss" disabled={busy}>{busy ? "Проверка…" : "Войти"}</button>
          {msg && <p className={`msg ${ok ? "ok" : "err"}`}>{msg}</p>}
          <p className="muted" style={{ margin: 0 }}>Нет аккаунта? <Link href="/register" style={{ color: "var(--amber)" }}>Регистрация</Link></p>
        </form>
      </Panel>
    </>
  );
}
