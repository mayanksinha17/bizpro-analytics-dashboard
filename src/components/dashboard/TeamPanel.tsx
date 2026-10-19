import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";
import { teamPerformance, inRange } from "../../analytics/utils";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatPercent, clamp } from "../../utils/format";

const COLORS = ["#2563eb","#7c3aed","#059669","#d97706","#dc2626","#0891b2"];

export default function TeamPanel() {
  const { data, filter } = useDashboard();
  const team = useMemo(() => teamPerformance(data, filter), [data, filter]);

  const chartData = team.map((t, i) => ({
    name: t.employee.name.split(" ")[0],
    revenue: t.revenue,
    target: t.target,
    fill: COLORS[i % COLORS.length],
  }));

  const recentActivities = useMemo(() => {
    return data.activities
      .filter(act => {
        if (filter.employeeId && act.employeeId !== filter.employeeId) return false;
        if (filter.dateRange && !inRange(act.createdAt, filter.dateRange)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 25);
  }, [data.activities, filter]);

  if (team.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Team stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.875rem" }}>
        {team.map((t, i) => (
          <div key={t.employee.id} className="card" style={{ padding: "1rem 1.125rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i+1) % COLORS.length]})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8125rem", fontWeight: 700, color: "white", flexShrink: 0,
              }}>{t.employee.avatarInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.employee.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{t.employee.role}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {[
                { label: "Leads", value: t.leadsAssigned },
                { label: "Won", value: t.dealsWon },
                { label: "Lost", value: t.dealsLost },
                { label: "Revenue", value: formatCurrency(t.revenue) },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>{m.value}</div>
                </div>
              ))}
            </div>
            {t.target > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.72rem", color: "#6b7280" }}>
                  <span>Target Achievement</span>
                  <span style={{ fontWeight: 600, color: t.achievementPercent >= 80 ? "#15803d" : t.achievementPercent >= 50 ? "#d97706" : "#dc2626" }}>
                    {formatPercent(clamp(t.achievementPercent, 0, 200))}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${clamp(t.achievementPercent, 0, 100)}%`,
                      background: t.achievementPercent >= 80 ? "#16a34a" : t.achievementPercent >= 50 ? "#d97706" : "#dc2626",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue vs Target chart */}
      <div className="card" style={{ padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.875rem" }}>Revenue vs Target by Sales Rep</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={70} />
            <Tooltip formatter={(v: unknown, name: unknown) => [formatCurrency(v as number), String(name) === "revenue" ? "Revenue" : "Target"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={28} name="target" />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={28} name="revenue">
              {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent CRM Activity */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
            Recent CRM Activity <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({recentActivities.length})</span>
          </h2>
        </div>
        {recentActivities.length === 0 ? (
          <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
            No recent activity recorded for this filter selection.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Employee</th>
                  <th>Subject</th>
                  <th>Outcome</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map(act => {
                  const emp = data.employees.find(e => e.id === act.employeeId);
                  const lead = data.leads.find(l => l.id === act.leadId);
                  const TYPE_COLORS: Record<string, string> = {
                    "Call": "#2563eb", "Email": "#7c3aed", "Meeting": "#059669",
                    "Follow-up": "#d97706", "Demo": "#0891b2", "Proposal Sent": "#d97706",
                    "Contract Signed": "#16a34a", "Invoice Sent": "#9333ea",
                    "Payment Received": "#15803d", "Note Added": "#6b7280", "Status Changed": "#374151",
                  };
                  return (
                    <tr key={act.id}>
                      <td style={{ color: "#6b7280", fontSize: "0.75rem" }}>{lead?.companyName ?? act.leadId}</td>
                      <td>
                        <span className="badge" style={{ background: "#eff6ff", color: TYPE_COLORS[act.type] ?? "#374151" }}>
                          {act.type}
                        </span>
                      </td>
                      <td style={{ color: "#374151" }}>{emp?.name ?? "—"}</td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#111827" }}>{act.subject}</td>
                      <td style={{ color: "#6b7280", fontSize: "0.75rem" }}>{act.outcome ?? "—"}</td>
                      <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{act.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
