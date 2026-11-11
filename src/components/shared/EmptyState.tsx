import React from "react";
import { FilterX, RotateCcw } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

interface EmptyStateProps {
  title?: string;
  message?: string;
  showReset?: boolean;
}

export default function EmptyState({
  title = "No data found for this filter combination",
  message = "Try adjusting your date range, department, employee, or service category filters to see results.",
  showReset = true,
}: EmptyStateProps) {
  const { resetFilters } = useDashboard();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-[#0f172a]/70 border border-dashed border-white/[0.12] text-center my-4 backdrop-blur-md">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
        <FilterX size={26} />
      </div>
      <h3 className="text-base font-bold text-white mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
        {message}
      </p>
      {showReset && (
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
        >
          <RotateCcw size={14} />
          <span>Reset All Active Filters</span>
        </button>
      )}
    </div>
  );
}
