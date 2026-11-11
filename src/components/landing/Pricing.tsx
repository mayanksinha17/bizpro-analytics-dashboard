import React, { useState } from "react";
import { Check, Info, ArrowRight, Sparkles, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export default function Pricing() {
  const { navigate, scrollToSection } = useNavigation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is any database or backend required to run BizPro?",
      a: "No. BizPro is architected with a deterministic client-side relational model. It calculates all metrics, conversion funnels, and cash reconciliations entirely in-memory with zero latency.",
    },
    {
      q: "Why is the pricing labeled as illustrative?",
      a: "BizPro is currently deployed as a production-grade demonstration and technical evaluation project for the Sankar Group Internship Assignment. All tier prices and subscription models are simulated and illustrative.",
    },
    {
      q: "Can I export data and charts?",
      a: "Yes! Both Starter and Professional tiers include full data visualization drilldowns, interactive tooltips, and support for CSV/report exporting.",
    },
    {
      q: "How does the period-over-period comparison work?",
      a: "When you select any date preset (such as Last 30 Days or Last 6 Months), BizPro automatically generates the corresponding previous period and displays exact percentage deltas with directional indicators.",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[170px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple, Scalable Investment.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Start immediately with our free tier or request enterprise team access.
          </p>
        </div>

        {/* Clear Illustrative Notice Banner */}
        <div className="max-w-2xl mx-auto mb-16 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center gap-2.5 text-xs text-blue-200 text-center">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Illustrative Pricing Notice:</strong> Pricing figures shown below are illustrative models for evaluation and product presentation.
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 items-stretch">
          {/* STARTER TIER (FREE) */}
          <div className="rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-slate-600 p-8 flex flex-col justify-between backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  Starter Plan
                </span>
                <span className="text-xs font-medium text-emerald-400">Available Immediately</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Full-featured access to core analytics for independent consultants and small leadership teams.
              </p>

              {/* Price display */}
              <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-white/[0.06]">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">₹0</span>
                <span className="text-slate-400 text-sm font-medium">/ forever</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is included:
                </div>
                {[
                  "Access to all 7 Analytical Panels (Overview, Leads, Deals, etc.)",
                  "9 Global Date Presets & Custom Date Range filtering",
                  "Department & Service Category drill-downs",
                  "100% Client-Side In-Memory Execution (Zero database lock-in)",
                  "Audit-grade GST and collections balancing logic",
                  "Standard CSV data export capability",
                  "Community documentation and self-guided access",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/app")}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors shadow-sm"
            >
              <span>Launch Starter Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PROFESSIONAL TIER (₹999/month) */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#111e38] to-[#0c1424] border-2 border-blue-500/50 p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/10 transition-all duration-300 hover:border-blue-400">
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md shadow-blue-500/30">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  Professional Tier
                </span>
                <span className="text-xs font-medium text-blue-300">Enterprise Ready</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Advanced collaboration, automated executive reporting, and priority implementation support.
              </p>

              {/* Price display */}
              <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-white/[0.08]">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">₹999</span>
                <span className="text-slate-300 text-sm font-medium">/ month</span>
                <span className="text-[11px] text-blue-300 font-medium ml-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  Illustrative
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8">
                <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Everything in Starter, plus:
                </div>
                {[
                  "Multi-seat team workspaces with role permissions",
                  "Automated weekly executive email digests & KPI snapshots",
                  "Custom cohort retention and sales rep quota forecasting",
                  "Priority support with guaranteed < 2 hour response SLA",
                  "Custom service categories and departmental mapping",
                  "Dedicated solution architect onboarding session",
                  "REST API & webhook connectors for CRM sync",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToSection("contact")}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Request Professional Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-10 border-t border-white/[0.08]">
          <h3 className="text-xl font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0f172a]/60 border border-white/[0.06] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

