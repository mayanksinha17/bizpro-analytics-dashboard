import React from "react";

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  valueFormatter?: (value: number | string) => string;
}

export default function CustomChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl bg-[#0f172a]/95 border border-white/[0.12] p-3 shadow-xl shadow-black/60 backdrop-blur-md text-xs min-w-[140px] pointer-events-none">
      {label && (
        <div className="font-semibold text-white pb-1.5 mb-1.5 border-b border-white/[0.08] text-[11px] uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const color = entry.color || entry.fill || entry.stroke || "#3b82f6";
          const formatted = valueFormatter ? valueFormatter(entry.value) : entry.value;

          return (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span>{entry.name || "Value"}:</span>
              </div>
              <span className="font-mono font-bold text-white">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
