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
    Boolean(filter.employeeId || filter.department || filter.category) ||
    activePreset !== "last12M";

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
    <header
      style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 1.25rem",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexWrap: "wrap",
      }}
    >
      {/* Title & Mobile Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 160 }}>
        <button
          id="btn-mobile-menu"
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          style={{
            background: "transparent",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            padding: "0.3rem",
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            color: "#374151",
          }}
        >
          <Menu size={18} />
        </button>
        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            padding: "0.15rem 0.45rem",
            background: "#eff6ff",
            color: "#2563eb",
            borderRadius: "0.375rem",
            whiteSpace: "nowrap",
          }}
        >
          {formattedRange}
        </span>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", padding: "0.375rem 0" }}>
        
        {/* Date presets selector */}
        <div ref={presetDropdownRef} style={{ position: "relative" }}>
          <button
            id="filter-date-preset-btn"
            aria-haspopup="true"
            aria-expanded={showPresetDropdown}
            aria-label="Select date range preset"
            onClick={() => setShowPresetDropdown(!showPresetDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.32rem 0.65rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              background: activePreset !== "last12M" ? "#eff6ff" : "white",
              color: activePreset !== "last12M" ? "#2563eb" : "#374151",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Calendar size={13} color={activePreset !== "last12M" ? "#2563eb" : "#6b7280"} />
            <span>{activePreset === "custom" ? "Custom Range" : (activePresetObj?.label ?? "Select Range")}</span>
            <ChevronDown size={12} color="#9ca3af" />
          </button>

          {showPresetDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                width: 170,
                background: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e5e7eb",
                padding: "0.35rem",
                zIndex: 40,
              }}
            >
              <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#9ca3af", padding: "0.25rem 0.5rem" }}>
                PRESETS
              </div>
              {DATE_PRESETS.map(p => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    id={`preset-${p.id}`}
                    onClick={() => {
                      setPreset(p.id);
                      setShowPresetDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.35rem 0.5rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.75rem",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "#2563eb" : "#374151",
                      background: isSelected ? "#eff6ff" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>{p.label}</span>
                    {isSelected && <Check size={13} color="#2563eb" />}
                  </button>
                );
              })}
              <div style={{ height: 1, background: "#f3f4f6", margin: "0.25rem 0" }} />
              <button
                id="preset-custom-range"
                onClick={() => {
                  setShowCustomModal(true);
                  setShowPresetDropdown(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: activePreset === "custom" ? 600 : 400,
                  color: activePreset === "custom" ? "#2563eb" : "#374151",
                  background: activePreset === "custom" ? "#eff6ff" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>Custom Date...</span>
                {activePreset === "custom" && <Check size={13} color="#2563eb" />}
              </button>
            </div>
          )}
        </div>

        {/* Quick pill presets for fastest 1-click access */}
        <div style={{ display: "flex", gap: "0.25rem", background: "#f3f4f6", borderRadius: "0.5rem", padding: "0.2rem" }}>
          {[
            { id: "today" as DatePreset, label: "Today" },
            { id: "last7" as DatePreset, label: "7D" },
            { id: "last30" as DatePreset, label: "30D" },
            { id: "thisMonth" as DatePreset, label: "This Mo" },
            { id: "last12M" as DatePreset, label: "12M" },
          ].map(p => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                id={`quick-range-${p.id}`}
                onClick={() => setPreset(p.id)}
                style={{
                  padding: "0.25rem 0.55rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#2563eb" : "#6b7280",
                  background: isActive ? "white" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Department filter */}
        <div style={{ position: "relative" }}>
          <select
            id="filter-department"
            aria-label="Filter by department"
            value={filter.department ?? ""}
            onChange={e => setDepartment((e.target.value as Department) || null)}
            style={{
              padding: "0.3rem 1.75rem 0.3rem 0.625rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              background: filter.department ? "#eff6ff" : "white",
              fontSize: "0.75rem",
              color: filter.department ? "#2563eb" : "#374151",
              fontWeight: filter.department ? 600 : 400,
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown
            size={12}
            style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
          />
        </div>

        {/* Category filter */}
        <div style={{ position: "relative" }}>
          <select
            id="filter-category"
            aria-label="Filter by service category"
            value={filter.category ?? ""}
            onChange={e => setCategory((e.target.value as ServiceCategory) || null)}
            style={{
              padding: "0.3rem 1.75rem 0.3rem 0.625rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              background: filter.category ? "#eff6ff" : "white",
              fontSize: "0.75rem",
              color: filter.category ? "#2563eb" : "#374151",
              fontWeight: filter.category ? 600 : 400,
              cursor: "pointer",
              appearance: "none",
              maxWidth: 155,
            }}
          >
            <option value="">All Services</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown
            size={12}
            style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
          />
        </div>

        {/* Employee filter */}
        <div style={{ position: "relative" }}>
          <select
            id="filter-employee"
            aria-label="Filter by team member"
            value={filter.employeeId ?? ""}
            onChange={e => setEmployee(e.target.value || null)}
            style={{
              padding: "0.3rem 1.75rem 0.3rem 0.625rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              background: filter.employeeId ? "#eff6ff" : "white",
              fontSize: "0.75rem",
              color: filter.employeeId ? "#2563eb" : "#374151",
              fontWeight: filter.employeeId ? 600 : 400,
              cursor: "pointer",
              appearance: "none",
              maxWidth: 140,
            }}
          >
            <option value="">All Employees</option>
            {data.employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <ChevronDown
            size={12}
            style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
          />
        </div>

        {/* Reset Filters button */}
        {hasNonDefaultFilters && (
          <button
            id="filter-reset"
            onClick={resetFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.3rem 0.5rem",
              border: "1px solid #fca5a5",
              borderRadius: "0.5rem",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <X size={12} /> Reset
          </button>
        )}

        {/* Right side utility icons */}
        <button
          id="btn-refresh"
          title="Refresh view"
          onClick={() => {}}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <RefreshCw size={14} />
        </button>
        <button
          id="btn-notifications"
          title="Notifications"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <Bell size={14} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#dc2626",
              border: "2px solid white",
            }}
          />
        </button>

        <button
          id="btn-back-landing"
          title="Back to Landing Page"
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.38rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #2563eb",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <ArrowLeft size={13} />
          <span>Marketing Site</span>
        </button>
      </div>

      {/* Custom Date Range Modal / Popover */}
      {showCustomModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowCustomModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              width: 340,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", margin: 0 }}>Select Custom Date Range</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleApplyCustom} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#4b5563", marginBottom: "0.25rem" }}>
                  Start Date
                </label>
                <input
                  id="custom-range-start"
                  type="date"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.6rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.8125rem",
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#4b5563", marginBottom: "0.25rem" }}>
                  End Date
                </label>
                <input
                  id="custom-range-end"
                  type="date"
                  value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.6rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.8125rem",
                  }}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    background: "white",
                    fontSize: "0.75rem",
                    color: "#4b5563",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  id="custom-range-apply"
                  type="submit"
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    background: "#2563eb",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "white",
                    cursor: "pointer",
                  }}
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
