import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import {
  Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  FileText, DollarSign, CheckCircle, Clock, XCircle, Percent,
  ArrowRight, X, Briefcase, User, Calendar, ExternalLink,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterQuotations, filterDeals, filterLeads,
  quotationsByCategory, quotationsByStatus,
  quoteToDealConversionRate, totalQuotationValue,
  quotationServiceDetails, buildKPIs, safeDiv,
} from "../../analytics/utils";
import type { Quotation, QuotationStatus } from "../../types";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatCurrencyCompact, formatDate, formatPercent } from "../../utils/format";

const PAGE_SIZE = 10;
const COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#10b981", "#f59e0b", "#dc2626", "#64748b", "#ec4899"];

const STATUS_COLORS: Record<string, string> = {
  "Draft": "#9ca3af",
  "Sent": "#3b82f6",
  "Viewed": "#8b5cf6",
  "Accepted": "#16a34a",
  "Rejected": "#dc2626",
  "Expired": "#6b7280",
};

const ALL_STATUSES: QuotationStatus[] = [
  "Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired",
];

export default function QuotationsPanel() {
  const { data, filter, navigateTo, globalSearch, setGlobalSearch } = useDashboard();
  const [search, setSearch] = useState(globalSearch || "");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLeadIdFilter, setSelectedLeadIdFilter] = useState<string>("");
  const [page, setPage] = useState(0);

  // Sync with globalSearch if passed from another module
  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
      setPage(0);
      setGlobalSearch("");
    }
  }, [globalSearch, setGlobalSearch]);

  const [sortBy, setSortBy] = useState<"createdAt" | "totalAmount" | "quoteNumber">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Selected quotation for drill-down modal
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  const quotations = useMemo(() => filterQuotations(data, filter), [data, filter]);
  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  const byCat = useMemo(() => quotationsByCategory(quotations), [quotations]);
  const byStatus = useMemo(() => quotationsByStatus(quotations), [quotations]);
  const serviceDetails = useMemo(() => quotationServiceDetails(quotations), [quotations]);
  const totalValue = useMemo(() => totalQuotationValue(quotations), [quotations]);
  const convRate = useMemo(() => quoteToDealConversionRate(quotations), [quotations]);

  // Lead lookup map
  const leadMap = useMemo(() => {
    const map = new Map<string, typeof data.leads[0]>();
    for (const l of data.leads) map.set(l.id, l);
    return map;
  }, [data.leads]);

  // Deal lookup by quotationId
  const dealByQuoteId = useMemo(() => {
    const map = new Map<string, typeof data.deals[0]>();
    for (const d of data.deals) {
      if (d.quotationId) map.set(d.quotationId, d);
    }
    return map;
  }, [data.deals]);

  // Distinct leads that have quotations in current view for the lead filter
  const availableLeadsForFilter = useMemo(() => {
    const leadIds = new Set(quotations.map(q => q.leadId));
    return Array.from(leadIds)
      .map(id => leadMap.get(id))
      .filter(Boolean)
      .sort((a, b) => a!.companyName.localeCompare(b!.companyName));
  }, [quotations, leadMap]);

  // Status chart data
  const statusChartData = ALL_STATUSES.map(s => ({
    status: s,
    count: byStatus[s] ?? 0,
    fill: STATUS_COLORS[s] ?? "#2563eb",
  }));

  // Filtered & sorted rows
  const filtered = useMemo(() => {
    let rows = quotations;
    if (statusFilter) {
      rows = rows.filter(q => q.status === statusFilter);
    }
    if (selectedLeadIdFilter) {
      rows = rows.filter(q => q.leadId === selectedLeadIdFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(qt => {
        const lead = leadMap.get(qt.leadId);
        return (
          qt.quoteNumber.toLowerCase().includes(q) ||
          qt.id.toLowerCase().includes(q) ||
          qt.category.toLowerCase().includes(q) ||
          (lead?.companyName ?? "").toLowerCase().includes(q) ||
          (lead?.contactName ?? "").toLowerCase().includes(q)
        );
      });
    }

    return [...rows].sort((a, b) => {
      let va: string | number = a.createdAt;
      let vb: string | number = b.createdAt;
      if (sortBy === "totalAmount") {
        va = a.totalAmount;
        vb = b.totalAmount;
      } else if (sortBy === "quoteNumber") {
        va = a.quoteNumber;
        vb = b.quoteNumber;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [quotations, search, statusFilter, selectedLeadIdFilter, sortBy, sortDir, leadMap]);

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

  // Drill-down data
  const selectedQuoteLead = selectedQuote ? leadMap.get(selectedQuote.leadId) : null;
  const selectedQuoteDeal = selectedQuote ? dealByQuoteId.get(selectedQuote.id) : null;
  const selectedQuoteEmp = selectedQuote ? data.employees.find(e => e.id === selectedQuote.assignedTo) : null;

  if (quotations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      {/* 6 Required KPI Cards with previous-period comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem" }}>
        {[
          {
            id: "kpi-quote-total",
            label: "Total Quotations",
            value: quotations.length,
            color: "#2563eb",
            bg: "#eff6ff",
            icon: FileText,
            kpi: kpis.totalQuotations,
            subtitle: "In selected period",
          },
          {
            id: "kpi-quote-value",
            label: "Total Quoted Value",
            value: formatCurrency(totalValue),
            color: "#15803d",
            bg: "#f0fdf4",
            icon: DollarSign,
            kpi: kpis.totalQuotedValue,
            subtitle: "Gross quoted amount",
          },
          {
            id: "kpi-quote-accepted",
            label: "Accepted Quotes",
            value: byStatus["Accepted"] ?? 0,
            color: "#16a34a",
            bg: "#f0fdf4",
            icon: CheckCircle,
            kpi: kpis.acceptedQuotations,
            subtitle: "Confirmed acceptance",
          },
          {
            id: "kpi-quote-pending",
            label: "Pending Quotes",
            value: (byStatus["Sent"] ?? 0) + (byStatus["Viewed"] ?? 0) + (byStatus["Draft"] ?? 0),
            color: "#d97706",
            bg: "#fffbeb",
            icon: Clock,
            kpi: kpis.pendingQuotations,
            subtitle: "Sent / Viewed / Draft",
          },
          {
            id: "kpi-quote-rejected",
            label: "Rejected Quotes",
            value: (byStatus["Rejected"] ?? 0) + (byStatus["Expired"] ?? 0),
            color: "#b91c1c",
            bg: "#fef2f2",
            icon: XCircle,
            kpi: kpis.rejectedQuotations,
            subtitle: "Rejected / Expired",
          },
          {
            id: "kpi-quote-conversion",
            label: "Quote-to-Deal Rate",
            value: formatPercent(convRate),
            color: "#7c3aed",
            bg: "#f5f3ff",
            icon: Percent,
            kpi: kpis.quoteToDealRate,
            subtitle: "Accepted / Total",
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
              <div style={{ fontSize: typeof item.value === "number" ? "1.625rem" : "1.25rem", fontWeight: 700, color: item.color, lineHeight: 1.2 }}>
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

      {/* Required Visualizations Row 1: Quotations Count & Value by Service */}
      <div className="chart-grid-2">
        
        {/* 1. Quotations Count by Service */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Quotations by Service</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Volume of quotes per service category</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={byCat.slice(0, 7)} margin={{ top: 5, right: 5, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-20} textAnchor="end" height={40} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {byCat.slice(0, 7).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Quotation Value by Service */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Quoted Amount by Service</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Aggregated proposal value (INR)</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={byCat.slice(0, 7)} margin={{ top: 5, right: 5, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-20} textAnchor="end" height={40} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Quoted Value"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={32} fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visualizations Row 2: Status Distribution & Quote-to-Deal Conversion Funnel */}
      <div className="chart-grid-1-2">
        
        {/* 3. Quotation Status Distribution */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Quotation Status Breakdown</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Distribution across all quotation lifecycles</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={statusChartData} margin={{ top: 5, right: 5, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-15} textAnchor="end" height={35} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {statusChartData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Quote-to-Deal Conversion Flow */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Quote-to-Deal Conversion Flow</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Direct tracking from proposal to closed business</p>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#15803d", background: "#f0fdf4", padding: "0.2rem 0.5rem", borderRadius: "0.375rem" }}>
              {formatPercent(convRate)} Win Rate
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              {
                step: "Total Issued Quotations",
                count: quotations.length,
                pct: 100,
                color: "#2563eb",
                desc: "All proposals generated in date window",
              },
              {
                step: "Client Reviewed / Negotiating",
                count: (byStatus["Viewed"] ?? 0) + (byStatus["Sent"] ?? 0) + (byStatus["Accepted"] ?? 0),
                pct: safeDiv((byStatus["Viewed"] ?? 0) + (byStatus["Sent"] ?? 0) + (byStatus["Accepted"] ?? 0), quotations.length) * 100,
                color: "#0891b2",
                desc: "Client engaged with proposal",
              },
              {
                step: "Accepted Quotations",
                count: byStatus["Accepted"] ?? 0,
                pct: convRate,
                color: "#16a34a",
                desc: "Formally approved by prospect",
              },
              {
                step: "Associated Deals Created",
                count: deals.length,
                pct: safeDiv(deals.length, quotations.length) * 100,
                color: "#7c3aed",
                desc: "Linked directly to CRM revenue pipeline",
              },
            ].map(item => (
              <div key={item.step}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{item.step}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>
                    {item.count} <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}>({item.pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, item.pct)}%`, background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Required Table 1: Service-wise Details Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
            Service-wise Quotation Details
          </h2>
          <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
            Comprehensive performance metrics aggregated across all service offerings
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service / Category</th>
                <th style={{ textAlign: "center" }}>Quotation Count</th>
                <th style={{ textAlign: "right" }}>Total Quoted Amount</th>
                <th style={{ textAlign: "center" }}>Accepted</th>
                <th style={{ textAlign: "center" }}>Pending</th>
                <th style={{ textAlign: "center" }}>Rejected</th>
                <th style={{ textAlign: "right" }}>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {serviceDetails.map(sd => (
                <tr key={sd.category}>
                  <td style={{ fontWeight: 600, color: "#111827" }}>{sd.category}</td>
                  <td style={{ textAlign: "center", fontWeight: 600, color: "#2563eb" }}>{sd.count}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#15803d" }}>{formatCurrency(sd.totalAmount)}</td>
                  <td style={{ textAlign: "center", color: "#16a34a", fontWeight: 600 }}>{sd.acceptedCount}</td>
                  <td style={{ textAlign: "center", color: "#d97706" }}>{sd.pendingCount}</td>
                  <td style={{ textAlign: "center", color: "#dc2626" }}>{sd.rejectedCount}</td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "1rem",
                        background: sd.conversionRate >= 30 ? "#f0fdf4" : "#fef2f2",
                        color: sd.conversionRate >= 30 ? "#15803d" : "#b91c1c",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatPercent(sd.conversionRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Required Table 2: Quotation History Table with Lead Filter */}
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
              Quotation History <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({filtered.length})</span>
            </h2>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
              Click any quotation to view line items, tax details, and linked deal
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            
            {/* Filter by Individual Lead */}
            <select
              id="quote-lead-filter"
              value={selectedLeadIdFilter}
              onChange={e => { setSelectedLeadIdFilter(e.target.value); setPage(0); }}
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                fontSize: "0.75rem",
                color: selectedLeadIdFilter ? "#2563eb" : "#374151",
                background: selectedLeadIdFilter ? "#eff6ff" : "white",
                fontWeight: selectedLeadIdFilter ? 600 : 400,
                maxWidth: 190,
              }}
            >
              <option value="">All Client Leads ({availableLeadsForFilter.length})</option>
              {availableLeadsForFilter.map(l => (
                <option key={l!.id} value={l!.id}>
                  {l!.companyName} ({l!.id})
                </option>
              ))}
            </select>

            {/* Status Filter Buttons */}
            <div style={{ display: "flex", gap: "0.25rem", background: "#f3f4f6", padding: "0.2rem", borderRadius: "0.375rem" }}>
              {["", "Accepted", "Sent", "Viewed", "Rejected"].map(st => (
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
                id="quote-search-input"
                type="text"
                placeholder="Search quote #, lead..."
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
                  width: 180,
                }}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
            No quotation records match your filter criteria.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("quoteNumber")} style={{ cursor: "pointer" }}>Quotation ID ↕</th>
                    <th>Lead ID</th>
                    <th>Lead / Company Name</th>
                    <th>Service / Category</th>
                    <th onClick={() => toggleSort("totalAmount")} style={{ cursor: "pointer", textAlign: "right" }}>Quoted Amount ↕</th>
                    <th>Status</th>
                    <th onClick={() => toggleSort("createdAt")} style={{ cursor: "pointer" }}>Created ↕</th>
                    <th>Linked Deal ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(q => {
                    const lead = leadMap.get(q.leadId);
                    const deal = dealByQuoteId.get(q.id);
                    return (
                      <tr
                        key={q.id}
                        onClick={() => setSelectedQuote(q)}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                      >
                        <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{q.quoteNumber}</td>
                        <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>{q.leadId}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{lead?.companyName ?? "Unknown"}</div>
                          <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{lead?.contactName ?? ""}</div>
                        </td>
                        <td style={{ fontSize: "0.75rem", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {q.category}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#15803d" }}>
                          {formatCurrency(q.totalAmount)}
                        </td>
                        <td><StatusBadge status={q.status} /></td>
                        <td style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatDate(q.createdAt)}</td>
                        <td>
                          {deal ? (
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", padding: "0.15rem 0.45rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>
                              {deal.dealNumber}
                            </span>
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>—</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedQuote(q);
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
                            Details <ArrowRight size={10} />
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
                Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} quotations
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  id="quote-page-prev"
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
                  id="quote-page-next"
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

      {/* Drill-down Modal for Selected Quotation */}
      {selectedQuote && (
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
          onClick={() => setSelectedQuote(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: 700,
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
                    Quotation {selectedQuote.quoteNumber}
                  </h3>
                  <StatusBadge status={selectedQuote.status} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>
                  Internal ID: {selectedQuote.id} &bull; Created: {formatDate(selectedQuote.createdAt)} &bull; Valid Until: {formatDate(selectedQuote.validUntil)}
                </div>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Client & Sales Rep Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", background: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 500 }}>PROSPECT CLIENT</span>
                    {selectedQuoteLead && (
                      <button
                        onClick={() => {
                          setSelectedQuote(null);
                          navigateTo("leads", selectedQuoteLead.companyName);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#2563eb",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        View Lead in CRM <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b", marginTop: 2 }}>
                    {selectedQuoteLead?.companyName ?? selectedQuote.leadId}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Contact: {selectedQuoteLead?.contactName ?? "—"} ({selectedQuoteLead?.contactEmail ?? ""})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 500 }}>PREPARED BY</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b", marginTop: 2 }}>
                    {selectedQuoteEmp?.name ?? "Sales Team"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {selectedQuoteEmp?.role ?? "Sales Executive"} &bull; {selectedQuoteEmp?.department ?? "Sales"}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
                  Quoted Line Items
                </h4>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", overflow: "hidden" }}>
                  <table className="data-table" style={{ fontSize: "0.75rem" }}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Unit Price</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuote.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500, color: "#111827" }}>{item.description}</td>
                          <td style={{ textAlign: "center" }}>{item.quantity}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                          <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Amount Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                  <div style={{ width: 220, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280" }}>
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedQuote.subtotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280" }}>
                      <span>GST ({(selectedQuote.taxRate * 100).toFixed(0)}%):</span>
                      <span>{formatCurrency(selectedQuote.taxAmount)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#15803d", borderTop: "1px solid #e5e7eb", paddingTop: "0.35rem", fontSize: "0.875rem" }}>
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedQuote.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Associated Deal Details */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Linked CRM Deal
                  </h4>
                  {selectedQuoteDeal && (
                    <button
                      onClick={() => {
                        setSelectedQuote(null);
                        navigateTo("deals", selectedQuoteDeal.dealNumber);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#7c3aed",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      View Deal in CRM <ExternalLink size={10} />
                    </button>
                  )}
                </div>
                {selectedQuoteDeal ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f5f3ff", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #ede9fe" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#7c3aed" }}>Deal ID</div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#5b21b6" }}>{selectedQuoteDeal.dealNumber}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#7c3aed" }}>Status</div>
                      <div style={{ marginTop: 2 }}><StatusBadge status={selectedQuoteDeal.status} /></div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#7c3aed" }}>Deal Value</div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#15803d" }}>{formatCurrency(selectedQuoteDeal.value)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#7c3aed" }}>Win Probability</div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedQuoteDeal.probability}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#7c3aed" }}>Expected Close</div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>
                        {selectedQuoteDeal.expectedCloseDate ? formatDate(selectedQuoteDeal.expectedCloseDate) : "—"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "0.875rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280", border: "1px solid #f3f4f6" }}>
                    No deal has been created for this quotation yet (Quotation status: {selectedQuote.status}).
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", background: "#f9fafb" }}>
              <button
                onClick={() => setSelectedQuote(null)}
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
