"use client";
import { useCountUp, useReveal } from "@/lib/hooks";

export default function StatBlock({ value, label, suffix = "", accent }:
  { value: number; label: string; suffix?: string; accent?: "tpa" | "vss" | "amber" }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const n = useCountUp(value, shown);
  return (
    <div ref={ref} className={`stat ${accent ? "stat--" + accent : ""}`}>
      <div className="stat__num">{n.toLocaleString("ru-RU")}<span className="stat__suf">{suffix}</span></div>
      <div className="stat__lbl">{label}</div>
    </div>
  );
}
