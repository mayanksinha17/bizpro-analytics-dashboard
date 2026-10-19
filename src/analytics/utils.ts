/**
 * Pure analytics utility functions.
 * All functions are deterministic and work on the same DashboardData.
 * Phase 2: extended with filterInvoices, filterPayments with employee/dept,
 *          Today/7d/30d/custom presets, and full previous-period coverage.
 */
import {
  startOfMonth, endOfMonth, startOfDay, endOfDay, startOfYear,
  parseISO, isWithinInterval, subMonths, subDays, format,
  eachMonthOfInterval, eachDayOfInterval,
} from "date-fns";
import type {
  DashboardData, DateRange, FilterState,
  Lead, Quotation, Deal, Order, Invoice, Payment, Employee, Priority,
  ServiceCategory, Department, KPIComparison,
  CategoryBreakdown, TimeSeriesPoint, TeamPerformance,
  LeadStatus, QuotationStatus, DealStatus, OrderStatus, InvoiceStatus,
} from "../types";

// ── Date helpers ──────────────────────────────────────────────────────────────
export function inRange(dateStr: string, range: DateRange): boolean {
  if (!dateStr) return false;
  try {
    const d = parseISO(dateStr);
    return isWithinInterval(d, {
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    });
  } catch {
    return false;
  }
}

/** Mirror the current period backward by exactly its own duration. */
export function previousPeriod(range: DateRange): DateRange {
  const len = range.end.getTime() - range.start.getTime();
  return {
    start: new Date(range.start.getTime() - len - 1),
    end: new Date(range.start.getTime() - 1),
  };
}

export function safeDiv(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/** Never produces NaN or Infinity. */
export function compareKPI(
  current: number,
  previous: number,
  higherIsBetter = true,
): KPIComparison {
  const change = current - previous;
  const changePercent =
    previous === 0
      ? current === 0
        ? 0
        : 100
      : (change / Math.abs(previous)) * 100;
  return {
    current,
    previous,
    change,
    changePercent: isFinite(changePercent) ? changePercent : 0,
    isPositive: higherIsBetter ? change >= 0 : change <= 0,
  };
}

// ── TODAY (application "now") ─────────────────────────────────────────────────
const APP_NOW = new Date("2026-10-19");

// ── Built-in date range presets ────────────────────────────────────────────────
export type DatePreset = "today" | "last7" | "last30" | "thisMonth" | "last3M" | "last6M" | "thisYear" | "last12M" | "custom";

export interface DatePresetOption {
  id: DatePreset;
  label: string;
  getRange: () => DateRange;
}

export const DATE_PRESETS: DatePresetOption[] = [
  {
    id: "today",
    label: "Today",
    getRange: () => ({ start: startOfDay(APP_NOW), end: endOfDay(APP_NOW) }),
  },
  {
    id: "last7",
    label: "Last 7 Days",
    getRange: () => ({
      start: startOfDay(subDays(APP_NOW, 6)),
      end: endOfDay(APP_NOW),
    }),
  },
  {
    id: "last30",
    label: "Last 30 Days",
    getRange: () => ({
      start: startOfDay(subDays(APP_NOW, 29)),
      end: endOfDay(APP_NOW),
    }),
  },
  {
    id: "thisMonth",
    label: "This Month",
    getRange: () => ({ start: startOfMonth(APP_NOW), end: endOfMonth(APP_NOW) }),
  },
  {
    id: "last3M",
    label: "Last 3M",
    getRange: () => ({
      start: startOfMonth(subMonths(APP_NOW, 2)),
      end: endOfMonth(APP_NOW),
    }),
  },
  {
    id: "last6M",
    label: "Last 6M",
    getRange: () => ({
      start: startOfMonth(subMonths(APP_NOW, 5)),
      end: endOfMonth(APP_NOW),
    }),
  },
  {
    id: "thisYear",
    label: "This Year",
    getRange: () => ({ start: startOfYear(APP_NOW), end: endOfMonth(APP_NOW) }),
  },
  {
    id: "last12M",
    label: "Last 12M",
    getRange: () => ({
      start: startOfMonth(subMonths(APP_NOW, 11)),
      end: endOfMonth(APP_NOW),
    }),
  },
];

/** Match a DateRange to a preset id, or return "custom". */
export function detectPreset(range: DateRange): DatePreset {
  for (const p of DATE_PRESETS) {
    const pr = p.getRange();
    if (
      pr.start.toISOString().slice(0, 10) === range.start.toISOString().slice(0, 10) &&
      pr.end.toISOString().slice(0, 10) === range.end.toISOString().slice(0, 10)
    ) {
      return p.id;
    }
  }
  return "custom";
}

// ── Employee lookup helper ────────────────────────────────────────────────────
function empDept(data: DashboardData, empId: string): Department | undefined {
  return data.employees.find(e => e.id === empId)?.department;
}

// ── Filters ───────────────────────────────────────────────────────────────────

export function filterLeads(data: DashboardData, filter: Partial<FilterState>): Lead[] {
  return data.leads.filter(lead => {
    if (filter.dateRange && !inRange(lead.createdAt, filter.dateRange)) return false;
    if (filter.employeeId && lead.assignedTo !== filter.employeeId) return false;
    if (filter.department && empDept(data, lead.assignedTo) !== filter.department) return false;
    if (filter.category && lead.category !== filter.category) return false;
    return true;
  });
}

export function filterQuotations(data: DashboardData, filter: Partial<FilterState>): Quotation[] {
  return data.quotations.filter(q => {
    if (filter.dateRange && !inRange(q.createdAt, filter.dateRange)) return false;
    if (filter.employeeId && q.assignedTo !== filter.employeeId) return false;
    if (filter.department && empDept(data, q.assignedTo) !== filter.department) return false;
    if (filter.category && q.category !== filter.category) return false;
    return true;
  });
}

export function filterDeals(data: DashboardData, filter: Partial<FilterState>): Deal[] {
  return data.deals.filter(d => {
    if (filter.dateRange && !inRange(d.createdAt, filter.dateRange)) return false;
    if (filter.employeeId && d.assignedTo !== filter.employeeId) return false;
    if (filter.department && empDept(data, d.assignedTo) !== filter.department) return false;
    if (filter.category && d.category !== filter.category) return false;
    return true;
  });
}

export function filterOrders(data: DashboardData, filter: Partial<FilterState>): Order[] {
  return data.orders.filter(o => {
    if (filter.dateRange && !inRange(o.createdAt, filter.dateRange)) return false;
    if (filter.category && o.category !== filter.category) return false;
    // Orders assigned to operations staff; filter by dept/employee via linked deal
    if (filter.employeeId) {
      const deal = data.deals.find(d => d.id === o.dealId);
      if (!deal || deal.assignedTo !== filter.employeeId) return false;
    }
    if (filter.department) {
      const deal = data.deals.find(d => d.id === o.dealId);
      if (!deal) return false;
      const dept = empDept(data, deal.assignedTo);
      if (dept !== filter.department) return false;
    }
    return true;
  });
}

/** Invoices filtered by date (issuedAt), category, and linked deal employee/dept. */
export function filterInvoices(data: DashboardData, filter: Partial<FilterState>): Invoice[] {
  return data.invoices.filter(inv => {
    if (filter.dateRange && !inRange(inv.issuedAt, filter.dateRange)) return false;
    if (filter.category && inv.category !== filter.category) return false;
    if (filter.employeeId) {
      const deal = data.deals.find(d => d.id === inv.dealId);
      if (!deal || deal.assignedTo !== filter.employeeId) return false;
    }
    if (filter.department) {
      const deal = data.deals.find(d => d.id === inv.dealId);
      if (!deal) return false;
      const dept = empDept(data, deal.assignedTo);
      if (dept !== filter.department) return false;
    }
    return true;
  });
}

/**
 * Filter payments by paidAt date + category + employee (via linked deal).
 * This is the authoritative payment filter — all revenue calcs must use it.
 */
export function filterPayments(data: DashboardData, filter: Partial<FilterState>): Payment[] {
  return data.payments.filter(p => {
    if (filter.dateRange && !inRange(p.paidAt, filter.dateRange)) return false;
    if (filter.category) {
      const inv = data.invoices.find(i => i.id === p.invoiceId);
      if (!inv || inv.category !== filter.category) return false;
    }
    if (filter.employeeId) {
      const deal = data.deals.find(d => d.id === p.dealId);
      if (!deal || deal.assignedTo !== filter.employeeId) return false;
    }
    if (filter.department) {
      const deal = data.deals.find(d => d.id === p.dealId);
      if (!deal) return false;
      const dept = empDept(data, deal.assignedTo);
      if (dept !== filter.department) return false;
    }
    return true;
  });
}

// ── Lead analytics ────────────────────────────────────────────────────────────
export function leadCountByStatus(leads: Lead[]): Record<LeadStatus, number> {
  const result: Record<string, number> = {};
  for (const l of leads) {
    result[l.status] = (result[l.status] ?? 0) + 1;
  }
  return result as Record<LeadStatus, number>;
}

export function leadConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const won = leads.filter(l => l.status === "Won").length;
  return safeDiv(won, leads.length) * 100;
}

export function leadsBySource(leads: Lead[]): { source: string; count: number; percentage: number }[] {
  const map: Record<string, number> = {};
  for (const l of leads) {
    map[l.source] = (map[l.source] ?? 0) + 1;
  }
  const total = leads.length;
  return Object.entries(map).map(([source, count]) => ({
    source,
    count,
    percentage: safeDiv(count, total) * 100,
  })).sort((a, b) => b.count - a.count);
}

export interface LeadTrendPoint {
  date: string;
  label: string;
  total: number;
  qualified: number;
  converted: number;
}

export function leadsTrendSeries(leads: Lead[], range: DateRange): LeadTrendPoint[] {
  const daysDiff = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)));
  if (daysDiff <= 31) {
    const days = eachDayOfInterval({
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    });
    return days.map(day => {
      const dayRange = { start: startOfDay(day), end: endOfDay(day) };
      const inDay = leads.filter(l => inRange(l.createdAt, dayRange));
      return {
        date: format(day, "yyyy-MM-dd"),
        label: format(day, "dd MMM"),
        total: inDay.length,
        qualified: inDay.filter(l => ["Qualified", "Proposal Sent", "Negotiation", "Won"].includes(l.status)).length,
        converted: inDay.filter(l => l.status === "Won").length,
      };
    });
  }

  const months = eachMonthOfInterval({
    start: startOfMonth(range.start),
    end: endOfMonth(range.end),
  });
  return months.map(month => {
    const monthRange = { start: startOfMonth(month), end: endOfMonth(month) };
    const inMonth = leads.filter(l => inRange(l.createdAt, monthRange));
    return {
      date: format(month, "yyyy-MM"),
      label: format(month, "MMM yy"),
      total: inMonth.length,
      qualified: inMonth.filter(l => ["Qualified", "Proposal Sent", "Negotiation", "Won"].includes(l.status)).length,
      converted: inMonth.filter(l => l.status === "Won").length,
    };
  });
}

export function leadFunnelMetrics(leads: Lead[]) {
  const total = leads.length;
  const qualified = leads.filter(l => ["Qualified", "Proposal Sent", "Negotiation", "Won"].includes(l.status)).length;
  const converted = leads.filter(l => l.status === "Won").length;
  const unqualified = leads.filter(l => l.status === "Unqualified").length;
  const lost = leads.filter(l => l.status === "Lost").length;
  return {
    total,
    qualified,
    converted,
    unqualified,
    lost,
    conversionRate: safeDiv(converted, total) * 100,
  };
}

// ── Quotation analytics ───────────────────────────────────────────────────────
export function quotationsByCategory(quotations: Quotation[]): CategoryBreakdown[] {
  const map: Record<string, { count: number; value: number }> = {};
  for (const q of quotations) {
    if (!map[q.category]) map[q.category] = { count: 0, value: 0 };
    map[q.category].count++;
    map[q.category].value += q.totalAmount;
  }
  const total = quotations.length;
  return Object.entries(map).map(([cat, { count, value }]) => ({
    category: cat as ServiceCategory,
    count,
    value,
    percentage: safeDiv(count, total) * 100,
  })).sort((a, b) => b.value - a.value);
}

export function quotationsByStatus(quotations: Quotation[]): Record<QuotationStatus, number> {
  const result: Record<string, number> = {};
  for (const q of quotations) {
    result[q.status] = (result[q.status] ?? 0) + 1;
  }
  return result as Record<QuotationStatus, number>;
}

export function quoteToDealConversionRate(quotations: Quotation[]): number {
  if (quotations.length === 0) return 0;
  const accepted = quotations.filter(q => q.status === "Accepted").length;
  return safeDiv(accepted, quotations.length) * 100;
}

export function totalQuotationValue(quotations: Quotation[]): number {
  return quotations.reduce((sum, q) => sum + q.totalAmount, 0);
}

export interface QuotationServiceDetail {
  category: ServiceCategory;
  count: number;
  totalAmount: number;
  acceptedCount: number;
  pendingCount: number;
  rejectedCount: number;
  conversionRate: number;
}

export function quotationServiceDetails(quotations: Quotation[]): QuotationServiceDetail[] {
  const map: Record<string, { count: number; totalAmount: number; acceptedCount: number; pendingCount: number; rejectedCount: number }> = {};
  for (const q of quotations) {
    if (!map[q.category]) {
      map[q.category] = { count: 0, totalAmount: 0, acceptedCount: 0, pendingCount: 0, rejectedCount: 0 };
    }
    const item = map[q.category];
    item.count += 1;
    item.totalAmount += q.totalAmount;
    if (q.status === "Accepted") {
      item.acceptedCount += 1;
    } else if (q.status === "Rejected" || q.status === "Expired") {
      item.rejectedCount += 1;
    } else {
      item.pendingCount += 1;
    }
  }

  return Object.entries(map).map(([category, stats]) => ({
    category: category as ServiceCategory,
    ...stats,
    conversionRate: safeDiv(stats.acceptedCount, stats.count) * 100,
  })).sort((a, b) => b.totalAmount - a.totalAmount);
}

// ── Deal analytics ────────────────────────────────────────────────────────────
export function dealsByCategory(deals: Deal[]): CategoryBreakdown[] {
  const map: Record<string, { count: number; value: number }> = {};
  for (const d of deals) {
    if (!map[d.category]) map[d.category] = { count: 0, value: 0 };
    map[d.category].count++;
    map[d.category].value += d.value;
  }
  const total = deals.length;
  return Object.entries(map).map(([cat, { count, value }]) => ({
    category: cat as ServiceCategory,
    count,
    value,
    percentage: safeDiv(count, total) * 100,
  })).sort((a, b) => b.value - a.value);
}

export function dealsByStatus(deals: Deal[]): Record<DealStatus, number> {
  const result: Record<string, number> = {};
  for (const d of deals) {
    result[d.status] = (result[d.status] ?? 0) + 1;
  }
  return result as Record<DealStatus, number>;
}

export function totalDealValue(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.value, 0);
}

export function wonDealValue(deals: Deal[]): number {
  return deals.filter(d => d.status === "Won").reduce((sum, d) => sum + d.value, 0);
}

export function dealWinRate(deals: Deal[]): number {
  const closed = deals.filter(d => ["Won", "Lost", "Cancelled"].includes(d.status));
  if (closed.length === 0) return 0;
  const won = closed.filter(d => d.status === "Won").length;
  return safeDiv(won, closed.length) * 100;
}

export function dealsPriorityBreakdown(deals: Deal[], leads: Lead[]): { priority: Priority; count: number; value: number; percentage: number }[] {
  const leadMap = new Map(leads.map(l => [l.id, l]));
  const map: Record<Priority, { count: number; value: number }> = {
    "High": { count: 0, value: 0 },
    "Medium": { count: 0, value: 0 },
    "Low": { count: 0, value: 0 },
  };
  for (const d of deals) {
    const prio: Priority = d.priority ?? leadMap.get(d.leadId)?.priority ?? "Medium";
    if (map[prio]) {
      map[prio].count++;
      map[prio].value += d.value;
    }
  }
  const total = deals.length;
  return (["High", "Medium", "Low"] as Priority[]).map(priority => ({
    priority,
    count: map[priority].count,
    value: map[priority].value,
    percentage: safeDiv(map[priority].count, total) * 100,
  }));
}

export interface DealRevenueTrendPoint {
  date: string;
  label: string;
  dealValue: number;
  collectedRevenue: number;
}

export function dealRevenueTrendSeries(deals: Deal[], payments: Payment[], range: DateRange): DealRevenueTrendPoint[] {
  const daysDiff = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)));
  if (daysDiff <= 31) {
    const days = eachDayOfInterval({
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    });
    return days.map(day => {
      const dayRange = { start: startOfDay(day), end: endOfDay(day) };
      const dVal = deals
        .filter(d => inRange(d.createdAt, dayRange))
        .reduce((sum, d) => sum + d.value, 0);
      const cRev = payments
        .filter(p => p.status === "Completed" && inRange(p.paidAt, dayRange))
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        date: format(day, "yyyy-MM-dd"),
        label: format(day, "dd MMM"),
        dealValue: dVal,
        collectedRevenue: cRev,
      };
    });
  }

  const months = eachMonthOfInterval({
    start: startOfMonth(range.start),
    end: endOfMonth(range.end),
  });
  return months.map(month => {
    const monthRange = { start: startOfMonth(month), end: endOfMonth(month) };
    const dVal = deals
      .filter(d => inRange(d.createdAt, monthRange))
      .reduce((sum, d) => sum + d.value, 0);
    const cRev = payments
      .filter(p => p.status === "Completed" && inRange(p.paidAt, monthRange))
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      date: format(month, "yyyy-MM"),
      label: format(month, "MMM yy"),
      dealValue: dVal,
      collectedRevenue: cRev,
    };
  });
}

// ── Revenue / Payment analytics ───────────────────────────────────────────────

/** Only status=Completed payments count as collected revenue. */
export function collectedRevenue(payments: Payment[]): number {
  return payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
}

/** Outstanding = unpaid balance on Issued / Partially Paid / Overdue invoices. */
export function outstandingBalance(invoices: Invoice[]): number {
  return invoices
    .filter(i => ["Issued", "Partially Paid", "Overdue"].includes(i.status))
    .reduce((sum, i) => sum + Math.max(0, i.outstandingAmount), 0);
}

/** Overdue = subset of outstanding where status === "Overdue". */
export function overdueAmount(invoices: Invoice[]): number {
  return invoices
    .filter(i => i.status === "Overdue")
    .reduce((sum, i) => sum + Math.max(0, i.outstandingAmount), 0);
}

// ── Time series ───────────────────────────────────────────────────────────────

/**
 * Build a monthly revenue time series for the selected payments.
 * The window is always the last `months` calendar months ending today.
 */
export function revenueTimeSeries(payments: Payment[], months = 12): TimeSeriesPoint[] {
  const today = APP_NOW;
  const startDate = subMonths(startOfMonth(today), months - 1);
  const endDate = endOfMonth(today);
  const monthList = eachMonthOfInterval({ start: startDate, end: endDate });

  return monthList.map(monthStart => {
    const monthEnd = endOfMonth(monthStart);
    const label = format(monthStart, "MMM yy");
    const value = payments
      .filter(
        p =>
          p.status === "Completed" &&
          inRange(p.paidAt, { start: monthStart, end: monthEnd }),
      )
      .reduce((sum, p) => sum + p.amount, 0);
    return { date: format(monthStart, "yyyy-MM"), value, label };
  });
}

/**
 * Daily revenue series for short date ranges (Today, Last 7 days, Last 30 days).
 * Returns one point per day in the range.
 */
export function revenueDailySeries(payments: Payment[], range: DateRange): TimeSeriesPoint[] {
  const days = eachDayOfInterval({
    start: startOfDay(range.start),
    end: endOfDay(range.end),
  });
  return days.map(day => {
    const label = format(day, "dd MMM");
    const value = payments
      .filter(
        p =>
          p.status === "Completed" &&
          inRange(p.paidAt, { start: startOfDay(day), end: endOfDay(day) }),
      )
      .reduce((sum, p) => sum + p.amount, 0);
    return { date: format(day, "yyyy-MM-dd"), value, label };
  });
}

export function ordersTimeSeries(orders: Order[], months = 12): TimeSeriesPoint[] {
  const today = APP_NOW;
  const startDate = subMonths(startOfMonth(today), months - 1);
  const endDate = endOfMonth(today);
  const monthList = eachMonthOfInterval({ start: startDate, end: endDate });

  return monthList.map(monthStart => {
    const monthEnd = endOfMonth(monthStart);
    const label = format(monthStart, "MMM yy");
    const value = orders.filter(o =>
      inRange(o.createdAt, { start: monthStart, end: monthEnd }),
    ).length;
    return { date: format(monthStart, "yyyy-MM"), value, label };
  });
}

// ── Order analytics ───────────────────────────────────────────────────────────
export function ordersByStatus(orders: Order[]): Record<OrderStatus, number> {
  const result: Record<string, number> = {};
  for (const o of orders) {
    result[o.status] = (result[o.status] ?? 0) + 1;
  }
  return result as Record<OrderStatus, number>;
}

export function ordersByCategory(orders: Order[]): CategoryBreakdown[] {
  const map: Record<string, { count: number; value: number }> = {};
  for (const o of orders) {
    if (!map[o.category]) map[o.category] = { count: 0, value: 0 };
    map[o.category].count++;
    map[o.category].value += o.value;
  }
  const total = orders.length;
  return Object.entries(map).map(([cat, { count, value }]) => ({
    category: cat as ServiceCategory,
    count,
    value,
    percentage: safeDiv(count, total) * 100,
  })).sort((a, b) => b.count - a.count);
}

export interface OrderCompletionTrendPoint {
  date: string;
  label: string;
  created: number;
  completed: number;
}

export function orderCompletionTrendSeries(orders: Order[], range: DateRange): OrderCompletionTrendPoint[] {
  const daysDiff = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)));
  if (daysDiff <= 31) {
    const days = eachDayOfInterval({
      start: startOfDay(range.start),
      end: endOfDay(range.end),
    });
    return days.map(day => {
      const dayRange = { start: startOfDay(day), end: endOfDay(day) };
      const created = orders.filter(o => inRange(o.createdAt, dayRange)).length;
      const completed = orders.filter(o => o.status === "Completed" && o.completedAt && inRange(o.completedAt, dayRange)).length;
      return {
        date: format(day, "yyyy-MM-dd"),
        label: format(day, "dd MMM"),
        created,
        completed,
      };
    });
  }

  const months = eachMonthOfInterval({
    start: startOfMonth(range.start),
    end: endOfMonth(range.end),
  });
  return months.map(month => {
    const monthRange = { start: startOfMonth(month), end: endOfMonth(month) };
    const created = orders.filter(o => inRange(o.createdAt, monthRange)).length;
    const completed = orders.filter(o => o.status === "Completed" && o.completedAt && inRange(o.completedAt, monthRange)).length;
    return {
      date: format(month, "yyyy-MM"),
      label: format(month, "MMM yy"),
      created,
      completed,
    };
  });
}

export function orderProgressDistribution(orders: Order[]): { stage: string; count: number; percentage: number; color: string }[] {
  const buckets = [
    { stage: "100% Completed", filter: (o: Order) => o.status === "Completed", color: "#16a34a" },
    { stage: "70-99% Delivery Stage", filter: (o: Order) => o.status === "In Progress" && (o.progress ?? 50) >= 70, color: "#2563eb" },
    { stage: "40-69% Processing", filter: (o: Order) => o.status === "In Progress" && (o.progress ?? 50) < 70, color: "#0891b2" },
    { stage: "1-39% Initiated / Pending", filter: (o: Order) => o.status === "Pending", color: "#f59e0b" },
    { stage: "0% Paused / Cancelled", filter: (o: Order) => o.status === "On Hold" || o.status === "Cancelled", color: "#64748b" },
  ];
  const total = orders.length;
  return buckets.map(b => {
    const count = orders.filter(b.filter).length;
    return {
      stage: b.stage,
      count,
      percentage: safeDiv(count, total) * 100,
      color: b.color,
    };
  });
}

export interface OperationsRepWorkload {
  employee: Employee;
  assignedOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  pendingOrders: number;
  totalValue: number;
  completionRate: number;
}

export function operationsTeamWorkload(orders: Order[], employees: Employee[]): OperationsRepWorkload[] {
  const opsEmployees = employees.filter(e => e.department === "Operations");
  return opsEmployees.map(emp => {
    const empOrders = orders.filter(o => o.assignedTo === emp.id);
    const completed = empOrders.filter(o => o.status === "Completed").length;
    const inProgress = empOrders.filter(o => o.status === "In Progress").length;
    const pending = empOrders.filter(o => o.status === "Pending").length;
    const totalValue = empOrders.reduce((sum, o) => sum + o.value, 0);
    return {
      employee: emp,
      assignedOrders: empOrders.length,
      completedOrders: completed,
      inProgressOrders: inProgress,
      pendingOrders: pending,
      totalValue,
      completionRate: safeDiv(completed, empOrders.length) * 100,
    };
  }).sort((a, b) => b.assignedOrders - a.assignedOrders);
}

// ── Invoice analytics ─────────────────────────────────────────────────────────
export function invoicesByStatus(invoices: Invoice[]): Record<InvoiceStatus, number> {
  const result: Record<string, number> = {};
  for (const i of invoices) {
    result[i.status] = (result[i.status] ?? 0) + 1;
  }
  return result as Record<InvoiceStatus, number>;
}

// ── Team performance ──────────────────────────────────────────────────────────
export function teamPerformance(data: DashboardData, filter: Partial<FilterState>): TeamPerformance[] {
  return data.employees
    .filter(e => e.department === "Sales" || e.department === "Management")
    .map(emp => {
      const empFilter = { ...filter, employeeId: emp.id };
      const leads = filterLeads(data, empFilter);
      const deals = filterDeals(data, empFilter);
      const wonDeals = deals.filter(d => d.status === "Won");

      const wonDealIds = new Set(wonDeals.map(d => d.id));
      const payments = filterPayments(data, filter).filter(
        p => p.status === "Completed" && wonDealIds.has(p.dealId),
      );
      const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

      let target = emp.targetRevenue;
      if (filter.dateRange) {
        const months = Math.max(
          1,
          Math.round(
            (filter.dateRange.end.getTime() - filter.dateRange.start.getTime()) /
              (30 * 24 * 60 * 60 * 1000),
          ),
        );
        target = emp.targetRevenue * months;
      }

      return {
        employee: emp,
        leadsAssigned: leads.length,
        dealsWon: wonDeals.length,
        dealsLost: deals.filter(d => d.status === "Lost").length,
        revenue,
        target,
        achievementPercent: safeDiv(revenue, target) * 100,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

// ── KPI aggregation ───────────────────────────────────────────────────────────
export function buildKPIs(data: DashboardData, filter: Partial<FilterState>) {
  const prev = filter.dateRange
    ? { ...filter, dateRange: previousPeriod(filter.dateRange) }
    : filter;

  const currLeads    = filterLeads(data, filter);
  const prevLeads    = filterLeads(data, prev);
  const currDeals    = filterDeals(data, filter);
  const prevDeals    = filterDeals(data, prev);
  const currPayments = filterPayments(data, filter);
  const prevPayments = filterPayments(data, prev);
  const currInvoices = filterInvoices(data, filter);
  const prevInvoices = filterInvoices(data, prev);
  const currOrders   = filterOrders(data, filter);
  const prevOrders   = filterOrders(data, prev);
  const currQuotes   = filterQuotations(data, filter);
  const prevQuotes   = filterQuotations(data, prev);

  const currRevenue     = collectedRevenue(currPayments);
  const prevRevenue     = collectedRevenue(prevPayments);
  const currOutstanding = outstandingBalance(currInvoices);
  const prevOutstanding = outstandingBalance(prevInvoices);
  const currOverdue     = overdueAmount(currInvoices);
  const prevOverdue     = overdueAmount(prevInvoices);

  return {
    totalLeads:       compareKPI(currLeads.length, prevLeads.length),
    qualifiedLeads:   compareKPI(
      currLeads.filter(l => ["Qualified", "Proposal Sent", "Negotiation", "Won"].includes(l.status)).length,
      prevLeads.filter(l => ["Qualified", "Proposal Sent", "Negotiation", "Won"].includes(l.status)).length,
    ),
    convertedLeads:   compareKPI(
      currLeads.filter(l => l.status === "Won").length,
      prevLeads.filter(l => l.status === "Won").length,
    ),
    unqualifiedLeads: compareKPI(
      currLeads.filter(l => l.status === "Unqualified").length,
      prevLeads.filter(l => l.status === "Unqualified").length,
      false,
    ),
    conversionRate:   compareKPI(leadConversionRate(currLeads), leadConversionRate(prevLeads)),
    totalRevenue:     compareKPI(currRevenue, prevRevenue),
    outstandingBalance: compareKPI(currOutstanding, prevOutstanding, false),
    overdueAmount:    compareKPI(currOverdue, prevOverdue, false),
    totalDeals:       compareKPI(currDeals.length, prevDeals.length),
    wonDeals:         compareKPI(
      currDeals.filter(d => d.status === "Won").length,
      prevDeals.filter(d => d.status === "Won").length,
    ),
    activeDeals:      compareKPI(
      currDeals.filter(d => d.status === "Active").length,
      prevDeals.filter(d => d.status === "Active").length,
    ),
    lostDeals:        compareKPI(
      currDeals.filter(d => d.status === "Lost").length,
      prevDeals.filter(d => d.status === "Lost").length,
      false,
    ),
    totalDealValue:   compareKPI(totalDealValue(currDeals), totalDealValue(prevDeals)),
    wonRevenue:       compareKPI(wonDealValue(currDeals), wonDealValue(prevDeals)),
    outstandingRevenue: compareKPI(currOutstanding, prevOutstanding, false),
    dealWinRate:      compareKPI(dealWinRate(currDeals), dealWinRate(prevDeals)),
    totalOrders:      compareKPI(currOrders.length, prevOrders.length),
    completedOrders:  compareKPI(
      currOrders.filter(o => o.status === "Completed").length,
      prevOrders.filter(o => o.status === "Completed").length,
    ),
    inProgressOrders: compareKPI(
      currOrders.filter(o => o.status === "In Progress").length,
      prevOrders.filter(o => o.status === "In Progress").length,
    ),
    pendingOrders:    compareKPI(
      currOrders.filter(o => o.status === "Pending").length,
      prevOrders.filter(o => o.status === "Pending").length,
    ),
    onHoldOrders:     compareKPI(
      currOrders.filter(o => o.status === "On Hold").length,
      prevOrders.filter(o => o.status === "On Hold").length,
      false,
    ),
    overdueOrders:    compareKPI(
      currOrders.filter(o => o.status !== "Completed" && o.status !== "Cancelled" && new Date(o.dueDate) < new Date("2026-10-19")).length,
      prevOrders.filter(o => o.status !== "Completed" && o.status !== "Cancelled" && new Date(o.dueDate) < new Date("2026-10-19")).length,
      false,
    ),
    totalQuotations:  compareKPI(currQuotes.length, prevQuotes.length),
    totalQuotedValue: compareKPI(totalQuotationValue(currQuotes), totalQuotationValue(prevQuotes)),
    acceptedQuotations: compareKPI(
      currQuotes.filter(q => q.status === "Accepted").length,
      prevQuotes.filter(q => q.status === "Accepted").length,
    ),
    pendingQuotations: compareKPI(
      currQuotes.filter(q => ["Sent", "Viewed", "Draft"].includes(q.status)).length,
      prevQuotes.filter(q => ["Sent", "Viewed", "Draft"].includes(q.status)).length,
    ),
    rejectedQuotations: compareKPI(
      currQuotes.filter(q => ["Rejected", "Expired"].includes(q.status)).length,
      prevQuotes.filter(q => ["Rejected", "Expired"].includes(q.status)).length,
      false,
    ),
    quoteToDealRate:  compareKPI(
      quoteToDealConversionRate(currQuotes),
      quoteToDealConversionRate(prevQuotes),
    ),
    completedPayments: compareKPI(
      currPayments.filter(p => p.status === "Completed").length,
      prevPayments.filter(p => p.status === "Completed").length,
    ),
    failedPayments: compareKPI(
      currPayments.filter(p => p.status === "Failed").length,
      prevPayments.filter(p => p.status === "Failed").length,
      false, // fewer failed = better
    ),
  };
}

// ── Default date range ────────────────────────────────────────────────────────
export function defaultDateRange(): DateRange {
  return DATE_PRESETS.find(p => p.id === "last12M")!.getRange();
}

export function currentMonthRange(): DateRange {
  return DATE_PRESETS.find(p => p.id === "thisMonth")!.getRange();
}
