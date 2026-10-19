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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
        background: "white",
        borderRadius: "0.75rem",
        border: "1px dashed #e5e7eb",
        textAlign: "center",
        margin: "1rem 0",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          color: "#9ca3af",
        }}
      >
        <FilterX size={26} />
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#1f2937",
          marginBottom: "0.375rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "#6b7280",
          maxWidth: 420,
          lineHeight: 1.5,
          marginBottom: showReset ? "1.25rem" : 0,
        }}
      >
        {message}
      </p>
      {showReset && (
        <button
          onClick={resetFilters}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 0.9rem",
            background: "#2563eb",
            color: "white",
            borderRadius: "0.5rem",
            border: "none",
            fontSize: "0.8125rem",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(37, 99, 235, 0.2)",
          }}
        >
          <RotateCcw size={14} />
          Reset All Filters
        </button>
      )}
    </div>
  );
}
