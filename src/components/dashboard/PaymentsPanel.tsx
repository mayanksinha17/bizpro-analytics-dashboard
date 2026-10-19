import { useMemo, useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  X, ArrowRight, ExternalLink, FileText, ShoppingCart, Briefcase, User, CreditCard,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterPayments, filterInvoices, collectedRevenue,
  outstandingBalance, overdueAmount, revenueTimeSeries,
  revenueDailySeries, buildKPIs,
} from "../../analytics/utils";
import type { Payment } from "../../types";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatCurrencyCompact, formatDate, formatPercent } from "../../utils/format";

const PAGE_SIZE = 12;

export default function PaymentsPanel() {
  const { data, filter, navigateTo, globalSearch, setGlobalSearch } = useDashboard();
  const [search, setSearch] = useState(globalSearch || "");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Sync with globalSearch if passed from another module
  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
      setPage(0);
      setGlobalSearch("");
    }
  }, [globalSearch, setGlobalSearch]);

  const payments = useMemo(() => filterPayments(data, filter), [data, filter]);
  const invoices = useMemo(() => filterInvoices(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  const revenue = useMemo(() => collectedRevenue(payments), [payments]);
  const outstanding = useMemo(() => outstandingBalance(invoices), [invoices]);
  const overdue = useMemo(() => overdueAmount(invoices), [invoices]);

  const daysDuration = useMemo(() => {
    return Math.max(1, Math.round((filter.dateRange.end.getTime() - filter.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [filter.dateRange]);

  const revSeries = useMemo(() => {
    if (daysDuration <= 31) {
      return revenueDailySeries(payments, filter.dateRange);
    }
    const months = Math.min(12, Math.max(1, Math.ceil(daysDuration / 30)));
    return revenueTimeSeries(payments, months);
  }, [payments, filter.dateRange, daysDuration]);

  const completed = payments.filter(p => p.status === "Completed");
  const failed = payments.filter(p => p.status === "Failed");
  const pending = payments.filter(p => p.status === "Pending");

  // Fast lookups for cross-module drill-down
  const invoiceMap = useMemo(() => new Map(data.invoices.map(i => [i.id, i])), [data.invoices]);
  const orderMap = useMemo(() => new Map(data.orders.map(o => [o.id, o])), [data.orders]);
  const dealMap = useMemo(() => new Map(data.deals.map(d => [d.id, d])), [data.deals]);
  const leadMap = useMemo(() => new Map(data.leads.map(l => [l.id, l])), [data.leads]);

  const filtered = useMemo(() => {
    let rows = payments;
    if (statusFilter) rows = rows.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(p => {
        const lead = leadMap.get(p.leadId);
        return (
          p.paymentNumber.toLowerCase().includes(q) ||
          p.method.toLowerCase().includes(q) ||
          p.invoiceId.toLowerCase().includes(q) ||
          (p.transactionRef ?? "").toLowerCase().includes(q) ||
          (lead?.companyName ?? "").toLowerCase().includes(q)
        );
      });
    }
    return rows;
  }, [payments, search, statusFilter, leadMap]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Selected payment details
  const selInvoice = selectedPayment ? invoiceMap.get(selectedPayment.invoiceId) : null;
  const selOrder = selectedPayment ? orderMap.get(selectedPayment.orderId) : null;
  const selDeal = selectedPayment ? dealMap.get(selectedPayment.dealId) : null;
  const selLead = selectedPayment ? leadMap.get(selectedPayment.leadId) : null;

  if (payments.length === 0 && invoices.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* KPI Cards with Period-over-Period comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.875rem" }}>
        {[
          {
            label: "Collected Revenue",
            value: formatCurrency(revenue),
            color: "#15803d",
            bg: "#f0fdf4",
            comparison: kpis.totalRevenue,
          },
          {
            label: "Outstanding",
            value: formatCurrency(outstanding),
            color: "#d97706",
            bg: "#fffbeb",
            comparison: kpis.outstandingBalance,
          },
          {
            label: "Overdue",
            value: formatCurrency(overdue),
            color: "#b91c1c",
            bg: "#fef2f2",
            comparison: kpis.overdueAmount,
          },
          {
            label: "Completed",
            value: completed.length,
            color: "#15803d",
            bg: "#f0fdf4",
            comparison: kpis.completedPayments,
          },
          {
            label: "Failed",
            value: failed.length,
            color: "#b91c1c",
            bg: "#fef2f2",
            comparison: kpis.failedPayments,
          },
          {
            label: "Pending",
            value: pending.length,
            color: "#d97706",
            bg: "#fffbeb",
          },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: "0.875rem 1rem", background: item.bg, borderColor: "transparent" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#6b7280", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: typeof item.value === "number" ? "1.5rem" : "1.05rem", fontWeight: 700, color: item.color }}>{item.value}</div>
            {item.comparison && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: 4 }}>
                {item.comparison.isPositive ? (
                  <TrendingUp size={12} color="#15803d" />
                ) : (
                  <TrendingDown size={12} color="#b91c1c" />
                )}
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: item.comparison.isPositive ? "#15803d" : "#b91c1c" }}>
                  {item.comparison.changePercent >= 0 ? "+" : ""}{formatPercent(item.comparison.changePercent, 1)}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "#6b7280" }}>vs prev</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: "1rem 1.25rem" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          Revenue Collection Trend ({daysDuration <= 31 ? "Daily" : "Monthly"})
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.875rem" }}>
          Shows collected revenue according to active global filters
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revSeries} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={65} />
            <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fill="url(#payGrad)" dot={false} activeDot={{ r: 4, fill: "#059669" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Records Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, flex: 1, minWidth: 150 }}>
            Payment Records <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.8rem" }}>({filtered.length})</span>
          </h2>
          {/* Status quick filter */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {["", "Completed", "Failed", "Pending"].map(s => (
              <button
                key={s}
                id={`pay-filter-${s || "all"}`}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                style={{
                  padding: "0.25rem 0.625rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  background: statusFilter === s ? "#2563eb" : "#f3f4f6",
                  color: statusFilter === s ? "white" : "#6b7280",
                  border: "none",
                  fontWeight: statusFilter === s ? 600 : 400,
                }}
              >
                {s || "All"}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              id="payments-search"
              type="text"
              placeholder="Search payments, client..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              style={{
                paddingLeft: 28,
                paddingRight: 10,
                paddingTop: "0.3rem",
                paddingBottom: "0.3rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
                width: 190,
              }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
            No payment records match your filters.
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Client / Prospect</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Txn Ref</th>
                    <th>Paid At</th>
                    <th>Invoice ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(p => {
                    const lead = leadMap.get(p.leadId);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedPayment(p)}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                      >
                        <td style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{p.paymentNumber}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{lead?.companyName ?? p.leadId}</div>
                          <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{lead?.contactName ?? ""}</div>
                        </td>
                        <td><StatusBadge status={p.status} /></td>
                        <td style={{ color: "#374151" }}>{p.method}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: p.status === "Completed" ? "#15803d" : p.status === "Failed" ? "#b91c1c" : "#374151" }}>
                          {formatCurrency(p.amount)}
                        </td>
                        <td style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: "0.75rem" }}>{p.transactionRef ?? "—"}</td>
                        <td style={{ color: "#6b7280" }}>{formatDate(p.paidAt)}</td>
                        <td style={{ color: "#9ca3af", fontSize: "0.75rem", fontFamily: "monospace" }}>{p.invoiceId}</td>
                        <td>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedPayment(p);
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.125rem", borderTop: "1px solid #f3f4f6", fontSize: "0.8rem", color: "#6b7280" }}>
              <span>Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  id="payments-prev"
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
                  id="payments-next"
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

      {/* Drill-down Modal for Selected Payment Record */}
      {selectedPayment && (
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
          onClick={() => setSelectedPayment(null)}
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
                    Payment {selectedPayment.paymentNumber}
                  </h3>
                  <StatusBadge status={selectedPayment.status} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>
                  Client: {selLead?.companyName ?? selectedPayment.leadId} &bull; Recorded: {formatDate(selectedPayment.paidAt)} &bull; Amount: <span style={{ fontWeight: 700, color: selectedPayment.status === "Completed" ? "#15803d" : "#b91c1c" }}>{formatCurrency(selectedPayment.amount)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Payment Details */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <CreditCard size={16} color="#15803d" />
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Transaction Breakdown
                  </h4>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Amount Received</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: selectedPayment.status === "Completed" ? "#15803d" : "#b91c1c" }}>
                      {formatCurrency(selectedPayment.amount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Payment Method</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{selectedPayment.method}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Transaction Reference</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b", fontFamily: "monospace" }}>
                      {selectedPayment.transactionRef ?? "Pending Settlement"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Payment Status</div>
                    <div style={{ marginTop: 2 }}><StatusBadge status={selectedPayment.status} /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Payment Notes</div>
                    <div style={{ fontSize: "0.75rem", color: "#475569" }}>{selectedPayment.notes ?? "—"}</div>
                  </div>
                </div>
              </div>

              {/* Associated Invoice */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <FileText size={16} color="#2563eb" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Associated Invoice
                    </h4>
                  </div>
                  {selInvoice && (
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Invoice #{selInvoice.invoiceNumber}
                    </span>
                  )}
                </div>
                {selInvoice ? (
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.875rem", background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: "#2563eb", fontFamily: "monospace" }}>{selInvoice.invoiceNumber}</span>
                      <StatusBadge status={selInvoice.status} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.75rem", color: "#4b5563" }}>
                      <div>Subtotal: <strong>{formatCurrency(selInvoice.subtotal)}</strong></div>
                      <div>Tax (18% GST): <strong>{formatCurrency(selInvoice.taxAmount)}</strong></div>
                      <div>Total: <strong style={{ color: "#15803d" }}>{formatCurrency(selInvoice.totalAmount)}</strong></div>
                      <div>Paid to Date: <strong style={{ color: "#15803d" }}>{formatCurrency(selInvoice.paidAmount)}</strong></div>
                      <div>Outstanding: <strong style={{ color: selInvoice.outstandingAmount > 0 ? "#d97706" : "#6b7280" }}>{formatCurrency(selInvoice.outstandingAmount)}</strong></div>
                      <div>Due Date: <strong>{formatDate(selInvoice.dueDate)}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No linked invoice record found.
                  </div>
                )}
              </div>

              {/* Associated Order & Operations */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <ShoppingCart size={16} color="#0891b2" />
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                      Associated Order Fulfillment
                    </h4>
                  </div>
                  {selOrder && (
                    <button
                      onClick={() => {
                        setSelectedPayment(null);
                        navigateTo("orders", selOrder.orderNumber);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#0891b2",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      View in Orders <ExternalLink size={12} />
                    </button>
                  )}
                </div>
                {selOrder ? (
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.875rem", background: "#f0fdfa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: "#0891b2" }}>{selOrder.orderNumber} ({selOrder.category})</span>
                      <StatusBadge status={selOrder.status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}>
                      <span style={{ fontSize: "0.75rem", color: "#475569" }}>Completion Progress:</span>
                      <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", maxWidth: 200 }}>
                        <div style={{ height: "100%", width: `${selOrder.progress ?? 50}%`, background: selOrder.status === "Completed" ? "#16a34a" : "#0891b2" }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>{selOrder.progress ?? 50}%</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Deliverables: {selOrder.deliverables.join(", ")} &bull; Due: {formatDate(selOrder.dueDate)}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem", textAlign: "center", background: "#f9fafb", borderRadius: "0.375rem", fontSize: "0.78rem", color: "#6b7280" }}>
                    No order record associated.
                  </div>
                )}
              </div>

              {/* Associated Deal and Client Lead */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {/* Associated Deal */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.875rem", background: "#faf5ff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Briefcase size={14} color="#7c3aed" />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#5b21b6" }}>CRM Deal</span>
                    </div>
                    {selDeal && (
                      <button
                        onClick={() => {
                          setSelectedPayment(null);
                          navigateTo("deals", selDeal.dealNumber);
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
                        View Deal <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                  {selDeal ? (
                    <div style={{ fontSize: "0.75rem", color: "#4c1d95" }}>
                      <div>Deal: <strong>{selDeal.dealNumber}</strong></div>
                      <div>Status: <StatusBadge status={selDeal.status} /></div>
                      <div>Contract Value: <strong>{formatCurrency(selDeal.value)}</strong></div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>No linked deal found</div>
                  )}
                </div>

                {/* Client Lead Profile */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.875rem", background: "#eff6ff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <User size={14} color="#2563eb" />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e40af" }}>Client Profile</span>
                    </div>
                    {selLead && (
                      <button
                        onClick={() => {
                          setSelectedPayment(null);
                          navigateTo("leads", selLead.companyName);
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
                        View Lead <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                  {selLead ? (
                    <div style={{ fontSize: "0.75rem", color: "#1e3a8a" }}>
                      <div style={{ fontWeight: 700 }}>{selLead.companyName}</div>
                      <div>Contact: {selLead.contactName}</div>
                      <div style={{ fontSize: "0.7rem", color: "#3b82f6" }}>{selLead.contactEmail}</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>No client record found</div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", background: "#f9fafb" }}>
              <button
                onClick={() => setSelectedPayment(null)}
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
