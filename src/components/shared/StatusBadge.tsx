import React from "react";

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  "New":            { bg: "rgba(59, 130, 246, 0.15)",  color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  "Contacted":      { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", border: "rgba(139, 92, 246, 0.3)" },
  "Qualified":      { bg: "rgba(6, 182, 212, 0.15)",   color: "#22d3ee", border: "rgba(6, 182, 212, 0.3)" },
  "Proposal Sent":  { bg: "rgba(245, 158, 11, 0.15)",  color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  "Negotiation":    { bg: "rgba(249, 115, 22, 0.15)",  color: "#fb923c", border: "rgba(249, 115, 22, 0.3)" },
  "Won":            { bg: "rgba(16, 185, 129, 0.15)",  color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  "Lost":           { bg: "rgba(239, 68, 68, 0.15)",   color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
  "Unqualified":    { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.2)" },
  "Draft":          { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.2)" },
  "Sent":           { bg: "rgba(59, 130, 246, 0.15)",  color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  "Viewed":         { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", border: "rgba(139, 92, 246, 0.3)" },
  "Accepted":       { bg: "rgba(16, 185, 129, 0.15)",  color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  "Rejected":       { bg: "rgba(239, 68, 68, 0.15)",   color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
  "Expired":        { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.2)" },
  "Active":         { bg: "rgba(16, 185, 129, 0.15)",  color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  "On Hold":        { bg: "rgba(245, 158, 11, 0.15)",  color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  "Cancelled":      { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.2)" },
  "Pending":        { bg: "rgba(245, 158, 11, 0.15)",  color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  "In Progress":    { bg: "rgba(59, 130, 246, 0.15)",  color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  "Completed":      { bg: "rgba(16, 185, 129, 0.15)",  color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  "Issued":         { bg: "rgba(59, 130, 246, 0.15)",  color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  "Partially Paid": { bg: "rgba(249, 115, 22, 0.15)",  color: "#fb923c", border: "rgba(249, 115, 22, 0.3)" },
  "Paid":           { bg: "rgba(16, 185, 129, 0.15)",  color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  "Overdue":        { bg: "rgba(239, 68, 68, 0.15)",   color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
  "Written Off":    { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.2)" },
  "Failed":         { bg: "rgba(239, 68, 68, 0.15)",   color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
  "Refunded":       { bg: "rgba(245, 158, 11, 0.15)",  color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
};

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const style = STATUS_STYLES[status] ?? {
    bg: "rgba(148, 163, 184, 0.12)",
    color: "#cbd5e1",
    border: "rgba(148, 163, 184, 0.2)",
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border whitespace-nowrap"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
      }}
    >
      {status}
    </span>
  );
}
