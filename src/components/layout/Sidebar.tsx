import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  ShoppingCart,
  CreditCard,
  Activity,
  Settings,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview",    label: "Overview",      icon: BarChart3 },
  { id: "leads",       label: "Leads",         icon: TrendingUp },
  { id: "quotations",  label: "Quotations",    icon: FileText },
  { id: "deals",       label: "Deals",         icon: Activity },
  { id: "orders",      label: "Orders",        icon: ShoppingCart },
  { id: "payments",    label: "Payments",      icon: CreditCard },
  { id: "team",        label: "Sales Team",    icon: Users },
];

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const { navigate } = useNavigation();

  return (
    <aside className="sidebar flex flex-col h-full bg-[#090d18] border-r border-white/[0.08] w-[230px] shrink-0">
      {/* Brand Logo & Home Link */}
      <div className="p-4 border-b border-white/[0.08]">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
          title="Back to Landing Page"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
            <BarChart3 size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-tight">BizPro</span>
              <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <div className="text-slate-400 text-[11px] font-medium">Business Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {/* Back to Website Button */}
        <button
          id="sidebar-back-home"
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-xl bg-white/[0.03] hover:bg-blue-600/15 border border-white/[0.06] hover:border-blue-500/30 text-slate-300 hover:text-blue-300 text-xs font-medium transition-all group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Marketing Website</span>
        </button>

        <div className="mb-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
            Analytical Modules
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect(item.id)}
                  className={`w-full relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/25 to-indigo-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-1 top-1.5 bottom-1.5 w-1 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
                  )}
                  <Icon size={16} className={isActive ? "text-blue-400" : "text-slate-400"} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={13} className="text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User / Settings Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-[#070b14]">
        <button
          id="nav-settings"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors mb-2"
        >
          <Settings size={15} />
          <span>Workspace Settings</span>
        </button>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm">
            KN
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">Kamala Nair</div>
            <div className="text-[10px] text-slate-400 truncate">General Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
