"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function Nav() {
  const { nick, isAdmin, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`nav clip ${open ? "nav--open" : ""}`}>
      <Link href="/" className="nav__logo" onClick={close}>FRONT <span>BLOCK</span></Link>

      <button className="nav__burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span /><span /><span />
      </button>

      <div className="nav__panel">
        <nav className="nav__links" onClick={close}>
          <Link href="/">Главная</Link>
          <Link href="/leaderboard">Рейтинг</Link>
          <Link href="/squads">Отряды</Link>
          {!loading && nick && <Link href="/profile">Профиль</Link>}
          {!loading && isAdmin && <Link href="/admin" className="nav__admin">Админка</Link>}
        </nav>
        <div className="nav__right" onClick={close}>
          {!loading && nick ? (
            <>
              <span className="nav__who"><b>{nick}</b></span>
              <button className="btn btn--ghost" onClick={logout}>Выйти</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn--ghost">Вход</Link>
              <Link href="/register" className="btn btn--tpa">Регистрация</Link>
            </>
          )}
        </div>
      </div>

      {open && <button className="nav__scrim" aria-label="Закрыть меню" onClick={close} />}
    </header>
  );
}
