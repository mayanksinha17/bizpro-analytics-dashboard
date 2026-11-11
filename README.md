# BizPro — Business Intelligence. Simplified.
## Sankar Group Front-End Development Internship Assignment

> A premier, enterprise-grade SaaS product marketing platform and high-performance revenue operations dashboard built with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, and **Recharts**.

[![Live Production Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://bizpro-analytics-dashboard.vercel.app)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployments

* 🚀 **SaaS Product Landing Page**: [https://bizpro-analytics-dashboard.vercel.app/](https://bizpro-analytics-dashboard.vercel.app/)
* 📊 **Enterprise Analytics Dashboard**: [https://bizpro-analytics-dashboard.vercel.app/app](https://bizpro-analytics-dashboard.vercel.app/app)
* 💻 **GitHub Repository**: [https://github.com/mayanksinha17/bizpro-analytics-dashboard](https://github.com/mayanksinha17/bizpro-analytics-dashboard)

---

## 📸 Visual Previews & Screenshots

| Viewport | Preview File | Description |
|---|---|---|
| **Desktop Landing Page (1440px)** | [`screenshots/desktop.png`](screenshots/desktop.png) | High-contrast hero, value proof metrics, interactive product preview |
| **Mobile Landing Page (390px)** | [`screenshots/mobile.png`](screenshots/mobile.png) | Fluid typography, collapsible drawer navigation, touch-friendly CTAs |
| **Full Page Landing Showcase** | [`screenshots/fullpage.png`](screenshots/fullpage.png) | Complete SaaS narrative: Features, How It Works, Pricing, Contact, Footer |
| **Analytics Command Center (`/app`)** | [`screenshots/dashboard-app.png`](screenshots/dashboard-app.png) | Executive dark theme, Smart Operational Intelligence banner, Recharts |
| **Mobile Dashboard Experience (390px)** | [`screenshots/dashboard-mobile.png`](screenshots/dashboard-mobile.png) | Responsive cards, touch-friendly filter controls, stacked insights |

---

## 🎨 Design Choices & Challenges (5–8 Line Reflection)

To elevate BizPro from a raw analytics interface to a commercial SaaS brand, we implemented an executive dark-navy (`#080d1a` / `#0f172a`) aesthetic energized by luminous electric-blue (`#2563eb` / `#3b82f6`) and violet accents, mirroring modern software leaders like Linear and Raycast. The primary architectural challenge was introducing dual-route capability (`/` for marketing, `/app` for the analytical engine) while preserving the dashboard's deterministic in-memory state, complex Recharts visualizations, and global filter context without rewriting working business logic or introducing heavy third-party routing dependencies. We solved this with a zero-dependency `NavigationProvider` that synchronizes browser history via `pushState` and `popstate`, backed by absolute asset resolution (`base: "/"`) and Vercel edge rewrites. To ensure trust without fabricating customer claims, the hero and feature sections highlight verified architectural realities—100% client-side privacy, audit-grade GST reconciliation, and sub-millisecond filtering. Finally, responsive typography and interactive components (tabbed live Recharts previews and a fully validated contact flow) guarantee fluid usability across 375px to 1440px displays.

---

## 📊 Project Overview

**BizPro** is a comprehensive Business Intelligence and Revenue Operations platform designed for leadership teams, sales executives, and operations managers. It transforms fragmented operational data into actionable strategic clarity across the entire commercial lifecycle:

1. **Top-of-Funnel Lead Management**: Multi-channel acquisition tracking and 3-stage conversion velocity.
2. **Sales Quotations & Deal Pipeline**: Quote-to-deal conversion ratios and deal value forecasting.
3. **Operational Orders & Fulfillment**: Team workload distribution and SLA throughput tracking.
4. **Cash Settlement & Payment Reconciliation**: Aging receivables tracking, GST tax calculation, and collections balancing.

The application runs on a **100% frontend deterministic relational data model** (utilizing seeded pseudorandom generation), ensuring reproducible, internally coherent business metrics without requiring external database dependencies or backend infrastructure.

---

## 🚀 Key Features

### 1. SaaS Marketing Landing Page (`/`)
* **Navbar**: Responsive glassmorphic navigation with BizPro branding, quick jump links (`Features`, `How It Works`, `Preview`, `Pricing`, `Contact`), a prominent "Launch Dashboard" CTA, and a mobile hamburger drawer with keyboard accessibility (`Esc` dismiss).
* **Hero Section**: High-impact headline (*"Turn Business Data Into Better Decisions"*), product positioning (*"BizPro — Business Intelligence. Simplified."*), dual CTAs, verified trust proof badges (Sub-Millisecond latency, Audit-Grade logic, 100% Privacy, 7 Core Modules), and a floating dashboard metric preview.
* **Interactive Dashboard Preview**: Realistic macOS-styled application frame featuring live interactive Recharts visualizations (Monthly Revenue vs. Target), 3-stage Lead Funnel metrics, and Settlement status with dynamic tab switching.
* **4 Core Operational Pillars**:
  * 📈 **Revenue Analytics**: End-to-end financial visibility, period-over-period comparisons (MoM, QoQ), profit margins, and cash collection trajectories.
  * 👥 **Lead Management**: 3-stage conversion funnels (Total Inquiries → Qualified Proposals → Converted Retainers) and channel attribution (Google Ads, Social, Referrals, Inbound).
  * 💳 **Payment Tracking**: Reconcile settled invoices vs pending receivables, 18% standard GST calculation, invoice reconciliation, and zero-leakage collection pipelines.
  * 🎛️ **Smart Filtering**: 9 date presets, departmental slicing (Sales, Operations, Finance, Management), 8 service category breakdowns, and reactive in-memory recalculation.
* **How It Works**: 3-step structured methodology (*01: Understand Business Data*, *02: Analyze Performance*, *03: Make Informed Decisions*) with visual timeline connectors and capability callouts.
* **Pricing Tiers**:
  * **Starter Plan**: Free (₹0 / forever) — Complete access to all 7 modules, 9 date presets, and local report exports. Direct "Launch Starter Free" CTA into `/app`.
  * **Professional Plan**: ₹999/month (Illustrative) — Multi-user workspaces, weekly executive email digests, and priority SLAs. Direct "Request Professional Access" CTA linking into the contact form.
  * **Illustrative Notice Banner**: Explicit transparency disclosure that all pricing is simulated for technical evaluation.
  * **Collapsible FAQ Accordion**: Resolves common technical questions regarding data architecture, export options, and privacy.
* **Contact & Demo Request**:
  * Form fields: Full Name, Work Email, Company Name, Interested Plan/Tier, Message.
  * Comprehensive client-side validation (required checks, email regex format, minimum character length guards).
  * Real-time inline error notifications with `AlertCircle` indicators.
  * Animated dispatch state (~700ms simulation) followed by an enterprise confirmation card and "Send Another Inquiry" action.
  * Direct contact details (email, response SLA &lt; 2 hrs, Bangalore office location).
* **Footer**: Complete brand mark, structured link columns (Product, Modules, Internship Submission), operational status indicator (*"● All Systems Operational"*), and smooth "Back to Top" scrolling.

### 2. Original Enterprise Analytics Dashboard (`/app`)
* **Preserved Full Functionality**: 7 dedicated analytical panels (`OverviewPanel`, `LeadsPanel`, `QuotationsPanel`, `DealsPanel`, `OrdersPanel`, `PaymentsPanel`, `TeamPanel`).
* **Global Filter Suite**: 9 date presets (*Today*, *Last 7D*, *Last 30D*, *This Month*, *Last 3M*, *Last 6M*, *This Year*, *Last 12M*, and *Custom Range*), Department filters, Service Category filters, and Employee filters.
* **Two-Way Navigation Bridge**: Added sleek "← Back to Landing Page" button in the Sidebar and "Marketing Site" pill in the TopBar for effortless switching between marketing and operational modes.

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | [React](https://react.dev/) | `19.3.1` | Modern declarative UI component architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~7.0.2` | Static typing, interface contracts, and type safety |
| **Bundler & Tooling** | [Vite](https://vitejs.dev/) | `^8.3.4` | Next-generation fast HMR and optimized production bundling |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.3.3` | Utility-first CSS engine with `@tailwindcss/vite` |
| **Data Visualizations** | [Recharts](https://recharts.org/) | `^3.10.1` | Declarative SVG charting for revenue and pipeline analytics |
| **Date Manipulation** | [date-fns](https://date-fns.org/) | `^4.4.0` | Comprehensive date arithmetic and preset calculations |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.59.0` | Crisp, accessible enterprise SVG iconography |
| **Hosting & Edge** | [Vercel](https://vercel.com/) | Static Edge | Edge SPA deployment with global wildcard URL rewrites |

---

## 🏛 Architecture & Routing

```
bizpro-analytics-dashboard/
├── index.html                  # HTML entry point with meta tags & Google Inter font
├── vite.config.ts              # Vite configuration (base: "/", Tailwind v4 plugin)
├── vercel.json                 # Vercel SPA rewrite rule (/(.*) -> /index.html)
├── src/
│   ├── App.tsx                 # Root router: switches between LandingPage (/) and Dashboard (/app)
│   ├── main.tsx                # React DOM root entry
│   ├── index.css               # Design system tokens, glassmorphic utilities, Tailwind imports
│   ├── components/
│   │   ├── landing/            # SaaS Marketing Landing Page Modules
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── DashboardPreview.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LandingPage.tsx
│   │   ├── dashboard/          # Analytics Dashboard Modules
│   │   │   ├── OverviewPanel.tsx
│   │   │   ├── LeadsPanel.tsx
│   │   │   ├── QuotationsPanel.tsx
│   │   │   ├── DealsPanel.tsx
│   │   │   ├── OrdersPanel.tsx
│   │   │   ├── PaymentsPanel.tsx
│   │   │   └── TeamPanel.tsx
│   │   ├── layout/             # Dashboard Shell (Sidebar & TopBar with navigation bridge)
│   │   └── shared/             # Reusable UI atoms (KPICard, StatusBadge, EmptyState)
│   ├── context/
│   │   ├── DashboardContext.tsx # Global analytics state, filters, and records
│   │   └── NavigationContext.tsx# Zero-dependency browser routing & smooth scroll
│   ├── data/
│   │   └── generator.ts        # Seeded deterministic relational data generator
│   └── utils/
│       └── format.ts           # Indian Rupee (₹) currency & number formatting
```

---

## 💻 Installation & Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

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
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🏗️ Production Build & Verification

### 1. Run Type Checking
```bash
npx tsc --noEmit
```

### 2. Build for Production
```bash
npm run build
```
The optimized static bundle will be generated in `dist/`.

### 3. Preview Production Build Locally
```bash
npm run preview
```
Open [http://localhost:4173/](http://localhost:4173/) to verify the production build.

---

## 🧪 Comprehensive Verification Checklist

- [x] **Root Route (`/`)**: Displays the new SaaS Marketing Landing Page.
- [x] **App Route (`/app`)**: Displays the full original 7-module Analytics Dashboard.
- [x] **Navigation Bridge**: Seamless two-way movement between `/` and `/app` via TopBar and Sidebar.
- [x] **Navbar Links**: Working smooth scroll for `#features`, `#how-it-works`, `#preview`, `#pricing`, `#contact`.
- [x] **Mobile Drawer Navigation**: Touch-friendly hamburger menu with keyboard `Esc` dismiss and backdrop lock.
- [x] **Dashboard Preview**: Interactive tab switching (Revenue Trend, Lead Funnel, Collections & Services) with live Recharts rendering.
- [x] **4 Core Features**: Revenue Analytics, Lead Management, Payment Tracking, and Smart Filtering.
- [x] **3-Step Workflow**: Understand Business Data, Analyze Performance, Make Informed Decisions.
- [x] **Pricing Tiers**: Starter (Free) and Professional (₹999/mo) with explicit illustrative labeling.
- [x] **Contact Form Validation**: Required field check, regex email check, minimum character lengths, animated dispatch, and success card.
- [x] **Responsive Layouts Tested**: Verified at 375px, 390px, 768px, 1024px, and 1440px with zero horizontal viewport leakage.
- [x] **Vercel Routing**: Configured with wildcard edge rewrites and root asset paths (`base: "/"`).

---

## 📄 License & Credits

* **Assignment**: Sankar Group Front-End Development Internship Assignment
* **Author**: Mayank Kumar Sinha ([mk3631780@gmail.com](mailto:mk3631780@gmail.com))
* **License**: [MIT](LICENSE)
