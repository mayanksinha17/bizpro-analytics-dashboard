import React from "react";
import { Database, Search, LineChart, ArrowRight, CheckCircle, Lightbulb, Compass, Zap } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export default function HowItWorks() {
  const { navigate } = useNavigation();

  const steps = [
    {
      step: "01",
      title: "Understand Business Data",
      subtitle: "Unified Relational Data Model",
      description:
        "Consolidate fragmented business touchpoints—from inbound marketing leads and customized service quotations to won client deals, operational orders, and tax invoices—into a single coherent, internally linked data system.",
      icon: Database,
      tag: "Data Ingestion & Integrity",
      highlights: [
        "Eliminates disconnected spreadsheets and duplicate entries",
        "Deterministic relational consistency between Quotes, Deals, and Invoices",
        "Zero backend configuration or database setup needed",
      ],
    },
    {
      step: "02",
      title: "Analyze Performance",
      subtitle: "Multi-Dimensional Drill-Down",
      description:
        "Evaluate your commercial health with automated period-over-period delta benchmarks, 3-stage conversion funnel analytics, sales team quota realization, and cash collection aging trajectories.",
      icon: LineChart,
      tag: "Interactive Analytics",
      highlights: [
        "9 dynamic date presets plus custom date range selection",
        "Departmental and service category performance isolation",
        "Sub-second recalculation without page refreshes or latency",
      ],
    },
    {
      step: "03",
      title: "Make Informed Decisions",
      subtitle: "Executive Action & Growth",
      description:
        "Turn raw transactional numbers into actionable strategic initiatives. Pinpoint conversion drop-offs, optimize sales rep workloads, accelerate invoice settlements, and allocate capital to high-margin service offerings.",
      icon: Lightbulb,
      tag: "Strategic Execution",
      highlights: [
        "Accurate cash flow forecasting grounded in verified collections",
        "Resource re-allocation to highest converting acquisition channels",
        "Board-ready, audit-grade visual metrics at your fingertips",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0a0f1d] relative overflow-hidden border-t border-b border-white/[0.08]">
      {/* Ambient background glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[150px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Workflow Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            From Raw Numbers to Decisive Action.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A proven three-step methodology that converts daily operational activity into clear strategic clarity.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div 
            aria-hidden="true" 
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/30 to-violet-500/20 -translate-y-16 z-0" 
          />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 rounded-2xl bg-[#0f172a]/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold tracking-wider text-blue-400 uppercase mb-2">
                    {item.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-400 mb-4">
                    {item.subtitle}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-6 border-t border-white/[0.06] space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Test the 3-Step Methodology Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

