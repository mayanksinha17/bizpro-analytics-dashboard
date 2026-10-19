import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  ShoppingCart, CheckCircle2, Clock, PauseCircle, AlertTriangle,
  ArrowRight, X, Briefcase, FileText, User, CheckSquare, CreditCard, ExternalLink,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterOrders, filterDeals, filterPayments,
  ordersByStatus, ordersByCategory, orderCompletionTrendSeries,
  orderProgressDistribution, operationsTeamWorkload,
  buildKPIs, safeDiv,
} from "../../analytics/utils";
import type { Order, OrderStatus } from "../../types";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatCurrencyCompact, formatDate, formatPercent } from "../../utils/format";

const PAGE_SIZE = 10;
const COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#10b981", "#f59e0b", "#dc2626", "#64748b", "#ec4899"];

const STATUS_COLORS: Record<string, string> = {
  "Completed": "#16a34a",
  "In Progress": "#2563eb",
  "Pending": "#f59e0b",
  "On Hold": "#64748b",
  "Cancelled": "#dc2626",
};

const ALL_STATUSES: OrderStatus[] = [
  "Completed", "In Progress", "Pending", "On Hold", "Cancelled",
];

export default function OrdersPanel() {
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

  const [sortBy, setSortBy] = useState<"createdAt" | "value" | "orderNumber" | "progress">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Selected order for drill-down modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = useMemo(() => filterOrders(data, filter), [data, filter]);
  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  const byStatus = useMemo(() => ordersByStatus(orders), [orders]);
  const byCat = useMemo(() => ordersByCategory(orders), [orders]);
  const completionTrends = useMemo(() => orderCompletionTrendSeries(orders, filter.dateRange), [orders, filter.dateRange]);
  const progressDist = useMemo(() => orderProgressDistribution(orders), [orders]);
  const opsWorkload = useMemo(() => operationsTeamWorkload(orders, data.employees), [orders, data.employees]);

  // Lookup maps
  const leadMap = useMemo(() => new Map(data.leads.map(l => [l.id, l])), [data.leads]);
  const dealMap = useMemo(() => new Map(data.deals.map(d => [d.id, d])), [data.deals]);
  const employeeMap = useMemo(() => new Map(data.employees.map(e => [e.id, e])), [data.employees]);

  // Filtered and sorted rows
  const filtered = useMemo(() => {
    let rows = orders;
    if (statusFilter) {
      rows = rows.filter(o => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(o => {
        const lead = leadMap.get(o.leadId);
        const deal = dealMap.get(o.dealId);
        const emp = employeeMap.get(o.assignedTo);
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          (lead?.companyName ?? "").toLowerCase().includes(q) ||
          (lead?.contactName ?? "").toLowerCase().includes(q) ||
          (deal?.dealNumber ?? "").toLowerCase().includes(q) ||
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
      } else if (sortBy === "orderNumber") {
        va = a.orderNumber;
        vb = b.orderNumber;
      } else if (sortBy === "progress") {
        va = a.progress ?? 0;
        vb = b.progress ?? 0;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [orders, search, statusFilter, sortBy, sortDir, leadMap, dealMap, employeeMap]);

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

  // Drill-down data for selected order
  const selectedLead = selectedOrder ? leadMap.get(selectedOrder.leadId) : null;
  const selectedDeal = selectedOrder ? dealMap.get(selectedOrder.dealId) : null;
  const selectedEmp = selectedOrder ? employeeMap.get(selectedOrder.assignedTo) : null;
  const relatedInvoices = selectedOrder ? data.invoices.filter(i => i.orderId === selectedOrder.id || i.dealId === selectedOrder.dealId) : [];
  const relatedPayments = selectedOrder ? data.payments.filter(p => p.orderId === selectedOrder.id || p.dealId === selectedOrder.dealId) : [];

  if (orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      {/* 6 Required KPI Cards with previous-period comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem" }}>
        {[
          {
            id: "kpi-order-total",
            label: "Total Orders",
            value: orders.length,
            color: "#2563eb",
            bg: "#eff6ff",
            icon: ShoppingCart,
            kpi: kpis.totalOrders,
            subtitle: "In selected period",
          },
          {
            id: "kpi-order-completed",
            label: "Completed Orders",
            value: byStatus["Completed"] ?? 0,
            color: "#16a34a",
            bg: "#f0fdf4",
            icon: CheckCircle2,
            kpi: kpis.completedOrders,
            subtitle: `${formatPercent(safeDiv(byStatus["Completed"] ?? 0, orders.length) * 100)} fulfillment`,
          },
          {
            id: "kpi-order-in-progress",
            label: "In-Progress Orders",
            value: byStatus["In Progress"] ?? 0,
            color: "#0891b2",
            bg: "#ecfeff",
            icon: Clock,
            kpi: kpis.inProgressOrders,
            subtitle: "Active operations queue",
          },
          {
            id: "kpi-order-pending",
            label: "Pending Orders",
            value: byStatus["Pending"] ?? 0,
            color: "#f59e0b",
            bg: "#fffbeb",
            icon: Clock,
            kpi: kpis.pendingOrders,
            subtitle: "Awaiting kickoff",
          },
          {
            id: "kpi-order-on-hold",
            label: "On-Hold Orders",
            value: byStatus["On Hold"] ?? 0,
            color: "#64748b",
            bg: "#f8fafc",
            icon: PauseCircle,
            kpi: kpis.onHoldOrders,
            subtitle: "Client dependencies",
          },
          {
            id: "kpi-order-overdue",
            label: "Overdue Orders",
            value: kpis.overdueOrders.current,
            color: "#dc2626",
            bg: "#fef2f2",
            icon: AlertTriangle,
            kpi: kpis.overdueOrders,
            subtitle: "Past due date",
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

      {/* Visualizations Row 1: Orders by Status & Orders by Service/Category */}
      <div className="chart-grid-1-2">
        
        {/* 1. Orders by Status */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Orders by Status</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Current operational status across all orders</p>
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

        {/* 2. Orders by Service/Category */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Orders by Service Category</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Workload breakdown per service delivery line</p>
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
      </div>

      {/* Visualizations Row 2: Completion Trends & Progress Distribution */}
      <div className="chart-grid-2-1-alt">
        
        {/* 3. Order Completion Trends */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Order Completion Trends</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>New incoming orders vs orders fulfilled</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={completionTrends} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="created" name="Orders Created" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="completed" name="Orders Completed" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Order Stage/Progress Distribution */}
        <div className="card" style={{ padding: "1.125rem 1.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Order Progress Distribution</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Orders grouped by fulfillment completion stages</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.5rem" }}>
            {progressDist.map(item => (
              <div key={item.stage}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginBottom: 3 }}>
                  <span style={{ fontWeight: 500, color: "#374151" }}>{item.stage}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>
                    {item.count} <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}>({item.percentage.toFixed(1)}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.percentage}%`, background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Operations Team Activity */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Operations Team Activity & Workload</h2>
          <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
            Workload distribution, throughput, and completion velocity across operations personnel
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Operations Member</th>
                <th>Role</th>
                <th style={{ textAlign: "center" }}>Total Assigned</th>
                <th style={{ textAlign: "center" }}>Completed</th>
                <th style={{ textAlign: "center" }}>In Progress</th>
                <th style={{ textAlign: "center" }}>Pending</th>
                <th style={{ textAlign: "right" }}>Total Order Value</th>
                <th style={{ textAlign: "right" }}>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {opsWorkload.map(ow => (
                <tr key={ow.employee.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{ow.employee.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>{ow.employee.email}</div>
                  </td>
                  <td><span style={{ fontSize: "0.75rem", color: "#4b5563" }}>{ow.employee.role}</span></td>
                  <td style={{ textAlign: "center", fontWeight: 700, color: "#2563eb" }}>{ow.assignedOrders}</td>
                  <td style={{ textAlign: "center", fontWeight: 600, color: "#16a34a" }}>{ow.completedOrders}</td>
                  <td style={{ textAlign: "center", fontWeight: 600, color: "#0891b2" }}>{ow.inProgressOrders}</td>
                  <td style={{ textAlign: "center", color: "#f59e0b" }}>{ow.pendingOrders}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#111827" }}>{formatCurrency(ow.totalValue)}</td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "1rem",
                        background: ow.completionRate >= 50 ? "#f0fdf4" : "#fffbeb",
                        color: ow.completionRate >= 50 ? "#15803d" : "#d97706",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatPercent(ow.completionRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Required Order Records Table */}
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
              Order Records <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({filtered.length})</span>
            </h2>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
              Click any order to view fulfillment deliverables, progress checklist, and payment records
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Quick Status Filter */}
            <div style={{ display: "flex", gap: "0.25rem", background: "#f3f4f6", padding: "0.2rem", borderRadius: "0.375rem" }}>
              {["", "Completed", "In Progress", "Pending", "On Hold"].map(st => (
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
                id="orders-search-input"
                type="text"
                placeholder="Search order #, company..."
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
            No orders match your filter criteria.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("orderNumber")} style={{ cursor: "pointer" }}>Order ID ↕</th>
                    <th>Customer / Company</th>
                    <th>Related Deal ID</th>
                    <th>Service / Category</th>
                    <th onClick={() => toggleSort("value")} style={{ cursor: "pointer", textAlign: "right" }}>Order Value ↕</th>
                    <th>Status</th>
                    <th onClick={() => toggleSort("progress")} style={{ cursor: "pointer" }}>Progress ↕</th>
                    <th onClick={() => toggleSort("createdAt")} style={{ cursor: "pointer" }}>Created ↕</th>
                    <th>Expected Completion</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(o => {
                    const lead = leadMap.get(o.leadId);
                    const deal = dealMap.get(o.dealId);
                    const isOverdue = o.status !== "Completed" && o.status !== "Cancelled" && new Date(o.dueDate) < new Date("2026-10-19");
                    const progressVal = o.progress ?? (o.status === "Completed" ? 100 : o.status === "In Progress" ? 65 : 15);
                    return (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                      >
                        <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{o.orderNumber}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{lead?.companyName ?? o.leadId}</div>
                          <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{lead?.contactName ?? ""}</div>
                        </td>
                        <td>
                          {deal ? (
                            <span style={{ fontSize: "0.72rem", color: "#7c3aed", fontFamily: "monospace", background: "#f5f3ff", padding: "0.15rem 0.45rem", borderRadius: "0.25rem" }}>
                              {deal.dealNumber}
                            </span>
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>—</span>
                          )}
                        </td>
                        <td style={{ fontSize: "0.75rem", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {o.category}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#111827" }}>
                          {formatCurrency(o.value)}
                        </td>
                        <td><StatusBadge status={o.status} /></td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 90 }}>
                            <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                              <div
                                style={{
                                  height: "100%",
                                  width: `${progressVal}%`,
                                  background: o.status === "Completed" ? "#16a34a" : isOverdue ? "#dc2626" : "#2563eb",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}>{progressVal}%</span>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatDate(o.createdAt)}</td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: isOverdue ? "#dc2626" : "#6b7280", fontWeight: isOverdue ? 600 : 400 }}>
                            {formatDate(o.dueDate)}
                            {isOverdue && <span style={{ marginLeft: 4, color: "#dc2626", fontSize: "0.68rem" }}>(Overdue)</span>}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedOrder(o);
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
                Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} orders
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  id="orders-page-prev"
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
                  id="orders-page-next"
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

      {/* Drill-down Modal for Selected Order */}
      {selectedOrder && (
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
          onClick={() => setSelectedOrder(null)}
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
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4, display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span>Client: <strong>{selectedLead?.companyName ?? selectedOrder.leadId}</strong></span>
                  {selectedLead && (
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
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
                  <span>&bull; Service: {selectedOrder.category} &bull; Value: {formatCurrency(selectedOrder.value)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Order Execution Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Order Value</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#15803d" }}>{formatCurrency(selectedOrder.value)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Progress</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2563eb" }}>{selectedOrder.progress ?? 50}%</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Assigned Specialist</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedEmp?.name ?? "Ops Team"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Created Date</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{formatDate(selectedOrder.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Due Date</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{formatDate(selectedOrder.dueDate)}</div>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <CheckSquare size={16} color="#059669" />
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Operational Deliverables Checklist
                  </h4>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {selectedOrder.deliverables.map((deliv, idx) => {
                    const isDone = selectedOrder.status === "Completed" || (selectedOrder.progress ?? 50) > (idx + 1) * 20;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          background: isDone ? "#f0fdf4" : "#f8fafc",
                          border: `1px solid ${isDone ? "#bbf7d0" : "#e2e8f0"}`,
                          fontSize: "0.78rem",
                        }}
                      >
                        <CheckCircle2 size={14} color={isDone ? "#16a34a" : "#9ca3af"} />
                        <span style={{ fontWeight: isDone ? 600 : 400, color: isDone ? "#166534" : "#4b5563" }}>
                          {deliv}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Related Deal & Prospect Information */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Briefcase size={16} color="#7c3aed" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Linked CRM Deal Details
                    </h4>
                  </div>
                  {selectedDeal && (
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        navigateTo("deals", selectedDeal.dealNumber);
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
                {selectedDeal ? (
                  <div style={{ border: "1px solid #ede9fe", borderRadius: "0.375rem", padding: "0.75rem", background: "#f5f3ff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: "#6d28d9", fontFamily: "monospace" }}>{selectedDeal.dealNumber}</span>
                      <StatusBadge status={selectedDeal.status} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#4c1d95" }}>
                      Deal Value: {formatCurrency(selectedDeal.value)} &bull; Win Probability: {selectedDeal.probability}% &bull; Category: {selectedDeal.category}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No linked deal found.
                  </div>
                )}
              </div>

              {/* Associated Invoices & Payments */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <CreditCard size={16} color="#15803d" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Invoices & Payment Records
                    </h4>
                  </div>
                  {(relatedInvoices.length > 0 || relatedPayments.length > 0) && (
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        navigateTo("payments", relatedPayments[0]?.paymentNumber ?? relatedInvoices[0]?.invoiceNumber);
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
                {relatedInvoices.length === 0 && relatedPayments.length === 0 ? (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No invoices or payment transactions recorded for this order yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {relatedInvoices.length > 0 && (
                      <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                        <table className="data-table" style={{ fontSize: "0.72rem" }}>
                          <thead>
                            <tr>
                              <th>Invoice #</th>
                              <th>Status</th>
                              <th>Total Amount</th>
                              <th>Paid Amount</th>
                              <th>Due Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {relatedInvoices.map(inv => (
                              <tr key={inv.id}>
                                <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{inv.invoiceNumber}</td>
                                <td><StatusBadge status={inv.status} /></td>
                                <td>{formatCurrency(inv.totalAmount)}</td>
                                <td style={{ fontWeight: 600, color: "#15803d" }}>{formatCurrency(inv.paidAmount)}</td>
                                <td>{formatDate(inv.dueDate)}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(null);
                                      navigateTo("payments", inv.invoiceNumber);
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
                    {relatedPayments.length > 0 && (
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
                            {relatedPayments.map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{p.paymentNumber}</td>
                                <td><StatusBadge status={p.status} /></td>
                                <td>{p.method}</td>
                                <td style={{ fontWeight: 600, color: p.status === "Completed" ? "#15803d" : "#dc2626" }}>{formatCurrency(p.amount)}</td>
                                <td>{formatDate(p.paidAt)}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(null);
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
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", background: "#f9fafb" }}>
              <button
                onClick={() => setSelectedOrder(null)}
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
