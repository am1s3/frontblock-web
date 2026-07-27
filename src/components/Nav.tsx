"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Nav() {
  const { nick, isAdmin, loading, logout } = useAuth();
  return (
    <header className="nav clip">
      <Link href="/" className="nav__logo">FRONT<span>BLOCK</span></Link>
      <nav className="nav__links">
        <Link href="/">Брифинг</Link>
        <Link href="/leaderboard">Рейтинг</Link>
        <Link href="/downloads">Сборки</Link>
        {!loading && nick && <Link href="/profile">Профиль</Link>}
        {!loading && isAdmin && <Link href="/admin" className="nav__admin">Админка</Link>}
      </nav>
      <div className="nav__right">
        {!loading && nick ? (
          <>
            <span className="nav__who">боец <b>{nick}</b></span>
            <button className="btn btn--ghost" onClick={logout}>Выйти</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn--ghost">Вход</Link>
            <Link href="/register" className="btn btn--tpa">В строй</Link>
          </>
        )}
      </div>
    </header>
  );
}
