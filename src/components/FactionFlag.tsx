type Props = { faction: "TPA" | "VSS"; className?: string };

// Флаг на шесте (SVG). ТПА = верх оранжевый / низ красный, ВСС = верх голубой / низ чёрный.
// id градиента уникален по фракции, иначе два флага на странице словят конфликт id.
export default function FactionFlag({ faction, className = "" }: Props) {
  const top = faction === "TPA" ? "#ef8a2b" : "#46a6e6";
  const bottom = faction === "TPA" ? "#d6342a" : "#101419";
  const pole = "#9aa6b2";
  const gid = `flag-sheen-${faction}`;
  return (
    <svg className={className} viewBox="0 0 72 84" fill="none" role="img" aria-label={faction === "TPA" ? "Флаг ТПА" : "Флаг ВСС"}>
      <circle cx="9" cy="6" r="4" fill={pole} />
      <rect x="7" y="6" width="4" height="74" rx="2" fill={pole} />
      <rect x="13" y="10" width="52" height="20" fill={top} />
      <rect x="13" y="30" width="52" height="20" fill={bottom} />
      <rect x="13" y="10" width="52" height="40" fill={`url(#${gid})`} opacity="0.16" />
      <rect x="13" y="10" width="52" height="40" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="1.5" />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
