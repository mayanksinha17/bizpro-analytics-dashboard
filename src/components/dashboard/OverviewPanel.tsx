import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { DollarSign, TrendingUp, Users, ShoppingCart, FileText, Target } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  filterLeads, filterDeals, filterQuotations, filterPayments,
  filterOrders, filterInvoices, buildKPIs, revenueTimeSeries,
  revenueDailySeries, leadsBySource, dealsByCategory,
  outstandingBalance, ordersByStatus,
} from "../../analytics/utils";
import KPICard from "../shared/KPICard";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "../../utils/format";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#16a34a", "#9333ea"];
const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];

export default function OverviewPanel() {
  const { data, filter, navigateTo } = useDashboard();

  const leads = useMemo(() => filterLeads(data, filter), [data, filter]);
  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const quotations = useMemo(() => filterQuotations(data, filter), [data, filter]);
  const payments = useMemo(() => filterPayments(data, filter), [data, filter]);
  const orders = useMemo(() => filterOrders(data, filter), [data, filter]);
  const invoices = useMemo(() => filterInvoices(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

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

  const sourceData = useMemo(() => leadsBySource(leads), [leads]);
  const dealCats = useMemo(() => dealsByCategory(deals), [deals]);
  const outstanding = useMemo(() => outstandingBalance(invoices), [invoices]);
  const orderStatus = useMemo(() => ordersByStatus(orders), [orders]);

  const wonDeals = deals.filter(d => d.status === "Won");
  const activeDeals = deals.filter(d => d.status === "Active");

  const isCompletelyEmpty =
    leads.length === 0 &&
    deals.length === 0 &&
    orders.length === 0 &&
    payments.length === 0;

  if (isCompletelyEmpty) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* KPI Row 1 - Clickable to jump to corresponding module */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem" }}>
        <KPICard
          id="kpi-revenue"
          title="Collected Revenue"
          kpi={kpis.totalRevenue}
          valueType="currency"
          icon={DollarSign}
          iconColor="#15803d"
          iconBg="#f0fdf4"
          subtitle={`${formatCurrency(outstanding)} outstanding`}
          onClick={() => navigateTo("payments")}
        />
        <KPICard
          id="kpi-leads"
          title="Total Leads"
          kpi={kpis.totalLeads}
          valueType="number"
          icon={Users}
          subtitle={`${formatPercent(kpis.conversionRate.current)} conversion`}
          onClick={() => navigateTo("leads")}
        />
        <KPICard
          id="kpi-deals-won"
          title="Deals Won"
          kpi={kpis.wonDeals}
          valueType="number"
          icon={Target}
          iconColor="#15803d"
          iconBg="#f0fdf4"
          subtitle={`${formatPercent(kpis.dealWinRate.current)} win rate`}
          onClick={() => navigateTo("deals")}
        />
        <KPICard
          id="kpi-quotations"
          title="Quotations"
          kpi={kpis.totalQuotations}
          valueType="number"
          icon={FileText}
          iconColor="#7c3aed"
          iconBg="#f5f3ff"
          subtitle={`${formatPercent(kpis.quoteToDealRate.current)} → deal`}
          onClick={() => navigateTo("quotations")}
        />
        <KPICard
          id="kpi-orders"
          title="Orders"
          kpi={kpis.totalOrders}
          valueType="number"
          icon={ShoppingCart}
          iconColor="#d97706"
          iconBg="#fffbeb"
          subtitle={`${orderStatus["Completed"] ?? 0} completed`}
          onClick={() => navigateTo("orders")}
        />
        <KPICard
          id="kpi-pipeline"
          title="Active Pipeline"
          kpi={{ current: activeDeals.length, previous: 0, change: 0, changePercent: 0, isPositive: true }}
          valueType="number"
          icon={TrendingUp}
          iconColor="#0891b2"
          iconBg="#ecfeff"
          subtitle={`${wonDeals.length} won this period`}
          onClick={() => navigateTo("deals")}
        />
      </div>

      {/* Charts row */}
      <div className="chart-grid-2-1">
        {/* Revenue time series */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
              Revenue Trend ({daysDuration <= 31 ? "Daily" : "Monthly"})
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
              Collected payments matching active filters
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revSeries} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#revGradient)" dot={false} activeDot={{ r: 4, fill: "#2563eb" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead source pie */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Lead Sources</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>By channel ({leads.length} total)</p>
          </div>
          {sourceData.length === 0 ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.8125rem" }}>
              No leads in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="source"
                  paddingAngle={2}
                >
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown, name: unknown) => [v as number, String(name)]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom charts */}
      <div className="chart-grid-2">
        {/* Deals by category */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Deal Value by Service</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>Total value per category</p>
          </div>
          {dealCats.length === 0 ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.8125rem" }}>
              No deals in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dealCats.slice(0, 6)} margin={{ top: 5, right: 5, left: 0, bottom: 40 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Value"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {dealCats.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Order Status Summary</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>{orders.length} orders in period</p>
          </div>
          {orders.length === 0 ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.8125rem" }}>
              No orders in this period
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}>
              {[
                { key: "Completed",   color: "#16a34a" },
                { key: "In Progress", color: "#2563eb" },
                { key: "Pending",     color: "#d97706" },
                { key: "On Hold",     color: "#9ca3af" },
                { key: "Cancelled",   color: "#dc2626" },
              ].map(({ key, color }) => {
                const count = orderStatus[key as keyof typeof orderStatus] ?? 0;
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.8125rem", color: "#374151" }}>{key}</span>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111827" }}>
                        {count} <span style={{ fontWeight: 400, color: "#9ca3af" }}>({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
