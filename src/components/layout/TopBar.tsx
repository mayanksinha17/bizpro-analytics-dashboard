import React, { useState, useRef, useEffect } from "react";
import { Bell, RefreshCw, Calendar, ChevronDown, X, Check, Menu, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigation } from "../../context/NavigationContext";
import { DATE_PRESETS } from "../../analytics/utils";
import type { Department, ServiceCategory } from "../../types";
import type { DatePreset } from "../../analytics/utils";

const DEPARTMENTS: Department[] = ["Sales", "Operations", "Finance", "Management"];
const CATEGORIES: ServiceCategory[] = [
  "Private Limited Registration",
  "LLP Registration",
  "GST",
  "Trademark",
  "Startup India Registration",
  "ISO Certification",
  "Annual Compliance",
  "Other Services",
];

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { navigate } = useNavigation();
  const {
    filter,
    activePreset,
    setPreset,
    setCustomDateRange,
    setDepartment,
    setCategory,
    data,
    setEmployee,
    resetFilters,
    toggleMobileMenu,
  } = useDashboard();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState(() => format(filter.dateRange.start, "yyyy-MM-dd"));
  const [customEnd, setCustomEnd] = useState(() => format(filter.dateRange.end, "yyyy-MM-dd"));
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);

  // Sync inputs when filter dateRange changes
  useEffect(() => {
    setCustomStart(format(filter.dateRange.start, "yyyy-MM-dd"));
    setCustomEnd(format(filter.dateRange.end, "yyyy-MM-dd"));
  }, [filter.dateRange]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(e.target as Node)) {
        setShowPresetDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePresetObj = DATE_PRESETS.find(p => p.id === activePreset);
  const formattedRange = `${format(filter.dateRange.start, "dd MMM yy")} – ${format(filter.dateRange.end, "dd MMM yy")}`;

  const hasNonDefaultFilters =
    activePreset !== "last12M" ||
    filter.department !== null ||
    filter.category !== null ||
    filter.employeeId !== null;

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    const start = new Date(`${customStart}T00:00:00`);
    const end = new Date(`${customEnd}T23:59:59`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
    setCustomDateRange(start, end);
    setShowCustomModal(false);
    setShowPresetDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090d18]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 min-h-[58px] flex items-center justify-between gap-4 flex-wrap py-2">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <button
          id="btn-mobile-menu"
          className="mobile-menu-btn md:hidden p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {formattedRange}
          </span>
        </div>
      </div>

      {/* Filters suite */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date presets selector */}
        <div ref={presetDropdownRef} className="relative">
          <button
            id="filter-date-preset-btn"
            aria-haspopup="true"
            aria-expanded={showPresetDropdown}
            aria-label="Select date range preset"
            onClick={() => setShowPresetDropdown(!showPresetDropdown)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              activePreset !== "last12M"
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Calendar size={13} className={activePreset !== "last12M" ? "text-blue-400" : "text-slate-400"} />
            <span>{activePreset === "custom" ? "Custom Range" : (activePresetObj?.label ?? "Select Range")}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showPresetDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-48 bg-[#0f172a] rounded-xl shadow-2xl shadow-black/80 border border-white/[0.12] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Date Presets
              </div>
              <div className="space-y-0.5 max-h-60 overflow-y-auto">
                {DATE_PRESETS.map((p) => {
                  const isSelected = activePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      id={`preset-${p.id}`}
                      onClick={() => {
                        setPreset(p.id);
                        setShowPresetDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                        isSelected
                          ? "bg-blue-600/25 text-blue-300 border border-blue-500/30 font-semibold"
                          : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span>{p.label}</span>
                      {isSelected && <Check size={13} className="text-blue-400" />}
                    </button>
                  );
                })}
              </div>
              <div className="h-px bg-white/[0.08] my-1" />
              <button
                id="preset-custom-range"
                onClick={() => {
                  setShowCustomModal(true);
                  setShowPresetDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  activePreset === "custom"
                    ? "bg-blue-600/25 text-blue-300 border border-blue-500/30"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span>Custom Date...</span>
                {activePreset === "custom" && <Check size={13} className="text-blue-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Quick pill presets */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          {[
            { id: "today" as DatePreset, label: "Today" },
            { id: "last7" as DatePreset, label: "7D" },
            { id: "last30" as DatePreset, label: "30D" },
            { id: "thisMonth" as DatePreset, label: "This Mo" },
            { id: "last12M" as DatePreset, label: "12M" },
          ].map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                id={`quick-range-${p.id}`}
                onClick={() => setPreset(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Department filter */}
        <div className="relative">
          <select
            id="filter-department"
            aria-label="Filter by department"
            value={filter.department ?? ""}
            onChange={(e) => setDepartment((e.target.value as Department) || null)}
            className={`pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-medium border appearance-none transition-colors focus:outline-none focus:border-blue-500 ${
              filter.department
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-white/[0.15]"
            }`}
          >
            <option value="" className="bg-[#0f172a] text-slate-200">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-[#0f172a] text-slate-200">{d}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            id="filter-category"
            aria-label="Filter by service category"
            value={filter.category ?? ""}
            onChange={(e) => setCategory((e.target.value as ServiceCategory) || null)}
            className={`pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-medium border appearance-none transition-colors max-w-[145px] truncate focus:outline-none focus:border-blue-500 ${
              filter.category
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-white/[0.15]"
            }`}
          >
            <option value="" className="bg-[#0f172a] text-slate-200">All Services</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f172a] text-slate-200">{c}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Employee filter */}
        <div className="relative">
          <select
            id="filter-employee"
            aria-label="Filter by team member"
            value={filter.employeeId ?? ""}
            onChange={(e) => setEmployee(e.target.value || null)}
            className={`pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-medium border appearance-none transition-colors max-w-[130px] truncate focus:outline-none focus:border-blue-500 ${
              filter.employeeId
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-white/[0.15]"
            }`}
          >
            <option value="" className="bg-[#0f172a] text-slate-200">All Team</option>
            {data.employees.map((e) => (
              <option key={e.id} value={e.id} className="bg-[#0f172a] text-slate-200">{e.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Reset button */}
        {hasNonDefaultFilters && (
          <button
            id="filter-reset"
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-colors"
          >
            <X size={12} />
            <span>Reset</span>
          </button>
        )}

        {/* Utility icons */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/[0.08]">
          <button
            id="btn-refresh"
            title="Refresh View"
            onClick={() => {}}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            id="btn-notifications"
            title="Notifications"
            className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          >
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
          <button
            id="btn-back-landing"
            title="Back to Landing Page"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 bg-blue-500/15 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all ml-1"
          >
            <ArrowLeft size={12} />
            <span className="hidden sm:inline">Marketing Site</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="bg-[#0f172a] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Select Custom Date Range</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Start Date</label>
                <input
                  id="custom-range-start"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">End Date</label>
                <input
                  id="custom-range-end"
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  id="custom-range-apply"
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
