import React, { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Cpu, Info } from "lucide-react";
import type { SmartInsight } from "../../analytics/insights";

interface SmartInsightCardProps {
  insights: SmartInsight[];
}

export default function SmartInsightCard({ insights }: SmartInsightCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showRules, setShowRules] = useState(false);

  if (!insights || insights.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0d1527] to-[#0a0f1d] border border-blue-500/25 p-5 sm:p-6 shadow-xl shadow-blue-500/5 relative overflow-hidden backdrop-blur-md">
      {/* Decorative ambient aura */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 blur-[90px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 blur-[90px] rounded-full" 
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Smart Operational Intelligence
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-semibold tracking-wider uppercase">
                Deterministic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated rule-based synthesis computed directly from your active filtered scope
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRules(!showRules)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
            title="Inspect heuristic rules"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{showRules ? "Hide Rules" : "Inspect Logic"}</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label={expanded ? "Collapse insights" : "Expand insights"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rule transparency notice */}
      {showRules && (
        <div className="mt-4 p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2 animate-in fade-in duration-200">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Methodology Transparency:</strong> Insights are derived through 100% deterministic arithmetic evaluations across active payment settlements, lead funnels, and quote conversion ratios. No external probabilistic LLM or third-party cloud service is used.
          </div>
        </div>
      )}

      {/* Insight cards grid */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 relative z-10">
          {insights.map((item) => {
            const badgeClasses = {
              emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
              amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
              blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
              violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
            }[item.badgeColor];

            const icon = {
              momentum: <TrendingUp className="w-4 h-4 text-emerald-400" />,
              friction: <AlertTriangle className="w-4 h-4 text-amber-400" />,
              fiscal: <ShieldCheck className="w-4 h-4 text-blue-400" />,
              recommendation: <Sparkles className="w-4 h-4 text-violet-400" />,
            }[item.type];

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] hover:border-blue-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClasses}`}>
                      {item.badge}
                    </span>
                    <div className="p-1.5 rounded-lg bg-white/[0.04]">
                      {icon}
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-blue-300 mb-2">
                    {item.metric}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {showRules && (
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
                    {item.ruleExplanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
