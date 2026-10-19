import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  Users, UserCheck, CheckCircle2, UserX, Percent,
  ArrowRight, X, ExternalLink, FileText, Briefcase, Activity,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterLeads, filterQuotations, filterDeals,
  leadCountByStatus, leadsBySource, leadConversionRate,
  leadFunnelMetrics, leadsTrendSeries, buildKPIs, safeDiv,
} from "../../analytics/utils";
import type { Lead, LeadStatus } from "../../types";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatDate, formatPercent } from "../../utils/format";

const PAGE_SIZE = 10;
const STATUS_COLORS: Record<string, string> = {
  "New": "#3b82f6",
  "Contacted": "#8b5cf6",
  "Qualified": "#06b6d4",
  "Proposal Sent": "#f59e0b",
  "Negotiation": "#d97706",
  "Won": "#16a34a",
  "Lost": "#dc2626",
  "Unqualified": "#6b7280",
};

const ALL_STATUSES: LeadStatus[] = [
  "New", "Contacted", "Qualified", "Proposal Sent",
  "Negotiation", "Won", "Lost", "Unqualified",
];

export default function LeadsPanel() {
  const { data, filter, navigateTo, globalSearch, setGlobalSearch } = useDashboard();
  const [search, setSearch] = useState(globalSearch || "");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<"createdAt" | "expectedValue" | "companyName" | "quoteCount">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Sync with globalSearch if passed from another module
  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
      setPage(0);
      setGlobalSearch("");
    }
  }, [globalSearch, setGlobalSearch]);

  // Selected lead for drill-down modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const leads = useMemo(() => filterLeads(data, filter), [data, filter]);
  const quotations = useMemo(() => filterQuotations(data, filter), [data, filter]);
  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  const funnel = useMemo(() => leadFunnelMetrics(leads), [leads]);
  const sources = useMemo(() => leadsBySource(leads), [leads]);
  const statusCounts = useMemo(() => leadCountByStatus(leads), [leads]);
  const trendData = useMemo(() => leadsTrendSeries(leads, filter.dateRange), [leads, filter.dateRange]);

  // Map leadId -> quotations list
  const quotationsByLead = useMemo(() => {
    const map = new Map<string, typeof quotations>();
    for (const q of data.quotations) {
      const list = map.get(q.leadId) ?? [];
      list.push(q);
      map.set(q.leadId, list);
    }
    return map;
  }, [data.quotations]);

  // Map leadId -> deals list
  const dealsByLead = useMemo(() => {
    const map = new Map<string, typeof deals>();
    for (const d of data.deals) {
      const list = map.get(d.leadId) ?? [];
      list.push(d);
      map.set(d.leadId, list);
    }
    return map;
  }, [data.deals]);

  // Filtered and sorted table rows
  const filtered = useMemo(() => {
    let rows = leads;
    if (statusFilter) {
      rows = rows.filter(l => l.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(l =>
        l.id.toLowerCase().includes(q) ||
        l.companyName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q)
      );
    }

    return [...rows].sort((a, b) => {
      let va: string | number = a.createdAt;
      let vb: string | number = b.createdAt;
      if (sortBy === "expectedValue") {
        va = a.expectedValue;
        vb = b.expectedValue;
      } else if (sortBy === "companyName") {
        va = a.companyName.toLowerCase();
        vb = b.companyName.toLowerCase();
      } else if (sortBy === "quoteCount") {
        va = quotationsByLead.get(a.id)?.length ?? 0;
        vb = quotationsByLead.get(b.id)?.length ?? 0;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [leads, search, statusFilter, sortBy, sortDir, quotationsByLead]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  // Selected lead's relations for drill-down
  const leadQuotes = selectedLead ? (quotationsByLead.get(selectedLead.id) ?? []) : [];
  const leadDeals = selectedLead ? (dealsByLead.get(selectedLead.id) ?? []) : [];
  const leadActivities = selectedLead
    ? data.activities.filter(a => a.leadId === selectedLead.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];
  const assignedEmp = selectedLead ? data.employees.find(e => e.id === selectedLead.assignedTo) : null;

  if (leads.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      {/* 5 Required KPI Cards with previous-period comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem" }}>
        {[
          {
            id: "kpi-lead-total",
            label: "Total Leads",
            value: leads.length,
            color: "#2563eb",
            bg: "#eff6ff",
            icon: Users,
            kpi: kpis.totalLeads,
            subtitle: "In selected period",
          },
          {
            id: "kpi-lead-qualified",
            label: "Qualified Leads",
            value: funnel.qualified,
            color: "#0891b2",
            bg: "#ecfeff",
            icon: UserCheck,
            kpi: kpis.qualifiedLeads,
            subtitle: `${formatPercent(safeDiv(funnel.qualified, leads.length) * 100)} of total`,
          },
          {
            id: "kpi-lead-converted",
            label: "Converted Leads",
            value: funnel.converted,
            color: "#15803d",
            bg: "#f0fdf4",
            icon: CheckCircle2,
            kpi: kpis.convertedLeads,
            subtitle: "Won closed deals",
          },
          {
            id: "kpi-lead-unqualified",
            label: "Unqualified Leads",
            value: funnel.unqualified,
            color: "#6b7280",
            bg: "#f3f4f6",
            icon: UserX,
            kpi: kpis.unqualifiedLeads,
            subtitle: "Exited qualification",
          },
          {
            id: "kpi-lead-conversion-rate",
            label: "Lead Conversion Rate",
            value: formatPercent(kpis.conversionRate.current),
            color: "#7c3aed",
            bg: "#f5f3ff",
            icon: Percent,
            kpi: kpis.conversionRate,
            subtitle: "Converted / Total",
          },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              className="card"
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280" }}>{item.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: "0.375rem", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={item.color} />
                </div>
              </div>
              <div style={{ fontSize: typeof item.value === "number" ? "1.625rem" : "1.375rem", fontWeight: 700, color: item.color, lineHeight: 1.2 }}>
                {item.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                {item.subtitle}
              </div>
              {item.kpi && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", borderTop: "1px solid #f3f4f6", paddingTop: "0.375rem" }}>
                  {item.kpi.isPositive ? <TrendingUp size={12} color="#15803d" /> : <TrendingDown size={12} color="#b91c1c" />}
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: item.kpi.isPositive ? "#15803d" : "#b91c1c" }}>
                    {item.kpi.changePercent >= 0 ? "+" : ""}{formatPercent(item.kpi.changePercent, 1)}
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "#6b7280" }}>vs prev period</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visualizations Row 1: Funnel & Source Breakdown */}
      <div className="chart-grid-2-1-alt">
        
        {/* 1. Lead Funnel */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Lead Pipeline Funnel</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Conversion progression through key stages</p>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "0.2rem 0.5rem", borderRadius: "0.375rem" }}>
              {formatPercent(funnel.conversionRate)} Won
            </span>
          </div>

          {/* Sequential Funnel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.5rem" }}>
            {[
              { stage: "Total Leads", count: funnel.total, color: "#2563eb", pct: 100 },
              { stage: "Qualified Stage", count: funnel.qualified, color: "#0891b2", pct: safeDiv(funnel.qualified, funnel.total) * 100 },
              { stage: "Converted (Won)", count: funnel.converted, color: "#16a34a", pct: safeDiv(funnel.converted, funnel.total) * 100 },
            ].map((step, idx) => (
              <div key={step.stage}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {idx + 1}. {step.stage}
                  </span>
                  <span style={{ fontWeight: 700, color: step.color }}>
                    {step.count} <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#6b7280" }}>({step.pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div style={{ height: 18, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${step.pct}%`,
                      background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)`,
                      borderRadius: 4,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Separate alternative outcome cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ padding: "0.5rem 0.75rem", borderRadius: "0.375rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 500 }}>Unqualified Outcome</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#64748b" }}>
                {funnel.unqualified} <span style={{ fontSize: "0.72rem", fontWeight: 400 }}>({(safeDiv(funnel.unqualified, funnel.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
            <div style={{ padding: "0.5rem 0.75rem", borderRadius: "0.375rem", background: "#fef2f2", border: "1px solid #fee2e2" }}>
              <div style={{ fontSize: "0.7rem", color: "#b91c1c", fontWeight: 500 }}>Lost / Dropped</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#dc2626" }}>
                {funnel.lost} <span style={{ fontSize: "0.72rem", fontWeight: 400 }}>({(safeDiv(funnel.lost, funnel.total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Lead Source Analysis */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Lead Source Analysis</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Volume and proportion by channel</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sources.map((src, i) => {
              const colors = ["#2563eb", "#7c3aed", "#0891b2", "#10b981", "#f59e0b", "#64748b"];
              const color = colors[i % colors.length];
              return (
                <div key={src.source}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginBottom: 3 }}>
                    <span style={{ color: "#374151", fontWeight: 500 }}>{src.source}</span>
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      {src.count} <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}>({src.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${src.percentage}%`, background: color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visualizations Row 2: Status Distribution & Trends */}
      <div className="chart-grid-1-2">
        
        {/* 3. Lead Status Distribution */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Status Distribution</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Breakdown across all supported statuses</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={ALL_STATUSES.map(s => ({ status: s, count: statusCounts[s] ?? 0 }))}
              margin={{ top: 5, right: 5, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-25} textAnchor="end" height={40} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {ALL_STATUSES.map(s => (
                  <Cell key={s} fill={STATUS_COLORS[s] ?? "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Lead Trends */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Lead Generation Trends</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>New leads vs qualified & converted progression</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="total" name="Total Leads" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="qualified" name="Qualified" stroke="#0891b2" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="converted" name="Converted (Won)" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Required Lead Records Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "0.875rem 1.125rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
              Lead Records <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({filtered.length})</span>
            </h2>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>Click any row to drill down into linked quotations & deals</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Quick Status Filter */}
            <div style={{ display: "flex", gap: "0.25rem", background: "#f3f4f6", padding: "0.2rem", borderRadius: "0.375rem" }}>
              {["", "Qualified", "Won", "Unqualified"].map(st => (
                <button
                  key={st}
                  onClick={() => { setStatusFilter(st); setPage(0); }}
                  style={{
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.25rem",
                    border: "none",
                    background: statusFilter === st ? "white" : "transparent",
                    color: statusFilter === st ? "#2563eb" : "#6b7280",
                    fontWeight: statusFilter === st ? 600 : 400,
                    fontSize: "0.72rem",
                    cursor: "pointer",
                  }}
                >
                  {st || "All"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                id="leads-search-input"
                type="text"
                placeholder="Search leads, contact..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                style={{
                  paddingLeft: 26,
                  paddingRight: 10,
                  paddingTop: "0.3rem",
                  paddingBottom: "0.3rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  fontSize: "0.78rem",
                  width: 190,
                }}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
            No leads match your current search and filter settings.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead ID</th>
                    <th onClick={() => toggleSort("companyName")} style={{ cursor: "pointer" }}>Lead Name / Company ↕</th>
                    <th>Source</th>
                    <th>Department</th>
                    <th>Assigned Rep</th>
                    <th>Status</th>
                    <th onClick={() => toggleSort("createdAt")} style={{ cursor: "pointer" }}>Created ↕</th>
                    <th onClick={() => toggleSort("quoteCount")} style={{ cursor: "pointer" }}>Quotations ↕</th>
                    <th>Conversion Info</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(l => {
                    const emp = data.employees.find(e => e.id === l.assignedTo);
                    const qCount = quotationsByLead.get(l.id)?.length ?? 0;
                    const wonDeal = dealsByLead.get(l.id)?.find(d => d.status === "Won");
                    return (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLead(l)}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                      >
                        <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{l.id}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{l.companyName}</div>
                          <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{l.contactName} &bull; {l.category}</div>
                        </td>
                        <td><span style={{ fontSize: "0.75rem", color: "#374151" }}>{l.source}</span></td>
                        <td><span style={{ fontSize: "0.75rem", color: "#4b5563" }}>{emp?.department ?? "Sales"}</span></td>
                        <td><span style={{ fontSize: "0.75rem", color: "#111827" }}>{emp?.name ?? "—"}</span></td>
                        <td><StatusBadge status={l.status} /></td>
                        <td style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatDate(l.createdAt)}</td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "1rem",
                              background: qCount > 0 ? "#eff6ff" : "#f3f4f6",
                              color: qCount > 0 ? "#2563eb" : "#9ca3af",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          >
                            {qCount}
                          </span>
                        </td>
                        <td>
                          {l.status === "Won" ? (
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#15803d", background: "#f0fdf4", padding: "0.15rem 0.45rem", borderRadius: "0.25rem" }}>
                              Won {wonDeal ? `(${wonDeal.dealNumber})` : ""}
                            </span>
                          ) : l.status === "Unqualified" ? (
                            <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>Unqualified</span>
                          ) : (
                            <span style={{ fontSize: "0.72rem", color: "#2563eb" }}>₹{l.expectedValue.toLocaleString("en-IN")} exp.</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedLead(l);
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "0.25rem",
                              border: "1px solid #d1d5db",
                              background: "white",
                              fontSize: "0.72rem",
                              color: "#2563eb",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            Drill Down <ArrowRight size={10} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.125rem", borderTop: "1px solid #f3f4f6", fontSize: "0.78rem", color: "#6b7280" }}>
              <span>
                Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} leads
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  id="leads-page-prev"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: "0.25rem 0.5rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    background: "white",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    color: page === 0 ? "#d1d5db" : "#374151",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  id="leads-page-next"
                  onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
                  disabled={page >= pages - 1}
                  style={{
                    padding: "0.25rem 0.5rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    background: "white",
                    cursor: page >= pages - 1 ? "not-allowed" : "pointer",
                    color: page >= pages - 1 ? "#d1d5db" : "#374151",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Drill-down Modal for Selected Lead */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e5e7eb",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.125rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                    {selectedLead.companyName}
                  </h3>
                  <StatusBadge status={selectedLead.status} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>
                  {selectedLead.id} &bull; Contact: {selectedLead.contactName} ({selectedLead.contactEmail} &bull; {selectedLead.contactPhone})
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Profile summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Service Category</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedLead.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Lead Source</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedLead.source}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Expected Value</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#15803d" }}>₹{selectedLead.expectedValue.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Assigned Rep</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{assignedEmp?.name ?? "—"} ({assignedEmp?.department ?? "Sales"})</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Created Date</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{formatDate(selectedLead.createdAt)}</div>
                </div>
              </div>

              {/* Related Quotations Section */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <FileText size={16} color="#2563eb" />
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Associated Quotations ({leadQuotes.length})
                  </h4>
                </div>
                {leadQuotes.length === 0 ? (
                  <div style={{ padding: "1rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No quotations issued to this lead yet.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <table className="data-table" style={{ fontSize: "0.75rem" }}>
                      <thead>
                        <tr>
                          <th>Quote #</th>
                          <th>Status</th>
                          <th>Items</th>
                          <th>Subtotal</th>
                          <th>Tax</th>
                          <th>Total Amount</th>
                          <th>Valid Until</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadQuotes.map(q => (
                          <tr key={q.id}>
                            <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{q.quoteNumber}</td>
                            <td><StatusBadge status={q.status} /></td>
                            <td>{q.items.length} item(s)</td>
                            <td>{formatCurrency(q.subtotal)}</td>
                            <td>{formatCurrency(q.taxAmount)}</td>
                            <td style={{ fontWeight: 700, color: "#15803d" }}>{formatCurrency(q.totalAmount)}</td>
                            <td>{formatDate(q.validUntil)}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedLead(null);
                                  navigateTo("quotations", q.quoteNumber);
                                }}
                                style={{
                                  padding: "0.2rem 0.45rem",
                                  borderRadius: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  background: "white",
                                  fontSize: "0.72rem",
                                  color: "#2563eb",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                View <ExternalLink size={10} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Related Deals Section */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <Briefcase size={16} color="#059669" />
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Associated Deals ({leadDeals.length})
                  </h4>
                </div>
                {leadDeals.length === 0 ? (
                  <div style={{ padding: "1rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No deals created for this lead yet.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <table className="data-table" style={{ fontSize: "0.75rem" }}>
                      <thead>
                        <tr>
                          <th>Deal #</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Value</th>
                          <th>Probability</th>
                          <th>Close Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadDeals.map(d => (
                          <tr key={d.id}>
                            <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{d.dealNumber}</td>
                            <td>{d.category}</td>
                            <td><StatusBadge status={d.status} /></td>
                            <td style={{ fontWeight: 700, color: d.status === "Won" ? "#15803d" : "#111827" }}>{formatCurrency(d.value)}</td>
                            <td>{d.probability}%</td>
                            <td>{d.expectedCloseDate ? formatDate(d.expectedCloseDate) : "—"}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedLead(null);
                                  navigateTo("deals", d.dealNumber);
                                }}
                                style={{
                                  padding: "0.2rem 0.45rem",
                                  borderRadius: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  background: "white",
                                  fontSize: "0.72rem",
                                  color: "#2563eb",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                View <ExternalLink size={10} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Activities Section */}
              {leadActivities.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                    <Activity size={16} color="#7c3aed" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Activity History ({leadActivities.length})
                    </h4>
                  </div>
                  <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <table className="data-table" style={{ fontSize: "0.72rem" }}>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Subject</th>
                          <th>Outcome</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadActivities.map(a => (
                          <tr key={a.id}>
                            <td>
                              <span style={{ padding: "0.1rem 0.35rem", borderRadius: "0.25rem", background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}>
                                {a.type}
                              </span>
                            </td>
                            <td>{a.subject}</td>
                            <td>{a.outcome ?? "—"}</td>
                            <td style={{ color: "#9ca3af" }}>{a.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", background: "#f9fafb" }}>
              <button
                onClick={() => setSelectedLead(null)}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  background: "white",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
