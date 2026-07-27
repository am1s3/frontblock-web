"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type News = { id: number; title: string; body: string; author: string; created_at: number };
const fmt = (s: number) => new Date(s * 1000).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });

export default function NewsFeed({ limit = 4 }: { limit?: number }) {
  const [items, setItems] = useState<News[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { api<News[]>("/api/news").then((r) => { if (r.ok && Array.isArray(r.data)) setItems(r.data.slice(0, limit)); setLoaded(true); }); }, [limit]);

  if (!loaded) return <div className="muted">загрузка сводок…</div>;
  if (!items.length) return <div className="muted">сводок пока нет — командование молчит.</div>;
  return (
    <ul className="news">
      {items.map((n) => (
        <li key={n.id} className="news__item clip">
          <div className="news__head"><span className="news__dot" /><h4>{n.title}</h4><time>{fmt(n.created_at)}</time></div>
          <p>{n.body}</p>
          <span className="news__by">— {n.author}</span>
        </li>
      ))}
    </ul>
  );
}
