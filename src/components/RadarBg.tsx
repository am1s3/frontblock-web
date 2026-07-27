// Чисто визуальный слой. pointer-events:none, живёт под всем контентом.
export default function RadarBg() {
  return (
    <div className="rbg" aria-hidden>
      <div className="rbg-grid" />
      <div className="rbg-radar" />
      <div className="rbg-glow rbg-glow--tpa" />
      <div className="rbg-glow rbg-glow--vss" />
      <div className="rbg-scan" />
      <div className="rbg-vignette" />
    </div>
  );
}
