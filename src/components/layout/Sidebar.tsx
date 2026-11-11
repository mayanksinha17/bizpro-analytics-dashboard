import { BarChart3, TrendingUp, Users, FileText, ShoppingCart, CreditCard, Activity, Settings, ChevronRight, ArrowLeft } from "lucide-react";
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
    <aside className="sidebar flex flex-col" style={{ minHeight: "100vh", background: "#1e293b", width: 220, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }} onClick={() => navigate("/")} title="Back to Landing Page">
          <div style={{
            width: 34, height: 34, borderRadius: "0.5rem",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BarChart3 size={18} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.2 }}>BizPro</div>
            <div style={{ color: "#94a3b8", fontSize: "0.6875rem", fontWeight: 500 }}>Analytics</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.625rem" }}>
        <button
          id="sidebar-back-home"
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.45rem 0.625rem",
            marginBottom: "0.75rem",
            borderRadius: "0.375rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
            fontSize: "0.75rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(37,99,235,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
        >
          <ArrowLeft size={13} />
          <span>Back to Landing Page</span>
        </button>
        <div style={{ marginBottom: "0.25rem" }}>
          <div style={{ color: "#64748b", fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.5rem 0.5rem" }}>
            Main Menu
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  background: isActive ? "rgba(37,99,235,0.25)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? "#60a5fa" : "#94a3b8",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.875rem",
                  textAlign: "left",
                  marginBottom: "0.125rem",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          id="nav-settings"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            fontSize: "0.875rem",
          }}
        >
          <Settings size={16} />
          Settings
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.75rem 0.625rem 0.25rem",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.6875rem", fontWeight: 700, color: "white",
          }}>KN</div>
          <div>
            <div style={{ color: "#f1f5f9", fontSize: "0.75rem", fontWeight: 500 }}>Kamala Nair</div>
            <div style={{ color: "#64748b", fontSize: "0.6875rem" }}>General Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
