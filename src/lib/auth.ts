"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export const getToken = () => (typeof localStorage !== "undefined" ? localStorage.getItem("fb_token") : null);

// запись токена + оповещение всех подписчиков в этой вкладке (storage-ивент в той же вкладке не стреляет)
export const setToken = (t: string) => {
  localStorage.setItem("fb_token", t);
  window.dispatchEvent(new Event("fb:auth"));
};
export const clearToken = () => {
  localStorage.removeItem("fb_token");
  window.dispatchEvent(new Event("fb:auth"));
};

// быстрое декодирование payload для мгновенного UX (ник в шапке без ожидания сети)
export function peekToken(token: string | null): { nick?: string; sub?: string; exp?: number } | null {
  if (!token) return null;
  try {
    let b = token.split(".")[1] || "";
    b = b.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    return JSON.parse(atob(b));
  } catch { return null; }
}

export type AuthState = { token: string | null; nick: string | null; isAdmin: boolean; loading: boolean; logout: () => void };

export function useAuth(): AuthState {
  const [token, setTok] = useState<string | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [isAdmin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const t = getToken();
    setTok(t);
    const peek = peekToken(t);
    setNick(peek?.nick ?? null);          // ник сразу, до ответа сети — шапка обновится мгновенно
    if (!t) { setAdmin(false); setLoading(false); return; }
    const r = await api("/api/me");        // реальная проверка на сервере
    if (!r.ok) {
      localStorage.removeItem("fb_token"); // тихо, без dispatch — иначе рекурсия
      setTok(null); setNick(null); setAdmin(false);
    } else {
      setAdmin(!!r.data?.is_admin);
      setNick(r.data?.nickname ?? peek?.nick ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("fb:auth", refresh);   // логин/логаут в этой вкладке
    window.addEventListener("storage", refresh);   // логин/логаут в другой вкладке
    return () => {
      window.removeEventListener("fb:auth", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const logout = useCallback(() => { clearToken(); setTok(null); setNick(null); setAdmin(false); }, []);
  return { token, nick, isAdmin, loading, logout };
}
