"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CopyIp from "./CopyIp";

export default function JoinModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button className="btn btn--amber" onClick={() => setOpen(true)}>Зайти на сервер</button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal clip" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setOpen(false)}>✕</button>
            <div className="modal__title">Подключение к серверу</div>
            <p className="modal__text">Чтобы зайти на сервер, сначала скачай и установи сборку клиента — без неё моды не совпадут и сервер не пустит.</p>
            <Link href="/downloads" className="btn btn--tpa" onClick={() => setOpen(false)}>Скачать сборку</Link>
            <div style={{ marginTop: 18 }}><CopyIp /></div>
          </div>
        </div>
      )}
    </>
  );
}
