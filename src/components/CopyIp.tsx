"use client";
import { useState } from "react";
import { SERVER_IP } from "@/lib/api";

export default function CopyIp() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(SERVER_IP); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="ipbox clip">
      <span className="ipbox__tag">IP СЕРВЕРА</span>
      <code className="ipbox__addr">{SERVER_IP}</code>
      <button className={`btn btn--amber ipbox__btn ${copied ? "is-copied" : ""}`} onClick={copy}>
        {copied ? "✓ СКОПИРОВАНО" : "КОПИРОВАТЬ"}
      </button>
    </div>
  );
}
