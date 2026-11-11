import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  ShoppingCart,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

// Sample verified data matching BizPro deterministic model
const REVENUE_TREND_DATA = [
  { month: "Nov 25", revenue: 28.4, target: 25.0, collections: 27.9 },
  { month: "Dec 25", revenue: 32.1, target: 28.0, collections: 31.4 },
  { month: "Jan 26", revenue: 30.5, target: 30.0, collections: 29.8 },
  { month: "Feb 26", revenue: 35.8, target: 32.0, collections: 34.9 },
  { month: "Mar 26", revenue: 41.2, target: 36.0, collections: 40.5 },
  { month: "Apr 26", revenue: 38.6, target: 37.0, collections: 38.0 },
  { month: "May 26", revenue: 44.1, target: 39.0, collections: 43.2 },
  { month: "Jun 26", revenue: 46.5, target: 41.0, collections: 45.7 },
  { month: "Jul 26", revenue: 42.8, target: 40.0, collections: 42.1 },
  { month: "Aug 26", revenue: 49.3, target: 43.0, collections: 48.5 },
  { month: "Sep 26", revenue: 53.0, target: 45.0, collections: 52.1 },
  { month: "Oct 26", revenue: 58.4, target: 48.0, collections: 57.2 },
];

const LEAD_FUNNEL_DATA = [
  { stage: "Total Inquiries", count: 1240, dropoff: "100%", fill: "#3b82f6" },
  { stage: "Contacted", count: 980, dropoff: "79.0%", fill: "#6366f1" },
  { stage: "Qualified Proposals", count: 620, dropoff: "50.0%", fill: "#8b5cf6" },
  { stage: "Converted Clients", count: 342, dropoff: "27.5%", fill: "#10b981" },
];

const CATEGORY_SHARE = [
  { name: "Pvt Ltd Registration", count: 142, revenue: "₹18.4L", percentage: "38%" },
  { name: "Annual Compliance", count: 98, revenue: "₹12.2L", percentage: "25%" },
  { name: "GST & Tax Filing", count: 86, revenue: "₹9.8L", percentage: "20%" },
  { name: "Trademark & IP", count: 54, revenue: "₹5.4L", percentage: "11%" },
  { name: "Startup India Cert", count: 32, revenue: "₹3.2L", percentage: "6%" },
];

export default function DashboardPreview() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "payments">("overview");

  return (
    <section id="preview" className="py-24 bg-[#0a0f1d] relative overflow-hidden border-t border-b border-white/[0.08]">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive Product Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            See BizPro in Action.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Real metrics. Deterministic calculations. Explore interactive previews of the actual BizPro analytical modules below.
          </p>
        </div>

        {/* Dashboard Mockup Container */}
        <div className="rounded-2xl bg-[#0f172a] border border-white/[0.12] shadow-2xl shadow-black/80 overflow-hidden">
          {/* Top Browser / App Chrome */}
          <div className="px-4 py-3 bg-[#090d18] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
                <span className="text-emerald-400">https://</span>bizpro-analytics-dashboard.vercel.app/app
              </div>
            </div>

            {/* Preview interactive tabs */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.06] overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Revenue Trend
              </button>
              <button
                onClick={() => setActiveTab("funnel")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === "funnel"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Lead Funnel
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === "payments"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Collections & Services
              </button>
            </div>

            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all"
            >
              <span>Open Full App</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Preview Body */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0e1628] to-[#0a0f1d]">
            {/* Quick Filter Banner */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Filter className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Active Global Scope:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Last 12 Months
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  All Departments
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Deterministic Model • Currency: <strong className="text-slate-200">INR (₹)</strong>
              </div>
            </div>

            {/* TAB 1: REVENUE TREND */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Realized Revenue</div>
                    <div className="text-2xl font-bold text-white mt-1">₹48.9 Lakhs</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> +22.4% vs prev period
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cash Collected</div>
                    <div className="text-2xl font-bold text-white mt-1">₹47.8 Lakhs</div>
                    <div className="text-xs text-sky-400 mt-1 font-medium">
                      97.8% collection efficiency
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Won Orders</div>
                    <div className="text-2xl font-bold text-white mt-1">342 Completed</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> 72% quote conversion
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Order Value</div>
                    <div className="text-2xl font-bold text-white mt-1">₹14,298</div>
                    <div className="text-xs text-indigo-400 mt-1 font-medium">
                      GST 18% reconciled
                    </div>
                  </div>
                </div>

                {/* Live Recharts Chart */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Monthly Realized Revenue vs Target</h4>
                      <p className="text-xs text-slate-400">Values represented in Lakhs INR (₹)</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
                        <span className="text-slate-300">Revenue</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-indigo-400/50 inline-block" />
                        <span className="text-slate-300">Target</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                            color: "#fff",
                          }}
                          formatter={(value: any) => [`₹${value} Lakhs`, ""]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#revenueGrad)"
                          name="Revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#818cf8"
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          fill="none"
                          name="Target"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LEAD FUNNEL */}
            {activeTab === "funnel" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Funnel Stages */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-white mb-2">Stage Conversion Velocity</h4>
                    <p className="text-xs text-slate-400 mb-4">Total inquiries qualified into active paying clients</p>
                    <div className="space-y-3">
                      {LEAD_FUNNEL_DATA.map((item, idx) => (
                        <div key={item.stage} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 font-medium">{item.stage}</span>
                            <span className="text-white font-semibold">{item.count} leads ({item.dropoff})</span>
                          </div>
                          <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: item.dropoff,
                                backgroundColor: item.fill,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channel Breakdown */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-white mb-2">Inquiry Acquisition Channels</h4>
                    <p className="text-xs text-slate-400 mb-4">Conversion volume by primary acquisition source</p>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { channel: "Google Ads", leads: 430 },
                            { channel: "Website", leads: 340 },
                            { channel: "Referral", leads: 220 },
                            { channel: "Social", leads: 150 },
                            { channel: "Direct", leads: 100 },
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="channel" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "0.5rem",
                              fontSize: "12px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PAYMENTS & SERVICES */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Settlement Breakdown */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-white mb-2">Settlement & Receivables Status</h4>
                    <p className="text-xs text-slate-400 mb-4">Reconciled against invoice transactions</p>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-emerald-400 font-semibold">Completed / Settled</div>
                          <div className="text-sm font-bold text-white">₹47,82,400</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">97.8%</span>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-amber-400 font-semibold">Pending Clearances</div>
                          <div className="text-sm font-bold text-white">₹1,08,200</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">2.2%</span>
                      </div>

                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between items-center">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold">GST Calculated (18%)</div>
                          <div className="text-sm font-bold text-white">₹7,46,200</div>
                        </div>
                        <span className="text-xs text-slate-400">Tax Audit Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Category Share */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-white mb-2">Revenue by Service Category</h4>
                    <p className="text-xs text-slate-400 mb-3">Top business offerings contributing to revenue</p>

                    <div className="space-y-2.5">
                      {CATEGORY_SHARE.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04]">
                          <span className="text-slate-300">{cat.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">{cat.count} orders</span>
                            <span className="font-semibold text-white">{cat.revenue}</span>
                            <span className="text-blue-400 font-mono text-[11px]">{cat.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Bar inside Mockup */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Computed from BizPro&apos;s internal relational dataset. Zero external database required.</span>
              </div>
              <button
                onClick={() => navigate("/app")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Launch Complete Dashboard (All 7 Panels)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

