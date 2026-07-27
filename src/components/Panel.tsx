import { ReactNode } from "react";

export default function Panel({ label, accent, children, className = "" }:
  { label?: string; accent?: "tpa" | "vss" | "amber"; children: ReactNode; className?: string }) {
  return (
    <section className={`panel clip ${accent ? "panel--" + accent : ""} ${className}`}>
      {label && <div className="panel__label">{label}</div>}
      <div className="panel__body">{children}</div>
      <span className="panel__corner panel__corner--tl" /><span className="panel__corner panel__corner--br" />
    </section>
  );
}
