import React from "react";
import { BarChart3, ArrowUp, ExternalLink, Mail, MapPin, Heart, Code2 } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export default function Footer() {
  const { navigate, scrollToSection } = useNavigation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060a14] text-slate-400 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Biz<span className="text-blue-400">Pro</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              Business Intelligence. Simplified.
              <br />
              Turn Business Data Into Better Decisions with real-time revenue analytics, lead pipelines, deal tracking, and cash collections.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-slate-400">Deterministic Engine v2.0</span>
            </div>
          </div>

          {/* Navigation Column 1: Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-white transition-colors"
                >
                  Features & Pillars
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("preview")}
                  className="hover:text-white transition-colors"
                >
                  Interactive Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="hover:text-white transition-colors"
                >
                  Pricing Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Launch Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Analytical Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Modules</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Revenue & Deals
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Lead Funnels
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Quotation Analytics
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Orders & Operations
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Payments & Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/app")} className="hover:text-white transition-colors">
                  Sales Team Workloads
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Contact & Assignment Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Internship Submission</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="text-slate-300">
                Sankar Group Assignment
              </li>
              <li>
                <a
                  href="https://github.com/mayanksinha17/bizpro-analytics-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://bizpro-analytics-dashboard.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  <span>Vercel Live URL</span>
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                Contact: <strong className="text-slate-300">mk3631780@gmail.com</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left text-slate-300">
            <span>&copy; {new Date().getFullYear()} BizPro Analytics.</span>
            <span>All rights reserved. Sankar Group Front-End Development Internship Assignment.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors border border-white/[0.06]"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
