import React from "react";
import { DashboardProvider, useDashboard } from "./context/DashboardContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import OverviewPanel from "./components/dashboard/OverviewPanel";
import LeadsPanel from "./components/dashboard/LeadsPanel";
import QuotationsPanel from "./components/dashboard/QuotationsPanel";
import DealsPanel from "./components/dashboard/DealsPanel";
import OrdersPanel from "./components/dashboard/OrdersPanel";
import PaymentsPanel from "./components/dashboard/PaymentsPanel";
import TeamPanel from "./components/dashboard/TeamPanel";
import LandingPage from "./components/landing/LandingPage";
import type { ActiveView } from "./types";

const VIEW_TITLES: Record<ActiveView, string> = {
  overview: "Business Performance Overview",
  leads: "Lead Analytics",
  quotations: "Quotation Analytics",
  deals: "Deals & Revenue",
  orders: "Orders & Operations",
  payments: "Payments & Collections",
  team: "Sales Team Performance",
};

function DashboardContent() {
  const { activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen } = useDashboard();

  const panel = {
    overview: <OverviewPanel />,
    leads: <LeadsPanel />,
    quotations: <QuotationsPanel />,
    deals: <DealsPanel />,
    orders: <OrdersPanel />,
    payments: <PaymentsPanel />,
    team: <TeamPanel />,
  }[activeView];

  return (
    <div className="dashboard-theme" style={{ display: "flex", minHeight: "100vh", background: "#080d1a", position: "relative" }}>
      {/* Mobile drawer backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            transition: "opacity 0.2s",
          }}
        />
      )}

      {/* Sidebar (desktop static + mobile drawer) */}
      <div className={`sidebar-container ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <Sidebar
          active={activeView}
          onSelect={v => {
            setActiveView(v as ActiveView);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar title={VIEW_TITLES[activeView]} />
        <main style={{ flex: 1, padding: "1.25rem", overflowY: "auto", overflowX: "hidden", background: "#080d1a" }}>
          {panel}
        </main>
        <footer style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#060a14", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            BizPro Analytics Engine &copy; 2026 — Deterministic Relational Compute
          </span>
          <span>Data as of: 19 Oct 2026</span>
        </footer>
      </div>
    </div>
  );
}

function AppRouter() {
  const { currentPath } = useNavigation();

  if (currentPath === "/app") {
    return (
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    );
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <NavigationProvider>
      <AppRouter />
    </NavigationProvider>
  );
}
