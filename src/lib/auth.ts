"use client";
import { useEffect, useState } from "react";
import { api } from "./api";

export const getToken = () => (typeof localStorage !== "undefined" ? localStorage.getItem("fb_token") : null);
export const setToken = (t: string) => localStorage.setItem("fb_token", t);
export const clearToken = () => localStorage.removeItem("fb_token");

// быстрое декодирование payload для UX (ник/админка сразу, без ожидания сети)
export function peekToken(token: string | null): { nick?: string; sub?: string; exp?: number } | null {
  if (!token) return null;
  try {
    const b = token.split(".")[1];
    if (!b) return null;
    return JSON.parse(atob(b.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return null; }
}

export type AuthState = { token: string | null; nick: string | null; isAdmin: boolean; loading: boolean; logout: () => void };

export function useAuth(): AuthState {
  const [token, setTok] = useState<string | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [isAdmin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    setTok(t);
    const peek = peekToken(t);
    setNick(peek?.nick ?? null);
    (async () => {
      if (!t) { setLoading(false); return; }
      const r = await api("/api/me");           // реальная проверка на сервере
      if (!r.ok) { clearToken(); setTok(null); setNick(null); setAdmin(false); }
      else { setAdmin(!!r.data?.is_admin); setNick(r.data?.nickname ?? peek?.nick ?? null); }
      setLoading(false);
    })();
  }, []);

  const logout = () => { clearToken(); setTok(null); setNick(null); setAdmin(false); };
  return { token, nick, isAdmin, loading, logout };
}
