const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  "New":           { bg: "#eff6ff", color: "#1d4ed8" },
  "Contacted":     { bg: "#f5f3ff", color: "#5b21b6" },
  "Qualified":     { bg: "#ecfdf5", color: "#065f46" },
  "Proposal Sent": { bg: "#fff7ed", color: "#c2410c" },
  "Negotiation":   { bg: "#fffbeb", color: "#92400e" },
  "Won":           { bg: "#f0fdf4", color: "#15803d" },
  "Lost":          { bg: "#fef2f2", color: "#b91c1c" },
  "Unqualified":   { bg: "#f3f4f6", color: "#374151" },
  "Draft":         { bg: "#f3f4f6", color: "#374151" },
  "Sent":          { bg: "#eff6ff", color: "#1d4ed8" },
  "Viewed":        { bg: "#f5f3ff", color: "#5b21b6" },
  "Accepted":      { bg: "#f0fdf4", color: "#15803d" },
  "Rejected":      { bg: "#fef2f2", color: "#b91c1c" },
  "Expired":       { bg: "#f3f4f6", color: "#6b7280" },
  "Active":        { bg: "#ecfdf5", color: "#065f46" },
  "On Hold":       { bg: "#fffbeb", color: "#92400e" },
  "Cancelled":     { bg: "#f3f4f6", color: "#374151" },
  "Pending":       { bg: "#fefce8", color: "#92400e" },
  "In Progress":   { bg: "#eff6ff", color: "#1d4ed8" },
  "Completed":     { bg: "#f0fdf4", color: "#15803d" },
  "Issued":        { bg: "#eff6ff", color: "#1d4ed8" },
  "Partially Paid":{ bg: "#fff7ed", color: "#c2410c" },
  "Paid":          { bg: "#f0fdf4", color: "#15803d" },
  "Overdue":       { bg: "#fef2f2", color: "#b91c1c" },
  "Written Off":   { bg: "#f3f4f6", color: "#6b7280" },
  "Failed":        { bg: "#fef2f2", color: "#b91c1c" },
  "Refunded":      { bg: "#fffbeb", color: "#92400e" },
};

interface Props { status: string; }

export default function StatusBadge({ status }: Props) {
  const style = STATUS_STYLES[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="badge"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
}
