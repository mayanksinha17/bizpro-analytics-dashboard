import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import {
  Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  Briefcase, CheckCircle2, Clock, XCircle, DollarSign, Wallet,
  AlertCircle, ArrowRight, X, FileText, ShoppingCart, CreditCard, ExternalLink,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterDeals, filterPayments, filterInvoices, filterOrders,
  dealsByCategory, dealsByStatus, dealWinRate, wonDealValue,
  totalDealValue, dealsPriorityBreakdown, dealRevenueTrendSeries,
  collectedRevenue, outstandingBalance, buildKPIs, safeDiv,
} from "../../analytics/utils";
import type { Deal, DealStatus, Priority } from "../../types";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatCurrencyCompact, formatDate, formatPercent } from "../../utils/format";

const PAGE_SIZE = 10;
const COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#10b981", "#f59e0b", "#dc2626", "#64748b", "#ec4899"];

const STATUS_COLORS: Record<string, string> = {
  "Won": "#16a34a",
  "Active": "#2563eb",
  "Lost": "#dc2626",
  "On Hold": "#d97706",
  "Cancelled": "#6b7280",
};

const ALL_STATUSES: DealStatus[] = ["Won", "Active", "Lost", "On Hold", "Cancelled"];

export default function DealsPanel() {
  const { data, filter, navigateTo, globalSearch, setGlobalSearch } = useDashboard();
  const [search, setSearch] = useState(globalSearch || "");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);

  // Sync with globalSearch if passed from another module
  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
      setPage(0);
      setGlobalSearch("");
    }
  }, [globalSearch, setGlobalSearch]);

  const [sortBy, setSortBy] = useState<"createdAt" | "value" | "dealNumber" | "probability">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Selected deal for drill-down modal
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const payments = useMemo(() => filterPayments(data, filter), [data, filter]);
  const invoices = useMemo(() => filterInvoices(data, filter), [data, filter]);
  const orders = useMemo(() => filterOrders(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  const byCat = useMemo(() => dealsByCategory(deals), [deals]);
  const byStatus = useMemo(() => dealsByStatus(deals), [deals]);
  const priorityData = useMemo(() => dealsPriorityBreakdown(deals, data.leads), [deals, data.leads]);
  const trendData = useMemo(() => dealRevenueTrendSeries(deals, payments, filter.dateRange), [deals, payments, filter.dateRange]);

  // Lookup maps
  const leadMap = useMemo(() => new Map(data.leads.map(l => [l.id, l])), [data.leads]);
  const quoteMap = useMemo(() => new Map(data.quotations.map(q => [q.id, q])), [data.quotations]);
  const employeeMap = useMemo(() => new Map(data.employees.map(e => [e.id, e])), [data.employees]);

  // Comparison metrics for pipeline vs invoiced vs collected
  const totalValue = useMemo(() => totalDealValue(deals), [deals]);
  const wonValue = useMemo(() => wonDealValue(deals), [deals]);
  const totalCollected = useMemo(() => collectedRevenue(payments), [payments]);
  const totalOutstanding = useMemo(() => outstandingBalance(invoices), [invoices]);

  // Filtered & sorted deal rows
  const filtered = useMemo(() => {
    let rows = deals;
    if (statusFilter) {
      rows = rows.filter(d => d.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(d => {
        const lead = leadMap.get(d.leadId);
        const quote = quoteMap.get(d.quotationId);
        const emp = employeeMap.get(d.assignedTo);
        return (
          d.dealNumber.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          (lead?.companyName ?? "").toLowerCase().includes(q) ||
          (lead?.contactName ?? "").toLowerCase().includes(q) ||
          (quote?.quoteNumber ?? "").toLowerCase().includes(q) ||
          (emp?.name ?? "").toLowerCase().includes(q)
        );
      });
    }

    return [...rows].sort((a, b) => {
      let va: string | number = a.createdAt;
      let vb: string | number = b.createdAt;
      if (sortBy === "value") {
        va = a.value;
        vb = b.value;
      } else if (sortBy === "dealNumber") {
        va = a.dealNumber;
        vb = b.dealNumber;
      } else if (sortBy === "probability") {
        va = a.probability;
        vb = b.probability;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [deals, search, statusFilter, sortBy, sortDir, leadMap, quoteMap, employeeMap]);

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

  // Drill-down data for selected deal
  const selectedLead = selectedDeal ? leadMap.get(selectedDeal.leadId) : null;
  const selectedQuote = selectedDeal ? quoteMap.get(selectedDeal.quotationId) : null;
  const selectedEmp = selectedDeal ? employeeMap.get(selectedDeal.assignedTo) : null;
  const dealOrders = selectedDeal ? data.orders.filter(o => o.dealId === selectedDeal.id) : [];
  const dealInvoices = selectedDeal ? data.invoices.filter(i => i.dealId === selectedDeal.id) : [];
  const dealPayments = selectedDeal ? data.payments.filter(p => p.dealId === selectedDeal.id) : [];
  const dealCollected = dealPayments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);

  if (deals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      {/* 7 Required KPI Cards with previous-period comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem" }}>
        {[
          {
            id: "kpi-deal-total",
            label: "Total Deals",
            value: deals.length,
            color: "#2563eb",
            bg: "#eff6ff",
            icon: Briefcase,
            kpi: kpis.totalDeals,
            subtitle: "In selected period",
          },
          {
            id: "kpi-deal-won",
            label: "Won Deals",
            value: byStatus["Won"] ?? 0,
            color: "#16a34a",
            bg: "#f0fdf4",
            icon: CheckCircle2,
            kpi: kpis.wonDeals,
            subtitle: `${formatPercent(kpis.dealWinRate.current)} win rate`,
          },
          {
            id: "kpi-deal-active",
            label: "Active Deals",
            value: byStatus["Active"] ?? 0,
            color: "#0891b2",
            bg: "#ecfeff",
            icon: Clock,
            kpi: kpis.activeDeals,
            subtitle: "Pipeline in progress",
          },
          {
            id: "kpi-deal-lost",
            label: "Lost Deals",
            value: byStatus["Lost"] ?? 0,
            color: "#dc2626",
            bg: "#fef2f2",
            icon: XCircle,
            kpi: kpis.lostDeals,
            subtitle: "Closed unfulfilled",
          },
          {
            id: "kpi-deal-total-value",
            label: "Total Deal Value",
            value: formatCurrency(totalValue),
            color: "#111827",
            bg: "#f8fafc",
            icon: DollarSign,
            kpi: kpis.totalDealValue,
            subtitle: "Aggregate pipeline",
          },
          {
            id: "kpi-deal-won-revenue",
            label: "Won Revenue",
            value: formatCurrency(wonValue),
            color: "#15803d",
            bg: "#f0fdf4",
            icon: Wallet,
            kpi: kpis.wonRevenue,
            subtitle: "Closed converted value",
          },
          {
            id: "kpi-deal-outstanding-revenue",
            label: "Outstanding Revenue",
            value: formatCurrency(totalOutstanding),
            color: "#d97706",
            bg: "#fffbeb",
            icon: AlertCircle,
            kpi: kpis.outstandingRevenue,
            subtitle: "Pending payment invoices",
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
              <div style={{ fontSize: typeof item.value === "number" ? "1.625rem" : "1.2rem", fontWeight: 700, color: item.color, lineHeight: 1.2 }}>
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

      {/* Visualizations Row 1: Deals Created & Revenue by Service/Category */}
      <div className="chart-grid-2">
        
        {/* 1. Deals Created by Service/Category */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Deals Created by Service</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Volume of business deals across service lines</p>
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

        {/* 2. Revenue by Service/Category */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Deal Value by Service (INR)</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Aggregate deal pipeline value per offering</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={byCat.slice(0, 7)} margin={{ top: 5, right: 5, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-20} textAnchor="end" height={40} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Deal Value"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={32} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visualizations Row 2: Status Distribution, Revenue Trends & Pipeline Reconciliation */}
      <div className="chart-grid-2">
        
        {/* 3. Deal Status Distribution */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Deal Status Distribution</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Deals categorized by their closing stage</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={ALL_STATUSES.map(s => ({ status: s, count: byStatus[s] ?? 0, fill: STATUS_COLORS[s] ?? "#2563eb" }))}
              margin={{ top: 5, right: 5, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 9, fill: "#6b7280" }} interval={0} angle={-15} textAnchor="end" height={35} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {ALL_STATUSES.map(s => <Cell key={s} fill={STATUS_COLORS[s] ?? "#2563eb"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Daily/Monthly Revenue Trend: Deal Value vs Collected Revenue */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Revenue & Pipeline Trend</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Deal Creation Value vs Actual Collected Payments</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={(v: unknown, name: unknown) => [formatCurrency(v as number), String(name)]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="dealValue" name="Deal Value" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="collectedRevenue" name="Collected Revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visualizations Row 3: Deal Value vs Collected Comparison & Priority Breakdown */}
      <div className="chart-grid-2-1-alt">
        
        {/* 5. Total Deal Value vs Invoiced vs Collected Revenue */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
              Deal Value versus Collected Revenue
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
              Clear distinction between pipeline value, realized won revenue, and cash collected
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              {
                label: "1. Total Pipeline Deals",
                amount: totalValue,
                color: "#2563eb",
                desc: `${deals.length} total deals in selected period`,
                pct: 100,
              },
              {
                label: "2. Won Business Deals",
                amount: wonValue,
                color: "#0891b2",
                desc: `${byStatus["Won"] ?? 0} converted deals formally won`,
                pct: safeDiv(wonValue, totalValue) * 100,
              },
              {
                label: "3. Cash Collections Realized",
                amount: totalCollected,
                color: "#16a34a",
                desc: `${payments.filter(p => p.status === "Completed").length} verified payments completed`,
                pct: safeDiv(totalCollected, totalValue) * 100,
              },
              {
                label: "4. Outstanding Invoice Receivables",
                amount: totalOutstanding,
                color: "#d97706",
                desc: `Unpaid invoice balance awaiting settlement`,
                pct: safeDiv(totalOutstanding, totalValue) * 100,
              },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>
                    {formatCurrency(item.amount)} <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}>({item.pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, item.pct)}%`, background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Deal Priority Breakdown */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Deal Priority Breakdown</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Volume and value weighted by prospect priority</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {priorityData.map(p => {
              const pColors: Record<Priority, { bg: string; text: string; fill: string }> = {
                "High": { bg: "#fef2f2", text: "#dc2626", fill: "#ef4444" },
                "Medium": { bg: "#fffbeb", text: "#d97706", fill: "#f59e0b" },
                "Low": { bg: "#f0fdf4", text: "#16a34a", fill: "#10b981" },
              };
              const c = pColors[p.priority];
              return (
                <div key={p.priority} style={{ padding: "0.55rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb", background: "#fcfcfd" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "0.25rem", background: c.bg, color: c.text }}>
                      {p.priority} Priority
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>
                      {p.count} deals <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}>({p.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280", marginBottom: 3 }}>
                    <span>Pipeline Value:</span>
                    <span style={{ fontWeight: 600, color: "#15803d" }}>{formatCurrency(p.value)}</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.percentage}%`, background: c.fill, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required Deal Records Table */}
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
              Deal Records <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({filtered.length})</span>
            </h2>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
              Click any deal to view associated lead, quotation, orders, and payment records
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Quick Status Filter */}
            <div style={{ display: "flex", gap: "0.25rem", background: "#f3f4f6", padding: "0.2rem", borderRadius: "0.375rem" }}>
              {["", "Won", "Active", "Lost"].map(st => (
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
                id="deals-search-input"
                type="text"
                placeholder="Search deal #, client..."
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
            No deals match your search criteria.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("dealNumber")} style={{ cursor: "pointer" }}>Deal ID ↕</th>
                    <th>Lead / Company Name</th>
                    <th>Linked Quotation</th>
                    <th>Service / Category</th>
                    <th onClick={() => toggleSort("value")} style={{ cursor: "pointer", textAlign: "right" }}>Deal Value ↕</th>
                    <th>Deal Status</th>
                    <th>Priority</th>
                    <th>Assigned Rep</th>
                    <th onClick={() => toggleSort("createdAt")} style={{ cursor: "pointer" }}>Created ↕</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(d => {
                    const lead = leadMap.get(d.leadId);
                    const quote = quoteMap.get(d.quotationId);
                    const emp = employeeMap.get(d.assignedTo);
                    const prio: Priority = d.priority ?? lead?.priority ?? "Medium";
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDeal(d)}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                      >
                        <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{d.dealNumber}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{lead?.companyName ?? d.leadId}</div>
                          <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{lead?.contactName ?? ""}</div>
                        </td>
                        <td>
                          {quote ? (
                            <span style={{ fontSize: "0.72rem", color: "#2563eb", fontFamily: "monospace", background: "#eff6ff", padding: "0.15rem 0.45rem", borderRadius: "0.25rem" }}>
                              {quote.quoteNumber}
                            </span>
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>—</span>
                          )}
                        </td>
                        <td style={{ fontSize: "0.75rem", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {d.category}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: d.status === "Won" ? "#15803d" : "#111827" }}>
                          {formatCurrency(d.value)}
                        </td>
                        <td><StatusBadge status={d.status} /></td>
                        <td>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              padding: "0.15rem 0.45rem",
                              borderRadius: "0.25rem",
                              background: prio === "High" ? "#fef2f2" : prio === "Medium" ? "#fffbeb" : "#f0fdf4",
                              color: prio === "High" ? "#dc2626" : prio === "Medium" ? "#d97706" : "#16a34a",
                            }}
                          >
                            {prio}
                          </span>
                        </td>
                        <td><span style={{ fontSize: "0.75rem", color: "#374151" }}>{emp?.name ?? "—"}</span></td>
                        <td style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatDate(d.createdAt)}</td>
                        <td>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedDeal(d);
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
                Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} deals
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  id="deals-page-prev"
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
                  id="deals-page-next"
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

      {/* Drill-down Modal for Selected Deal */}
      {selectedDeal && (
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
          onClick={() => setSelectedDeal(null)}
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
                    Deal {selectedDeal.dealNumber}
                  </h3>
                  <StatusBadge status={selectedDeal.status} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4, display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span>Client: <strong>{selectedLead?.companyName ?? selectedDeal.leadId}</strong></span>
                  {selectedLead && (
                    <button
                      onClick={() => {
                        setSelectedDeal(null);
                        navigateTo("leads", selectedLead.companyName);
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
                  <span>&bull; Created: {formatDate(selectedDeal.createdAt)} &bull; Value: {formatCurrency(selectedDeal.value)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Deal Metrics Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Category</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedDeal.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Deal Value</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#15803d" }}>{formatCurrency(selectedDeal.value)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Win Probability</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedDeal.probability}%</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Assigned Rep</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedEmp?.name ?? "Sales Team"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Expected Close</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedDeal.expectedCloseDate ? formatDate(selectedDeal.expectedCloseDate) : "—"}</div>
                </div>
              </div>

              {/* Linked Quotation Summary */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <FileText size={16} color="#2563eb" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Linked Quotation
                    </h4>
                  </div>
                  {selectedQuote && (
                    <button
                      onClick={() => {
                        setSelectedDeal(null);
                        navigateTo("quotations", selectedQuote.quoteNumber);
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
                      View in Quotations <ExternalLink size={10} />
                    </button>
                  )}
                </div>
                {selectedQuote ? (
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.75rem", background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{selectedQuote.quoteNumber}</span>
                      <StatusBadge status={selectedQuote.status} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#4b5563" }}>
                      Subtotal: {formatCurrency(selectedQuote.subtotal)} &bull; Tax (18%): {formatCurrency(selectedQuote.taxAmount)} &bull; <strong>Total: {formatCurrency(selectedQuote.totalAmount)}</strong>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                      Valid Until: {formatDate(selectedQuote.validUntil)}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No linked quotation found.
                  </div>
                )}
              </div>

              {/* Associated Orders */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <ShoppingCart size={16} color="#0891b2" />
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Associated Orders ({dealOrders.length})
                  </h4>
                </div>
                {dealOrders.length === 0 ? (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No active or completed orders for this deal yet.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <table className="data-table" style={{ fontSize: "0.75rem" }}>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Status</th>
                          <th>Value</th>
                          <th>Progress</th>
                          <th>Due Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dealOrders.map(o => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{o.orderNumber}</td>
                            <td><StatusBadge status={o.status} /></td>
                            <td style={{ fontWeight: 600 }}>{formatCurrency(o.value)}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden", minWidth: 60 }}>
                                  <div style={{ height: "100%", width: `${o.progress ?? 50}%`, background: o.status === "Completed" ? "#16a34a" : "#2563eb" }} />
                                </div>
                                <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{o.progress ?? 50}%</span>
                              </div>
                            </td>
                            <td>{formatDate(o.dueDate)}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedDeal(null);
                                  navigateTo("orders", o.orderNumber);
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

              {/* Payments & Collection Summary */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <CreditCard size={16} color="#15803d" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Payment & Collection Summary
                    </h4>
                  </div>
                  {dealPayments.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedDeal(null);
                        navigateTo("payments", dealPayments[0].paymentNumber);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#15803d",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      View in Payments <ExternalLink size={10} />
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", background: "#f0fdf4", padding: "0.75rem", borderRadius: "0.375rem", border: "1px solid #dcfce7", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#166534" }}>Collected Payments</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#15803d" }}>{formatCurrency(dealCollected)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#166534" }}>Invoices Linked</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#15803d" }}>{dealInvoices.length} invoice(s)</div>
                  </div>
                </div>

                {dealPayments.length > 0 && (
                  <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <table className="data-table" style={{ fontSize: "0.72rem" }}>
                      <thead>
                        <tr>
                          <th>Payment #</th>
                          <th>Status</th>
                          <th>Method</th>
                          <th>Amount</th>
                          <th>Paid Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dealPayments.map(p => (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{p.paymentNumber}</td>
                            <td><StatusBadge status={p.status} /></td>
                            <td>{p.method}</td>
                            <td style={{ fontWeight: 600, color: p.status === "Completed" ? "#15803d" : "#dc2626" }}>{formatCurrency(p.amount)}</td>
                            <td>{formatDate(p.paidAt)}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedDeal(null);
                                  navigateTo("payments", p.paymentNumber);
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
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", background: "#f9fafb" }}>
              <button
                onClick={() => setSelectedDeal(null)}
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
