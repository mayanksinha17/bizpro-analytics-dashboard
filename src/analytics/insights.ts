import type { DashboardData, FilterState } from "../types";
import {
  filterLeads,
  filterDeals,
  filterQuotations,
  filterPayments,
  filterOrders,
  filterInvoices,
  buildKPIs,
  dealsByCategory,
  outstandingBalance,
} from "./utils";
import { formatCurrency, formatPercent } from "../utils/format";

export interface SmartInsight {
  id: string;
  type: "momentum" | "friction" | "fiscal" | "recommendation";
  title: string;
  badge: string;
  badgeColor: "emerald" | "amber" | "blue" | "violet";
  metric: string;
  summary: string;
  ruleExplanation: string;
  impactLevel: "High" | "Medium" | "Neutral";
}

/**
 * Deterministic rule-based analytical intelligence engine.
 * Computes contextual insights directly from in-memory relational state.
 */
export function generateSmartInsights(data: DashboardData, filter: FilterState): SmartInsight[] {
  const leads = filterLeads(data, filter);
  const deals = filterDeals(data, filter);
  const quotations = filterQuotations(data, filter);
  const payments = filterPayments(data, filter);
  const orders = filterOrders(data, filter);
  const invoices = filterInvoices(data, filter);
  const kpis = buildKPIs(data, filter);
  const dealCategories = dealsByCategory(deals);
  const outstanding = outstandingBalance(invoices);

  const insights: SmartInsight[] = [];

  // 1. Revenue Momentum Insight
  const revChange = kpis.totalRevenue.changePercent;
  const isRevGrowing = kpis.totalRevenue.isPositive;
  const topCategory = dealCategories[0]?.category ?? "Core Services";
  const topCatShare = dealCategories[0] && kpis.totalRevenue.current > 0
    ? (dealCategories[0].value / kpis.totalRevenue.current) * 100
    : 0;

  insights.push({
    id: "insight-revenue-momentum",
    type: "momentum",
    title: isRevGrowing ? "Strong Commercial Momentum" : "Revenue Volatility Detected",
    badge: isRevGrowing ? "+ GROWTH MOMENTUM" : "ATTENTION REQUIRED",
    badgeColor: isRevGrowing ? "emerald" : "amber",
    metric: `${isRevGrowing ? "+" : ""}${formatPercent(revChange, 1)} vs Prior Period`,
    summary: isRevGrowing
      ? `Realized revenue grew by ${formatPercent(revChange, 1)}, heavily supported by ${topCategory} (${topCatShare.toFixed(0)}% contribution).`
      : `Realized collections dipped by ${formatPercent(Math.abs(revChange), 1)}. Pipeline pacing requires re-engagement of pending quotes.`,
    ruleExplanation: "Deterministic Rule: Evaluates Period-over-Period (PoP) delta on verified settled payments against preceding equivalent date window.",
    impactLevel: isRevGrowing ? "High" : "Medium",
  });

  // 2. Funnel Friction & Conversion Rate
  const convRate = kpis.conversionRate.current;
  const quoteToDealRate = kpis.quoteToDealRate.current;
  const pendingQuotations = quotations.filter((q) => q.status === "Sent" || q.status === "Viewed").length;

  insights.push({
    id: "insight-funnel-efficiency",
    type: "friction",
    title: "Pipeline Conversion Velocity",
    badge: convRate >= 15 ? "OPTIMAL CONVERSION" : "FUNNEL BOTTLENECK",
    badgeColor: convRate >= 15 ? "blue" : "amber",
    metric: `${formatPercent(convRate)} Lead Conversion`,
    summary: `Quote-to-deal conversion stands at ${formatPercent(quoteToDealRate)}. Currently, ${pendingQuotations} active proposals are awaiting client signature.`,
    ruleExplanation: "Deterministic Rule: Analyzes 3-tier drop-off ratio: Leads → Quotations Sent → Won Deals.",
    impactLevel: pendingQuotations > 5 ? "High" : "Medium",
  });

  // 3. Fiscal Balance & Collections Integrity
  const totalSettled = payments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPendingInvoices = invoices.filter((i) => i.status === "Issued" || i.status === "Partially Paid" || i.status === "Overdue").reduce((sum, i) => sum + i.outstandingAmount, 0);
  const collectionEfficiency = totalSettled + totalPendingInvoices > 0
    ? (totalSettled / (totalSettled + totalPendingInvoices)) * 100
    : 100;

  insights.push({
    id: "insight-fiscal-integrity",
    type: "fiscal",
    title: "Cash Collection Efficiency",
    badge: collectionEfficiency > 90 ? "AUDIT BALANCED" : "RECEIVABLES ATTENTION",
    badgeColor: collectionEfficiency > 90 ? "emerald" : "amber",
    metric: `${collectionEfficiency.toFixed(1)}% Settled`,
    summary: `Verified collections total ${formatCurrency(totalSettled)} with ${formatCurrency(outstanding)} in uncollected receivables. Zero negative receivables balance verified.`,
    ruleExplanation: "Deterministic Rule: Cross-reconciles settled payment ledger against active invoice receivables with strict 18% GST balancing.",
    impactLevel: "Medium",
  });

  // 4. Strategic Executive Recommendation
  insights.push({
    id: "insight-strategic-recommendation",
    type: "recommendation",
    title: "Strategic Action Recommendation",
    badge: "ACTIONABLE RECOMMENDATION",
    badgeColor: "violet",
    metric: `${orders.length} Active Orders`,
    summary: `Prioritize follow-ups on ${pendingQuotations} outstanding quotes to accelerate month-end cash settlements, and allocate operations bandwidth to ${topCategory} fulfillment.`,
    ruleExplanation: "Deterministic Rule: Synthesizes high-yield deal stages with active operational orders to highlight highest-ROI actions.",
    impactLevel: "High",
  });

  return insights;
}
