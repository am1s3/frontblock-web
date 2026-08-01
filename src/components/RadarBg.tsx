// Чисто визуальный слой под всем контентом. Без blur-фильтров и без тяжёлого шума —
// именно они лагали на телефонах. pointer-events:none, не ловит клики.
export default function RadarBg() {
  return (
    <div className="rbg" aria-hidden>
      <div className="rbg-grid" />
      <div className="rbg-radar" />
      <div className="rbg-glow rbg-glow--tpa" />
      <div className="rbg-glow rbg-glow--vss" />
      <div className="rbg-vignette" />
    </div>
  );
}
