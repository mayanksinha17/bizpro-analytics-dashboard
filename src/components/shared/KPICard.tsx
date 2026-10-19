import { TrendingUp, TrendingDown } from "lucide-react";
import type { KPIComparison } from "../../types";
import { formatCurrencyCompact, formatPercent, formatNumber } from "../../utils/format";

type ValueType = "currency" | "percent" | "number";

interface KPICardProps {
  id: string;
  title: string;
  kpi: KPIComparison;
  valueType?: ValueType;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  onClick?: () => void;
}

function fmt(value: number, type: ValueType) {
  switch (type) {
    case "currency": return formatCurrencyCompact(value);
    case "percent": return formatPercent(value);
    case "number": return formatNumber(value);
  }
}

export default function KPICard({
  id, title, kpi, valueType = "number", icon: Icon, iconColor = "#2563eb", iconBg = "#eff6ff", subtitle, onClick,
}: KPICardProps) {
  const isPos = kpi.isPositive;
  const changeAbs = Math.abs(kpi.changePercent);

  return (
    <div
      id={id}
      className="card kpi-card"
      onClick={onClick}
      style={{ transition: "box-shadow 0.2s, transform 0.15s", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card-hover)";
        if (onClick) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
        if (onClick) (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <p className="kpi-label">{title}</p>
        {Icon && (
          <div style={{
            width: 36, height: 36, borderRadius: "0.5rem",
            background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={18} color={iconColor} />
          </div>
        )}
      </div>
      <p className="kpi-value">{fmt(kpi.current, valueType)}</p>
      {subtitle && <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{subtitle}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {isPos
          ? <TrendingUp size={13} color="var(--color-success)" />
          : <TrendingDown size={13} color="var(--color-danger)" />
        }
        <span className={isPos ? "kpi-change-pos" : "kpi-change-neg"}>
          {isPos ? "+" : "-"}{formatPercent(changeAbs, 1)}
        </span>
        <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>vs prev period</span>
      </div>
    </div>
  );
}
