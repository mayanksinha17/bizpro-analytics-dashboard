# BizPro Analytics Dashboard

> A high-performance, responsive Business Performance & Revenue Analytics Dashboard built with **React 19**, **TypeScript**, **Vite**, and **Recharts**.

[![Live Production Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://bizpro-analytics-dashboard.vercel.app)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Demo

🔗 **Public Production Deployment**: [https://bizpro-analytics-dashboard.vercel.app](https://bizpro-analytics-dashboard.vercel.app)

---

## 📊 Project Overview

**BizPro Analytics Dashboard** is an enterprise-grade revenue operations and business intelligence application. Designed for leadership teams, operations executives, and sales managers, it delivers end-to-end visibility across the commercial lifecycle—from top-of-funnel lead acquisition and quotation delivery to deal closures, order fulfillment, payment settlements, and team workload distribution.

The application operates on a **100% frontend deterministic relational data model** (utilizing seeded pseudorandom generation), ensuring reproducible, internally coherent business metrics without requiring external database dependencies or backend infrastructure.

---

## 🚀 Key Features

### 1. Seven Dedicated Analytical Modules
* **Overview (Executive Command Center)**: Top-line revenue metrics, collections vs. outstanding receivables, won deals velocity, order throughput, conversion rates, and comparative performance.
* **Lead Analytics**: 3-stage conversion funnel (Total Leads → Qualified → Converted), channel distribution (Inbound, Referral, Outbound, Partner, Campaign), and status pipeline tracking.
* **Quotation Analytics**: Quotation volume vs. value by service offering, quote-to-deal conversion ratios, and status breakdown.
* **Deals & Revenue Pipeline**: Aggregate deal values, closing ratios, monthly pipeline vs. realized cash collections trend lines, and priority distribution.
* **Orders & Operations**: Order fulfillment throughput, workload by service category, and operations team velocity.
* **Payments & Collections**: 12-month revenue collection area charts, transaction tables, settlement status (Completed, Pending, Failed, Overdue), and receivables reconciliation.
* **Sales Team Analytics**: Sales rep performance metrics, quota realization, won deal value, win rates, and live CRM activity streams.

### 2. Multi-Dimensional Global Filtering & Presets
* **9 Date Presets**: *Today*, *Last 7 Days*, *Last 30 Days*, *This Month*, *Last 3 Months*, *Last 6 Months*, *This Year*, *Last 12 Months*, and *Custom Date Range*.
* **Department Filtering**: Filter across *Sales*, *Operations*, *Finance*, and *Marketing*.
* **Service Category Filtering**: Narrow down by *Digital Transformation*, *Cloud Infrastructure*, *ERP Implementation*, *Data & AI Solutions*, and *Consulting*.
* **Employee Filtering**: Analyze metrics attributed to specific team members.
* **Period-over-Period Comparisons**: Automated comparison with previous period equivalents (+/-% deltas with directional indicators).
* **Safe Zero/Empty States**: Helpful zero-state screens with 1-click filter reset functionality.

### 3. Financial Integrity & Business Logic
* **Quotation ➔ Deal**: Quotation totals match linked deal values on converted proposals.
* **Deal ➔ Order**: Won deal values directly generate and match linked order amounts.
* **Order ➔ Invoice**: Invoices calculate base order value + 18% standard GST.
* **Payment Settlement Integrity**: Collected revenue strictly includes verified *Completed* payments. Pending or failed transactions are segregated.
* **Receivables Balance**: Outstanding balances cannot become negative.
* **Standardized Currency Formatting**: Uniform Indian Rupee (INR ₹) formatting with clean compact abbreviations (Lakhs/Crores).

### 4. Interactive Drill-Down Modals & Cross-Module CRM Navigation
* Interactive detail modals for all records (Leads, Quotations, Deals, Orders, Payments).
* Cross-module navigation links (e.g. click "View Lead" from inside a Deal modal to instantly navigate to the Leads panel with filtered search).

### 5. Responsive Design Across Devices
* **Desktop (1440px+)**: Spacious multi-column visualization grid with fixed sidebar navigation.
* **Tablet (768px – 1024px)**: Auto-stacking chart rows with fluid table responsiveness.
* **Mobile (390px – 768px)**: Collapsible slide-in navigation drawer with backdrop overlay, touch-friendly filter controls, and zero horizontal viewport leakage.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 8](https://vitejs.dev/) |
| **Data Visualizations** | [Recharts 3](https://recharts.org/) |
| **Date Handling** | [date-fns](https://date-fns.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Custom Design System (CSS Tokens + Utility Classes + Tailwind CSS) |
| **Deployment** | [Vercel](https://vercel.com/) (Edge Static SPA) |

---

## 🏛 System Architecture

```
src/
├── components/
│   ├── dashboard/          # Analytics Panels
│   │   ├── OverviewPanel.tsx
│   │   ├── LeadsPanel.tsx
│   │   ├── QuotationsPanel.tsx
│   │   ├── DealsPanel.tsx
│   │   ├── OrdersPanel.tsx
│   │   ├── PaymentsPanel.tsx
│   │   └── TeamPanel.tsx
│   ├── layout/             # Application Shell
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   └── shared/             # Reusable UI Atoms
│       ├── KPICard.tsx
│       ├── StatusBadge.tsx
│       └── EmptyState.tsx
├── context/
│   └── DashboardContext.tsx # Centralized filter & navigation state
├── data/
│   ├── generator.ts        # Seeded deterministic pseudo-random generator
│   └── dummyData.ts        # Linked entities (Leads, Deals, Orders, etc.)
├── types/
│   └── index.ts            # Canonical domain data models & contracts
├── utils/
│   ├── analytics.ts        # Financial aggregations, period delta calculations
│   └── formatters.ts       # Currency (INR), date, and percentage formatters
├── App.tsx                 # Root layout container & responsive shell
├── index.css               # Global typography, color variables, chart grids
└── main.tsx                # React DOM entry point
```

---

## ⚙️ Installation & Development

### Prerequisites
* [Node.js](https://nodejs.org/) version 18.0.0 or higher
* npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/bizpro-analytics-dashboard.git
cd bizpro-analytics-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173/`.

### 4. Build for production
```bash
npm run build
```
Compiles TypeScript, runs Vite production bundling, and generates `dist/200.html` for single-page application hosting fallback.

### 5. Preview production build locally
```bash
npm run preview
```
Runs a local preview server from the `dist/` bundle at `http://localhost:4173/`.

### 6. Type checking
```bash
npx tsc --noEmit
```

---

## 🚀 Deployment

The project is pre-configured for automated deployment to **Vercel**, **Netlify**, or **GitHub Pages**:

* **Vercel**: Includes [vercel.json](vercel.json) with SPA rewrite rules.
* **Netlify / Cloudflare Pages**: Includes `public/_redirects` forwarding all routes to `/index.html`.
* **Universal Static Hosts**: Includes `dist/200.html` and relative asset resolution (`base: "./"` in `vite.config.ts`).

To deploy via Vercel CLI:
```bash
npx vercel --prod
```

---

## 📸 Screenshots

| Executive Overview | Leads & Conversion Funnel |
|:---:|:---:|
| ![Overview](https://bizpro-analytics-dashboard.vercel.app/favicon.svg) *High-level KPIs, Collections, and Performance* | *Pipeline funnel, source channels, and conversion velocities* |

| Deals & Pipeline | Payments & Collections |
|:---:|:---:|
| *Deal creation vs collections trend lines* | *12-month revenue collection and transaction status* |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
