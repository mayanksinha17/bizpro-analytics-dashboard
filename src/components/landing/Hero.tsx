import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Zap, BarChart3, TrendingUp, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export default function Hero() {
  const { navigate, scrollToSection } = useNavigation();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#080d1a]">
      {/* Background radial gradient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-violet-600/10 blur-[130px] rounded-full"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 right-0 w-[450px] h-[450px] bg-sky-500/10 blur-[140px] rounded-full"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement pill badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-md shadow-sm shadow-blue-500/10 hover:border-blue-500/40 transition-colors max-w-full">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="font-semibold text-white whitespace-nowrap">BizPro 2.0</span>
            <span className="text-slate-400">•</span>
            <span className="truncate">Business Intelligence. Simplified.</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 hidden xs:inline" />
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.2] mb-6">
            Turn Business Data Into{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
              Better Decisions.
            </span>
          </h1>

          {/* Supporting description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Stop wrestling with fragmented spreadsheets and disjointed tools. BizPro gives leadership and operations teams real-time visibility across revenue, lead pipelines, deal tracking, and cash collections—all in one deterministic command center.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/app")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/45 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("preview")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all duration-200 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* Trust-oriented proof without fabricated customer claims */}
          <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Sub-Millisecond</div>
                <div className="text-[11px] text-slate-400">In-memory reactive filtering</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Audit-Grade Logic</div>
                <div className="text-[11px] text-slate-400">Reconciled GST & collections</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">100% Privacy</div>
                <div className="text-[11px] text-slate-400">Deterministic local compute</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">7 Core Modules</div>
                <div className="text-[11px] text-slate-400">End-to-end revenue lifecycle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Showcase Frame */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Ambient backglow */}
          <div 
            aria-hidden="true" 
            className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-violet-600/30 rounded-2xl blur-xl opacity-75"
          />

          <div className="relative rounded-2xl bg-[#0d1527] border border-white/[0.12] shadow-2xl shadow-black/60 overflow-hidden">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                  bizpro-analytics-dashboard.vercel.app/app
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400 hidden xs:inline">Live Engine Active</span>
              </div>
            </div>

            {/* Quick Metrics Bar inside window */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-[#0f172a] to-[#080d1a]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Net Revenue</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">₹42.8 Lakhs</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% MoM
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Won Deals</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">342 Deals</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-1">
                    <TrendingUp className="w-3 h-3" /> 72% Win Ratio
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Collection Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">98.4%</div>
                  <div className="text-[11px] text-sky-400 font-medium mt-1">
                    Audit Balanced
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Active Pipeline</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">₹14.2 Lakhs</div>
                  <div className="text-[11px] text-indigo-400 font-medium mt-1">
                    48 Opportunities
                  </div>
                </div>
              </div>

              {/* Teaser CTA strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hidden sm:block">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Explore Full Working Dashboard</div>
                    <div className="text-xs text-slate-400">Interact with all 7 analytical panels, 9 date presets, and custom filters.</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/app")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <span>Launch Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

