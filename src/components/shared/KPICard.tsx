import React from "react";
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
  id,
  title,
  kpi,
  valueType = "number",
  icon: Icon,
  iconColor = "#3b82f6",
  iconBg,
  subtitle,
  onClick,
}: KPICardProps) {
  const isPos = kpi.isPositive;
  const changeAbs = Math.abs(kpi.changePercent);

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl bg-[#0f172a]/85 border border-white/[0.08] p-4 sm:p-5 backdrop-blur-md transition-all duration-200 group flex flex-col justify-between ${
        onClick
          ? "cursor-pointer hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10"
          : "hover:border-white/[0.14]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
            {title}
          </p>
          {Icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/[0.06] transition-transform group-hover:scale-105"
              style={{
                backgroundColor: iconBg ? `${iconBg}20` : "rgba(59, 130, 246, 0.12)",
                color: iconColor,
              }}
            >
              <Icon size={16} />
            </div>
          )}
        </div>

        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          {fmt(kpi.current, valueType)}
        </p>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06] text-xs">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[11px] ${
            isPos
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
          }`}
        >
          {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPos ? "+" : "-"}{formatPercent(changeAbs, 1)}</span>
        </span>
        <span className="text-[11px] text-slate-400">vs prev period</span>
      </div>
    </div>
  );
}
