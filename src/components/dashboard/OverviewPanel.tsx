import React, { useMemo } from "react";
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
import { generateSmartInsights } from "../../analytics/insights";
import SmartInsightCard from "../shared/SmartInsightCard";
import KPICard from "../shared/KPICard";
import EmptyState from "../shared/EmptyState";
import CustomChartTooltip from "../shared/ChartTooltip";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "../../utils/format";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#22c55e", "#a855f7"];
const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function OverviewPanel() {
  const { data, filter, navigateTo } = useDashboard();

  const leads = useMemo(() => filterLeads(data, filter), [data, filter]);
  const deals = useMemo(() => filterDeals(data, filter), [data, filter]);
  const quotations = useMemo(() => filterQuotations(data, filter), [data, filter]);
  const payments = useMemo(() => filterPayments(data, filter), [data, filter]);
  const orders = useMemo(() => filterOrders(data, filter), [data, filter]);
  const invoices = useMemo(() => filterInvoices(data, filter), [data, filter]);
  const kpis = useMemo(() => buildKPIs(data, filter), [data, filter]);

  // Compute Smart Insights
  const smartInsights = useMemo(() => generateSmartInsights(data, filter), [data, filter]);

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
    <div className="flex flex-col gap-5">
      {/* Smart Analytics / AI-Inspired Insights Banner */}
      <SmartInsightCard insights={smartInsights} />

      {/* KPI Row - Clickable to navigate to corresponding module */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KPICard
          id="kpi-revenue"
          title="Collected Revenue"
          kpi={kpis.totalRevenue}
          valueType="currency"
          icon={DollarSign}
          iconColor="#10b981"
          subtitle={`${formatCurrency(outstanding)} outstanding`}
          onClick={() => navigateTo("payments")}
        />
        <KPICard
          id="kpi-leads"
          title="Total Leads"
          kpi={kpis.totalLeads}
          valueType="number"
          icon={Users}
          iconColor="#3b82f6"
          subtitle={`${formatPercent(kpis.conversionRate.current)} conversion`}
          onClick={() => navigateTo("leads")}
        />
        <KPICard
          id="kpi-deals-won"
          title="Deals Won"
          kpi={kpis.wonDeals}
          valueType="number"
          icon={Target}
          iconColor="#10b981"
          subtitle={`${formatPercent(kpis.dealWinRate.current)} win rate`}
          onClick={() => navigateTo("deals")}
        />
        <KPICard
          id="kpi-quotations"
          title="Quotations"
          kpi={kpis.totalQuotations}
          valueType="number"
          icon={FileText}
          iconColor="#8b5cf6"
          subtitle={`${formatPercent(kpis.quoteToDealRate.current)} → deal`}
          onClick={() => navigateTo("quotations")}
        />
        <KPICard
          id="kpi-orders"
          title="Orders"
          kpi={kpis.totalOrders}
          valueType="number"
          icon={ShoppingCart}
          iconColor="#f59e0b"
          subtitle={`${orderStatus["Completed"] ?? 0} completed`}
          onClick={() => navigateTo("orders")}
        />
        <KPICard
          id="kpi-pipeline"
          title="Active Pipeline"
          kpi={{ current: activeDeals.length, previous: 0, change: 0, changePercent: 0, isPositive: true }}
          valueType="number"
          icon={TrendingUp}
          iconColor="#06b6d4"
          subtitle={`${wonDeals.length} won this period`}
          onClick={() => navigateTo("deals")}
        />
      </div>

      {/* Charts row 1: Revenue Series & Lead Sources */}
      <div className="chart-grid-2-1">
        {/* Revenue time series */}
        <div className="card p-5 bg-[#0f172a]/85 border border-white/[0.08] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white tracking-tight">
              Revenue Trend ({daysDuration <= 31 ? "Daily" : "Monthly"})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified collections ledger matching active filter parameters
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<CustomChartTooltip valueFormatter={(v) => formatCurrency(Number(v))} />} />
              <Area
                type="monotone"
                dataKey="value"
                name="Revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#revGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#60a5fa", stroke: "#1e3a8a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead source pie */}
        <div className="card p-5 bg-[#0f172a]/85 border border-white/[0.08] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white tracking-tight">Lead Sources</h2>
            <p className="text-xs text-slate-400 mt-0.5">By channel ({leads.length} total leads)</p>
          </div>
          {sourceData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-500 text-xs">
              No leads in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="source"
                  paddingAngle={3}
                  stroke="none"
                >
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2: Deal Categories & Order Status */}
      <div className="chart-grid-2">
        {/* Deals by category */}
        <div className="card p-5 bg-[#0f172a]/85 border border-white/[0.08] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white tracking-tight">Deal Value by Service Category</h2>
            <p className="text-xs text-slate-400 mt-0.5">Commercial value generated per service line</p>
          </div>
          {dealCats.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-500 text-xs">
              No deals in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dealCats.slice(0, 6)} margin={{ top: 5, right: 10, left: 0, bottom: 10 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
                <XAxis type="number" tickFormatter={v => formatCurrencyCompact(v)} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={135} />
                <Tooltip content={<CustomChartTooltip valueFormatter={(v) => formatCurrency(Number(v))} />} />
                <Bar dataKey="value" name="Deal Value" radius={[0, 6, 6, 0]} maxBarSize={16}>
                  {dealCats.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status */}
        <div className="card p-5 bg-[#0f172a]/85 border border-white/[0.08] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white tracking-tight">Order Fulfillment Throughput</h2>
            <p className="text-xs text-slate-400 mt-0.5">{orders.length} operational orders in scope</p>
          </div>
          {orders.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-500 text-xs">
              No orders in this period
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-1">
              {[
                { key: "Completed",   color: "#10b981", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
                { key: "In Progress", color: "#3b82f6", badge: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
                { key: "Pending",     color: "#f59e0b", badge: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
                { key: "On Hold",     color: "#94a3b8", badge: "bg-slate-500/15 text-slate-400 border-slate-500/25" },
                { key: "Cancelled",   color: "#ef4444", badge: "bg-rose-500/15 text-rose-400 border-rose-500/25" },
              ].map(({ key, color, badge }) => {
                const count = orderStatus[key as keyof typeof orderStatus] ?? 0;
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{count}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badge}`}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
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
