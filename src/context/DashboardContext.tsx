import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { FilterState, DashboardData, Department, ServiceCategory, ActiveView } from "../types";
import { dashboardData } from "../data/generator";
import { defaultDateRange, detectPreset, DATE_PRESETS } from "../analytics/utils";
import type { DatePreset } from "../analytics/utils";

interface DashboardContextValue {
  data: DashboardData;
  filter: FilterState;
  activePreset: DatePreset;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navigateTo: (view: ActiveView, search?: string) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setPreset: (id: DatePreset) => void;
  setCustomDateRange: (start: Date, end: Date) => void;
  setDateRange: (start: Date, end: Date) => void; // kept for backward compat
  setEmployee: (id: string | null) => void;
  setDepartment: (dept: Department | null) => void;
  setCategory: (cat: ServiceCategory | null) => void;
  resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const DEFAULT_FILTER: FilterState = {
  dateRange: defaultDateRange(),
  employeeId: null,
  department: null,
  category: null,
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [activePreset, setActivePreset] = useState<DatePreset>("last12M");
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const navigateTo = useCallback((view: ActiveView, search?: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
    if (search !== undefined) {
      setGlobalSearch(search);
    }
  }, []);

  const setPreset = useCallback((id: DatePreset) => {
    if (id === "custom") return; // custom is set via setCustomDateRange
    const preset = DATE_PRESETS.find(p => p.id === id);
    if (!preset) return;
    const range = preset.getRange();
    setActivePreset(id);
    setFilter(f => ({ ...f, dateRange: range }));
  }, []);

  const setCustomDateRange = useCallback((start: Date, end: Date) => {
    setActivePreset("custom");
    setFilter(f => ({ ...f, dateRange: { start, end } }));
  }, []);

  // kept for backward compat — auto-detects preset or marks custom
  const setDateRange = useCallback((start: Date, end: Date) => {
    const range = { start, end };
    const preset = detectPreset(range);
    setActivePreset(preset);
    setFilter(f => ({ ...f, dateRange: range }));
  }, []);

  const setEmployee   = useCallback((id: string | null) => setFilter(f => ({ ...f, employeeId: id })), []);
  const setDepartment = useCallback((dept: Department | null) => setFilter(f => ({ ...f, department: dept })), []);
  const setCategory   = useCallback((cat: ServiceCategory | null) => setFilter(f => ({ ...f, category: cat })), []);

  const resetFilters = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setActivePreset("last12M");
    setGlobalSearch("");
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({
      data: dashboardData,
      filter,
      activePreset,
      activeView,
      setActiveView,
      navigateTo,
      globalSearch,
      setGlobalSearch,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      toggleMobileMenu,
      setPreset,
      setCustomDateRange,
      setDateRange,
      setEmployee,
      setDepartment,
      setCategory,
      resetFilters,
    }),
    [
      filter,
      activePreset,
      activeView,
      setActiveView,
      navigateTo,
      globalSearch,
      setGlobalSearch,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      toggleMobileMenu,
      setPreset,
      setCustomDateRange,
      setDateRange,
      setEmployee,
      setDepartment,
      setCategory,
      resetFilters,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

