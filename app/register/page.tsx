
"use client";
import { useState } from "react";
export default function Register() {
  const [nick, setNick] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/auth/register", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nick, password: pass }),
    });
    const d = await r.json();
    if (!r.ok) { setOk(false); setMsg(d.error ?? "ошибка"); return; }
    setOk(true); setMsg("Аккаунт создан. Теперь /login в игре тем же паролем.");
  }
  return (
    <div className="wrap">
      <h1>Регистрация</h1>
      <form onSubmit={submit} className="card">
        <input placeholder="Ник (как в игре)" value={nick} onChange={e => setNick(e.target.value)} />
        <input placeholder="Пароль (мин. 6)" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button>Создать аккаунт</button>
        {msg && <p className={ok ? "ok" : "err"}>{msg}</p>}
      </form>
    </div>
  );
}
