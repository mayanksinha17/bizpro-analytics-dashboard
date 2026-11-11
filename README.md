# BizPro Premium
### Business Intelligence. Simplified.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://bizpro-analytics-dashboard.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10.1-22C55E?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

A modern, responsive SaaS business intelligence platform combining an interactive marketing website with a comprehensive revenue operations dashboard.

BizPro delivers a seamless **dual-experience architecture**:
- **`/` — Premium SaaS Marketing Website**: Modern conversion-focused marketing interface featuring high-contrast product storytelling, interactive Recharts preview frames, structured value pillars, transparent pricing, and a validated lead acquisition flow.
- **`/app` — Interactive Business Analytics Dashboard**: Enterprise command center with 7 operational analytics panels, 9 dynamic date presets, multi-dimensional filters, period-over-period financial benchmarks, and deterministic rule-based operational intelligence.

---

## 🌐 Live Deployments

| Resource | Direct Link | Description |
|---|---|---|
| 🚀 **Live SaaS Website** | [https://bizpro-analytics-dashboard.vercel.app/](https://bizpro-analytics-dashboard.vercel.app/) | Marketing landing page with interactive previews and contact flow |
| 📊 **Live Analytics Dashboard** | [https://bizpro-analytics-dashboard.vercel.app/app](https://bizpro-analytics-dashboard.vercel.app/app) | Full enterprise analytics command center (7 operational modules) |
| 💻 **GitHub Repository** | [https://github.com/mayanksinha17/bizpro-analytics-dashboard](https://github.com/mayanksinha17/bizpro-analytics-dashboard) | Source code, configuration, and documentation |

---

## 📸 Screenshot Showcase

### Desktop Landing Page (1440px)
High-contrast hero section with floating KPI metric badges, primary & secondary action triggers, and interactive product preview.

![Desktop Landing Page](screenshots/desktop.png)

---

### Mobile Landing Page (390px)
Touch-optimized viewport layout with fluid responsive typography, accessible navigation drawer, and vertically stacked feature cards.

<p align="center">
  <img src="screenshots/mobile.png" alt="Mobile Landing Page" width="380" />
</p>

---

### Full Website Preview
Comprehensive end-to-end product narrative: Navigation, Hero, Live Dashboard Preview, 4 Feature Pillars, 3-Step Workflow, Pricing, Validated Contact Form, and Footer.

![Full Website Preview](screenshots/fullpage.png)

---

### Executive Analytics Dashboard (`/app`)
Enterprise dark-mode command center featuring the Smart Operational Intelligence banner, global multi-filter controls, KPI cards, and Recharts financial visualizations.

![Executive Analytics Dashboard](screenshots/dashboard-app.png)

---

### Mobile Dashboard Experience (390px)
Responsive analytics layout with adaptive horizontal filter scrolling, full-width KPI metric cards, and responsive chart viewports.

<p align="center">
  <img src="screenshots/dashboard-mobile.png" alt="Mobile Dashboard Experience" width="380" />
</p>

---

## ✨ Key Features

### 1. SaaS Marketing Website (`/`)
* **Responsive Navigation**: Sticky glassmorphic navbar with BizPro branding, section jump links (`Features`, `How It Works`, `Preview`, `Pricing`, `Contact`), quick `Launch Dashboard` action button, and a mobile sliding drawer with keyboard `Escape` dismiss.
* **Interactive Hero Section**: Value proposition headline (*"Turn Business Data Into Better Decisions"*), product positioning (*"BizPro — Business Intelligence. Simplified."*), dual conversion CTAs, floating live KPI cards, and verified architectural proof tags (Sub-millisecond latency, Audit-grade logic, 100% Client-side privacy).
* **Interactive Dashboard Preview**: Mac-inspired application frame showcasing live interactive Recharts visualizations with 3 selectable operational views:
  * *Revenue Trend*: Monthly target vs. realized revenue progression.
  * *Lead Funnel*: 3-tier conversion progression (Inquiries → Proposals → Retainers).
  * *Collections & Services*: Settlement integrity and departmental revenue distributions.
* **Feature Showcase (4 Core Pillars)**:
  * 📈 **Revenue Analytics**: End-to-end financial visibility, period-over-period comparisons (MoM, QoQ), and profit margin tracking.
  * 👥 **Lead Management**: Multi-channel lead attribution (Google Ads, Social, Referrals, Inbound) and conversion velocity.
  * 💳 **Payment Tracking**: Reconcile settled invoices against pending receivables with 18% standard GST tax balancing.
  * 🎛️ **Smart Filtering**: Reactive in-memory recalculation across date presets, departments, and service categories.
* **How It Works**: 3-step structured methodology (*01: Understand Business Data*, *02: Analyze Performance*, *03: Make Informed Decisions*) with visual progression connectors and capability badges.
* **Transparent Pricing**:
  * **Starter Plan (Free forever)**: Complete access to all 7 modules, 9 date presets, and local report exports. Direct CTA routes into `/app`.
  * **Professional Plan (₹999/month - Illustrative)**: Multi-user workspace simulation, weekly executive email digests, and priority SLAs. Routes directly into the inquiry form.
  * **Transparency Notice Banner**: Explicit notice that pricing figures are illustrative for technical evaluation.
  * **Interactive FAQ Accordion**: Resolves common questions regarding data persistence, export capabilities, and client-side architecture.
* **Validated Contact / Demo Request**:
  * Fields: Full Name, Work Email, Company Name, Interested Plan, and Message.
  * Client-side validation: Required field guards, RFC-compliant email regex, and minimum character constraints.
  * Animated dispatch state (~700ms simulation) followed by an enterprise confirmation card and reset option.
* **Footer**: Brand identity, categorized navigation columns (Product, Modules, Assignment), operational status beacon (*"● All Systems Operational"*), and smooth "Back to Top" scrolling.

---

### 2. Analytics Dashboard (`/app`)
Seven specialized analytical panels providing operational clarity across the entire commercial lifecycle:

1. **Executive Overview**: High-level financial KPIs (Total Revenue, Net Margin, Collection Efficiency, Pipeline Velocity), revenue vs. target charts, and departmental breakdowns.
2. **Lead Analytics**: Acquisition volume by source channel, conversion rate benchmarks, and lead status distribution.
3. **Quotation Analytics**: Total proposed value, quotation status tracking (Draft, Sent, Viewed, Accepted, Rejected), and quote-to-deal transition rates.
4. **Deals & Revenue Pipeline**: Stage-by-stage pipeline distribution (Discovery, Proposal, Negotiation, Won, Lost) and average deal size.
5. **Orders & Operations**: Workload allocation by team member, fulfillment status tracking, and SLA throughput.
6. **Payments & Collections**: Settled cash flows vs. outstanding accounts receivable, overdue invoice aging, and 18% GST reconciliation.
7. **Sales Team Analytics**: Individual rep quota attainment, deal closing velocity, and revenue contribution metrics.

---

### 3. Smart Operational Intelligence Engine
The dashboard includes an intelligent executive insight banner powered by `src/analytics/insights.ts`. 

> [!NOTE]
> **Deterministic Rule-Based Intelligence**: All insights are generated entirely on the client side using mathematical business logic and statistical formulas evaluated against in-memory relational state. No external LLMs, OpenAI keys, or generative AI APIs are used.

The engine computes four deterministic insight categories:
1. **Commercial Momentum**: Evaluates Period-over-Period (PoP) revenue velocity against the preceding equivalent date window, surfacing growth momentum or revenue volatility flags alongside top contributing service categories.
2. **Pipeline Velocity and Friction**: Evaluates 3-tier drop-off ratios (Leads → Quotations Sent → Won Deals) and quantifies active proposals awaiting client signature.
3. **Fiscal Integrity and Collections Balancing**: Cross-reconciles settled payment ledgers against active invoice receivables with strict 18% GST balancing, auditing collection efficiency percentage.
4. **Strategic Recommendations**: Synthesizes high-yield deal stages with active operational fulfillment orders to deliver clear, actionable operational next steps.

---

### 4. Interactive Analytics & Visualizations
* **Recharts SVG Visualizations**: Composed charts, area charts, bar charts, and pie charts with responsive containers and custom dark-mode tooltips.
* **Global Date Presets**: 9 date presets (*Today*, *Last 7D*, *Last 30D*, *This Month*, *Last 3M*, *Last 6M*, *This Year*, *Last 12M*, and *Custom Range*) powered by `date-fns`.
* **Multi-Dimensional Filters**: Instant filtering by Department (Sales, Operations, Finance, Management), Service Category (8 categories), and Sales Representative.
* **Period-over-Period (PoP) Comparisons**: Dynamic baseline calculations comparing current metrics to equivalent historical windows with percentage deltas and positive/negative indicators.
* **Custom Chart Tooltips**: Enterprise glassmorphic tooltips displaying formatted Indian Rupee (`₹`) values and precise percentages.

---

## 🛠 Technology Stack

The project strictly utilizes modern, production-grade web technologies installed and defined in [`package.json`](package.json):

| Dependency | Version | Purpose |
|---|---|---|
| **[React](https://react.dev/)** | `^19.3.1` | Modern declarative UI component architecture with React 19 features |
| **[React DOM](https://react.dev/)** | `^19.3.1` | React DOM rendering engine |
| **[TypeScript](https://www.typescriptlang.org/)** | `~7.0.2` | Static typing, interface definitions, and compile-time contract safety |
| **[Vite](https://vitejs.dev/)** | `^8.3.4` | High-performance build tool, lightning-fast HMR, and chunk optimization |
| **[Tailwind CSS](https://tailwindcss.com/)** | `^4.3.3` | Modern utility-first CSS styling engine |
| **[@tailwindcss/vite](https://tailwindcss.com/)** | `^4.3.3` | Native Vite integration plugin for Tailwind CSS v4 |
| **[Recharts](https://recharts.org/)** | `^3.10.1` | Declarative SVG charting library for responsive business visualizations |
| **[Lucide React](https://lucide.dev/)** | `^1.59.0` | Accessible, consistent enterprise SVG icons |
| **[date-fns](https://date-fns.org/)** | `^4.4.0` | Modular date arithmetic, range comparisons, and preset formatting |
| **[Vercel](https://vercel.com/)** | Static Edge | Production edge deployment with wildcard SPA URL rewriting |

---

## 🏛 Architecture & Routing

BizPro uses a zero-dependency client-side routing model managed via `src/context/NavigationContext.tsx`. It synchronizes browser history via HTML5 `pushState` and `popstate` events without requiring external routing libraries, ensuring zero bundle bloat and sub-millisecond route transitions.

```mermaid
flowchart TD
    subgraph Browser ["Client Browser URL"]
        URL["window.location.pathname"]
    end

    subgraph Navigation ["Zero-Dependency Navigation Layer"]
        NavContext["NavigationProvider (src/context/NavigationContext.tsx)"]
        History["pushState / popstate Listeners"]
    end

    subgraph RootRouter ["App.tsx Root Router"]
        RouterSwitch{"Path Evaluation"}
    end

    subgraph LandingSite ["SaaS Marketing Platform ( / )"]
        LP["LandingPage.tsx"]
        LP --> Navbar["Navbar.tsx"]
        LP --> Hero["Hero.tsx"]
        LP --> Preview["DashboardPreview.tsx"]
        LP --> Features["Features.tsx"]
        LP --> HowItWorks["HowItWorks.tsx"]
        LP --> Pricing["Pricing.tsx"]
        LP --> Contact["Contact.tsx"]
        LP --> Footer["Footer.tsx"]
    end

    subgraph AnalyticsApp ["Revenue Operations Dashboard ( /app )"]
        DP["DashboardProvider (src/context/DashboardContext.tsx)"]
        Shell["Dashboard Shell (Sidebar.tsx + TopBar.tsx)"]
        InsightsEngine["Smart Operational Intelligence (src/analytics/insights.ts)"]
        Panels["7 Analytics Modules\nOverviewPanel | LeadsPanel | QuotationsPanel\nDealsPanel | OrdersPanel | PaymentsPanel | TeamPanel"]
        DP --> Shell
        DP --> InsightsEngine
        DP --> Panels
    end

    subgraph DataLayer ["Data & State Layer"]
        DataGen["Seeded Relational Data Generator (src/data/generator.ts)"]
        Utils["Analytics Computations & Formatters (src/analytics/utils.ts, src/utils/format.ts)"]
        DataGen --> DP
        Utils --> DP
        Utils --> LP
    end

    URL --> NavContext
    NavContext --> History
    History --> RouterSwitch
    RouterSwitch -->|"Path === '/app'"| AnalyticsApp
    RouterSwitch -->|"Path === '/' (or other)"| LandingSite
    Navbar -.->|"Navigate to /app"| NavContext
    Hero -.->|"Launch CTA"| NavContext
    Shell -.->|"Back to Marketing"| NavContext
```

### Directory Structure

```
bizpro-analytics-dashboard/
├── index.html                       # HTML entry point with meta tags & Inter typography
├── package.json                     # Project manifest and exact dependency definitions
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite configuration (Rolldown chunking, Tailwind plugin)
├── vercel.json                      # Vercel SPA rewrite rule (/(.*) -> /index.html)
├── screenshots/                     # Verified documentation previews
│   ├── desktop.png                  # Desktop landing page (1440x900)
│   ├── mobile.png                   # Mobile landing page (390x844)
│   ├── fullpage.png                 # Full landing page layout (1440x4200)
│   ├── dashboard-app.png            # Analytics dashboard (1440x900)
│   └── dashboard-mobile.png         # Mobile dashboard experience (390x844)
├── src/
│   ├── App.tsx                      # Root router: renders LandingPage (/) or Dashboard (/app)
│   ├── main.tsx                     # React DOM application mount
│   ├── index.css                    # Design tokens, glassmorphic utilities, Tailwind imports
│   ├── vite-env.d.ts                # Vite client environment type declarations
│   ├── analytics/
│   │   ├── insights.ts              # Deterministic rule-based operational intelligence engine
│   │   └── utils.ts                 # Analytical calculations, filter predicates, and KPI aggregators
│   ├── components/
│   │   ├── landing/                 # SaaS Marketing Landing Page Modules
│   │   │   ├── Navbar.tsx           # Glassmorphic navbar with mobile slide-out menu
│   │   │   ├── Hero.tsx             # Value proposition hero with floating KPI cards
│   │   │   ├── DashboardPreview.tsx # Interactive live Recharts preview frame
│   │   │   ├── Features.tsx         # 4 Core operational capability pillars
│   │   │   ├── HowItWorks.tsx       # 3-Step operational methodology
│   │   │   ├── Pricing.tsx          # Starter & Professional tiers + FAQ accordion
│   │   │   ├── Contact.tsx          # Validated inquiry form with animated states
│   │   │   ├── Footer.tsx           # Complete footer with system health status
│   │   │   └── LandingPage.tsx      # Landing page layout orchestrator
│   │   ├── dashboard/               # 7 Dedicated Analytics Panels
│   │   │   ├── OverviewPanel.tsx    # Executive business health & revenue charts
│   │   │   ├── LeadsPanel.tsx       # Lead acquisition, conversion funnels & sources
│   │   │   ├── QuotationsPanel.tsx  # Quote volume, status tracking & conversion
│   │   │   ├── DealsPanel.tsx       # Stage-by-stage revenue pipeline & forecasts
│   │   │   ├── OrdersPanel.tsx      # Operational orders, SLAs & team workload
│   │   │   ├── PaymentsPanel.tsx    # Invoices, receivables & 18% GST reconciliation
│   │   │   └── TeamPanel.tsx        # Sales representative quota performance
│   │   ├── layout/                  # Dashboard Layout Shell
│   │   │   ├── Sidebar.tsx          # Collapsible navigation sidebar with route switch
│   │   │   └── TopBar.tsx           # Global filter controls, search & view toggle
│   │   └── shared/                  # Reusable Design System Components
│   │       ├── ChartTooltip.tsx     # Custom glassmorphic Recharts tooltip
│   │       ├── EmptyState.tsx       # Accessible empty data placeholder
│   │       ├── KPICard.tsx          # Metric card with PoP deltas and progress indicators
│   │       ├── SmartInsightCard.tsx # Rule-based operational intelligence card
│   │       └── StatusBadge.tsx      # Color-coded operational status indicator
│   ├── context/
│   │   ├── DashboardContext.tsx     # Global analytics state, filters, and active tab
│   │   └── NavigationContext.tsx    # Zero-dependency browser routing & anchor scroll
│   ├── data/
│   │   └── generator.ts             # Deterministic relational data generator (seeded)
│   ├── types/
│   │   └── index.ts                 # Comprehensive TypeScript interfaces & domain types
│   └── utils/
│       └── format.ts                # Indian Rupee (₹) currency & percentage formatting
```

---

## 💻 Installation & Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher (compatible with Node 18, 20, 22, and 24)
* **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/mayanksinha17/bizpro-analytics-dashboard.git
cd bizpro-analytics-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🏗 Build & Verification

### 1. TypeScript Verification
Run type checking across the entire TypeScript codebase:
```bash
npx tsc --noEmit
```

### 2. Build for Production
Generate an optimized static production bundle:
```bash
npm run build
```
Production assets are generated in `dist/` with optimized code splitting (`charts`, `icons`, `date-fns`). A fallback `200.html` is automatically copied to support single-page application routing on static hosts.

### 3. Preview Production Build Locally
Verify the production build locally:
```bash
npm run preview
```
Open [http://localhost:4173/](http://localhost:4173/) to inspect the production deployment build.

---

## 📱 Responsive Design Breakpoints

The user interface has been engineered and visually validated across six standard responsive viewport breakpoints:

| Breakpoint | Viewport Width | Device Target | Verification Status |
|---|---|---|---|
| **Compact Mobile** | `375px` | iPhone SE, smaller smartphones | Verified — no horizontal overflow |
| **Modern Mobile** | `390px` | iPhone 14/15/16, Galaxy S-series | Verified — touch-friendly controls |
| **Tablet** | `768px` | iPad Portrait, Android tablets | Verified — 2-column adaptive layout |
| **Small Laptop** | `1024px` | iPad Pro Landscape, MacBook Air | Verified — full desktop navigation |
| **Desktop** | `1280px` | Standard desktop monitors | Verified — full analytics visualization |
| **High-Resolution** | `1440px` | Large desktop displays | Verified — optimal typographic hierarchy |

---

## 🔒 Important Transparency & Architectural Disclosures

To uphold the highest standards of technical integrity and documentation transparency:

1. **Demonstration Data**: All operational entities (Leads, Quotations, Deals, Orders, Invoices, Payments, and Employees) are generated deterministically in memory at runtime via `src/data/generator.ts` using a seeded pseudorandom algorithm. No external SQL/NoSQL databases or REST endpoints are queried.
2. **Rule-Based Intelligence**: The Smart Operational Intelligence engine (`src/analytics/insights.ts`) evaluates deterministic mathematical rules against in-memory relational state. It does **not** make calls to OpenAI, Claude, Gemini, or any external generative LLM service.
3. **Simulated Contact Form**: The contact and demo request form performs client-side field validation and simulated asynchronous submission (`setTimeout`). Submitted inquiries are not persisted to an external email service or database.
4. **Illustrative Pricing**: The Free Starter and ₹999/month Professional tiers are displayed strictly for product presentation and internship evaluation purposes. No commercial payment gateway is attached.
5. **Zero External Subscriptions**: The entire application runs client-side with zero external SaaS dependencies, subscription keys, or hidden backend infrastructure.

---

## 🎓 Sankar Group Internship Context

This project was developed for the **Sankar Group Front-End Development Internship Assignment**.

### Key Deliverables Satisfied
- [x] **Dual-Route SaaS Architecture**: Transformed existing analytics dashboard into a dual-mode application with a premium marketing landing page at `/` and the enterprise dashboard preserved at `/app`.
- [x] **Brand & Visual Identity**: Deep navy, white, and electric blue color palette with subtle gradients, refined glassmorphic surfaces, and professional typography.
- [x] **Modular Component Structure**: 8 separate marketing components in `src/components/landing/` and 7 analytics panels in `src/components/dashboard/`.
- [x] **Interactive Previews**: Realistic dashboard preview showcasing live interactive Recharts visualizations.
- [x] **Working Contact Experience**: Validated contact form with instant field validation, error indicators, and submission confirmation.
- [x] **Documentation Integrity**: Complete technical documentation, screenshots, and architecture diagrams.

---

## 👤 Author & License

* **Author**: Mayank Kumar Sinha
* **Email**: [mk3631780@gmail.com](mailto:mk3631780@gmail.com)
* **GitHub**: [@mayanksinha17](https://github.com/mayanksinha17)
* **Project Repository**: [bizpro-analytics-dashboard](https://github.com/mayanksinha17/bizpro-analytics-dashboard)
* **License**: [MIT](LICENSE) — Feel free to use, modify, and distribute this codebase for educational and evaluation purposes.
