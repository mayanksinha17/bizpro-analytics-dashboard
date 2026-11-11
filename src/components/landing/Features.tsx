import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export default function Features() {
  const { navigate } = useNavigation();
  const [selectedPreset, setSelectedPreset] = useState("Last 30 Days");

  const filterPresets = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last 3 Months",
    "This Year",
  ];

  return (
    <section id="features" className="py-24 bg-[#080d1a] relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[160px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Purpose-Built for Modern Business Operations.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Four unified operational engines that turn fragmented transactional data into clear, auditable business decisions.
          </p>
        </div>

        {/* 4 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* FEATURE 1: Revenue Analytics */}
          <div className="rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                01 / REVENUE ENGINE
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Revenue Analytics
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Gain comprehensive visibility across your sales trajectory. Track gross and net profit margins, period-over-period performance (MoM, QoQ), and forecast future cash inflows based on actual deal velocities.
            </p>

            {/* Visual Micro-Stat Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Period-Over-Period Delta</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% Net Increase
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-4/5" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Deterministic Calculation</span>
                <span className="text-slate-300 font-mono">Won Value: ₹42,80,000</span>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quarterly and monthly revenue trend line comparisons</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Average order and transaction size breakdown</span>
              </li>
            </ul>
          </div>

          {/* FEATURE 2: Lead Management */}
          <div className="rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                02 / PIPELINE OPS
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Lead Management
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Monitor multi-channel lead generation across Google Ads, referrals, organic visits, and campaigns. Analyze stage drop-offs through an automated 3-tier conversion funnel from inquiry to closed client.
            </p>

            {/* Visual Micro-Stat Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Stage 1: Top of Funnel</span>
                <span className="text-blue-400 font-mono">1,240 Inquiries</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Stage 2: Qualified Proposals</span>
                <span className="text-indigo-400 font-mono">620 (50.0%)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Stage 3: Converted Retainers</span>
                <span className="text-emerald-400 font-mono">342 (27.5%)</span>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-channel attribution (Google Ads, Social, Referrals)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cross-module CRM navigation from deal straight to lead record</span>
              </li>
            </ul>
          </div>

          {/* FEATURE 3: Payment Tracking */}
          <div className="rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                03 / FISCAL CONTROL
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Payment Tracking
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Reconcile incoming cash collections against generated invoices. Monitor settled balances, outstanding receivables, overdue accounts, and ensure non-negative financial balance integrity automatically.
            </p>

            {/* Visual Micro-Stat Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Settled Collections
                </span>
                <span className="text-white font-mono font-bold">₹41,60,000</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending Invoices
                </span>
                <span className="text-white font-mono font-bold">₹1,20,000</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">GST Compliance</span>
                <span className="text-sky-400 font-mono">18% Standard Computed</span>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-leakage reconciliation between Orders, Invoices, and Payments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Aging receivables tracking with clear settlement badges</span>
              </li>
            </ul>
          </div>

          {/* FEATURE 4: Smart Filtering */}
          <div className="rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-medium text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                04 / MULTI-DIMENSIONAL
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Smart Filtering
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Slice and dice your metrics dynamically. Switch between 9 date presets or custom dates, filter by 4 operating departments, and isolate specific service categories with immediate sub-millisecond recalculation.
            </p>

            {/* Interactive Filter Chip Demo */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs text-slate-400 mb-2 font-medium">Select Interactive Date Range Preset:</div>
              <div className="flex flex-wrap gap-1.5">
                {filterPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedPreset === preset
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] text-[11px] text-slate-400 flex justify-between">
                <span>Active preset: <strong className="text-blue-300">{selectedPreset}</strong></span>
                <span className="text-emerald-400">Reactive In-Memory Sync</span>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Department slicing across Sales, Operations, Finance, and Management</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Single-click global filter reset with informative empty states</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Bottom CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Experience All Features in the Live App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

