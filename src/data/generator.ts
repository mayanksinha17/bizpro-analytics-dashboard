/**
 * Deterministic dummy data generator.
 * Uses a seeded LCG so the output is always identical.
 */
import type {
  Employee, Lead, Quotation, Deal, Order, Invoice, Payment,
  CRMActivity, DashboardData,
  ServiceCategory, LeadSource, Priority, Department,
  LeadStatus, QuotationStatus, DealStatus, OrderStatus,
  InvoiceStatus, PaymentStatus, PaymentMethod, CRMActivityType,
  EmployeeRole,
} from "../types";

// ── Seeded LCG ───────────────────────────────────────────────────────────────
let seed = 20240101;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (seed >>> 0) / 0xffffffff;
}
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function randInt(lo: number, hi: number): number {
  return Math.floor(lo + rand() * (hi - lo + 1));
}
function randAmount(lo: number, hi: number): number {
  return Math.round((lo + rand() * (hi - lo)) / 100) * 100;
}
function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
function iso(d: Date): string { return d.toISOString().slice(0, 10); }
function nowish(): Date { return new Date("2026-10-19"); }

// ── Reference data ────────────────────────────────────────────────────────────
const CATEGORIES: ServiceCategory[] = [
  "Private Limited Registration", "LLP Registration", "GST", "Trademark",
  "Startup India Registration", "ISO Certification", "Annual Compliance",
  "Other Services",
];
const SOURCES: LeadSource[] = [
  "Google Ads", "Website", "Referral", "Social Media", "Just Dial", "Other",
];
const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
const PAYMENT_METHODS: PaymentMethod[] = [
  "Bank Transfer", "UPI", "Cheque", "Cash", "Credit Card", "Debit Card", "Demand Draft",
];
const ACTIVITY_TYPES: CRMActivityType[] = [
  "Call", "Email", "Meeting", "Follow-up", "Demo",
  "Proposal Sent", "Contract Signed", "Invoice Sent",
  "Payment Received", "Note Added", "Status Changed",
];

const COMPANY_PREFIXES = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Apex", "Nova",
  "Prime", "Zenith", "Atlas", "Orion", "Nexus", "Vertex", "Titan", "Eagle",
  "Pioneer", "Summit", "Crest", "Horizon",
];
const COMPANY_SUFFIXES = [
  "Enterprises", "Solutions", "Services", "Technologies", "Consulting",
  "Associates", "Group", "Partners", "Ventures", "Industries",
];
const FIRST_NAMES = [
  "Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Anita", "Rohit", "Kavya",
  "Suresh", "Meera", "Arun", "Divya", "Kiran", "Pooja", "Manoj", "Swati",
  "Deepak", "Nisha", "Sanjay", "Rekha", "Vinod", "Sunita", "Ajay", "Geeta",
  "Ravi", "Lakshmi", "Nitin", "Radha", "Ramesh", "Savita",
];
const LAST_NAMES = [
  "Sharma", "Patel", "Kumar", "Singh", "Verma", "Gupta", "Mehta", "Joshi",
  "Desai", "Shah", "Nair", "Reddy", "Pillai", "Rao", "Pandey", "Tiwari",
  "Mishra", "Chatterjee", "Mukherjee", "Iyer",
];

const DELIVERABLE_MAP: Record<ServiceCategory, string[]> = {
  "Private Limited Registration": ["DSC", "DIN", "Name Approval", "MOA/AOA", "COI", "PAN/TAN"],
  "LLP Registration": ["DSC", "DPIN", "Name Approval", "LLP Agreement", "COI"],
  "GST": ["GST Registration", "GST Certificate", "GSTIN"],
  "Trademark": ["TM Application", "Examination Report", "TM Certificate"],
  "Startup India Registration": ["DIPP Certificate", "Tax Exemption Letter"],
  "ISO Certification": ["Gap Analysis", "Documentation", "Audit", "ISO Certificate"],
  "Annual Compliance": ["Board Resolutions", "Financial Statements", "MCA Filings"],
  "Other Services": ["Documentation", "Filing", "Certificate"],
};

// Category-wise base prices (INR)
const CATEGORY_PRICE: Record<ServiceCategory, [number, number]> = {
  "Private Limited Registration": [8000, 25000],
  "LLP Registration": [6000, 18000],
  "GST": [1500, 6000],
  "Trademark": [5000, 20000],
  "Startup India Registration": [3000, 10000],
  "ISO Certification": [15000, 60000],
  "Annual Compliance": [5000, 30000],
  "Other Services": [2000, 15000],
};

// ── Step 1: Employees (8) ─────────────────────────────────────────────────────
function genEmployees(): Employee[] {
  const employees: Array<{ name: string; role: EmployeeRole; dept: Department; target: number }> = [
    { name: "Rajesh Khanna",    role: "Business Development Manager", dept: "Sales",      target: 500000 },
    { name: "Preeti Sharma",    role: "Senior Sales Executive",       dept: "Sales",      target: 350000 },
    { name: "Amit Verma",       role: "Sales Executive",              dept: "Sales",      target: 250000 },
    { name: "Sunita Rao",       role: "Sales Executive",              dept: "Sales",      target: 250000 },
    { name: "Mohan Das",        role: "Operations Manager",           dept: "Operations", target: 0 },
    { name: "Lata Krishnan",    role: "Operations Executive",         dept: "Operations", target: 0 },
    { name: "Pradeep Jain",     role: "Finance Manager",              dept: "Finance",    target: 0 },
    { name: "Kamala Nair",      role: "General Manager",              dept: "Management", target: 700000 },
  ];
  return employees.map((e, i) => {
    const parts = e.name.split(" ");
    return {
      id: `EMP-${String(i + 1).padStart(3, "0")}`,
      name: e.name,
      email: `${parts[0].toLowerCase()}.${parts[1].toLowerCase()}@bizpro.in`,
      phone: `+91 ${randInt(7000000000, 9999999999)}`,
      role: e.role,
      department: e.dept as Department,
      joinedAt: iso(addDays(new Date("2022-01-01"), randInt(0, 365))),
      avatarInitials: `${parts[0][0]}${parts[1][0]}`,
      targetRevenue: e.target,
      isActive: true,
    };
  });
}

// ── Step 2: Leads (150+) ─────────────────────────────────────────────────────
function genLeads(employees: Employee[]): Lead[] {
  const salesReps = employees.filter(e => e.department === "Sales");
  const LEAD_STATUSES: LeadStatus[] = [
    "New", "New", "Contacted", "Contacted", "Qualified",
    "Proposal Sent", "Negotiation", "Won", "Won", "Lost", "Unqualified",
  ];
  const start = new Date("2025-04-01");
  const leads: Lead[] = [];
  for (let i = 0; i < 160; i++) {
    const createdAt = addDays(start, randInt(0, 565));
    const fn = pick(FIRST_NAMES);
    const ln = pick(LAST_NAMES);
    const cat = pick(CATEGORIES);
    const status = pick(LEAD_STATUSES);
    const [lo, hi] = CATEGORY_PRICE[cat];
    leads.push({
      id: `LEAD-${String(i + 1).padStart(4, "0")}`,
      companyName: `${pick(COMPANY_PREFIXES)} ${pick(COMPANY_SUFFIXES)}`,
      contactName: `${fn} ${ln}`,
      contactEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}${randInt(1, 99)}@gmail.com`,
      contactPhone: `+91 ${randInt(7000000000, 9999999999)}`,
      source: pick(SOURCES),
      category: cat,
      status,
      priority: pick(PRIORITIES),
      assignedTo: pick(salesReps).id,
      createdAt: iso(createdAt),
      updatedAt: iso(addDays(createdAt, randInt(1, 30))),
      expectedValue: randAmount(lo, hi),
    });
  }
  return leads;
}

// ── Step 3: Quotations (200+) ────────────────────────────────────────────────
function genQuotations(leads: Lead[], employees: Employee[]): Quotation[] {
  const salesReps = employees.filter(e => e.department === "Sales");
  const QUOTE_STATUSES: QuotationStatus[] = [
    "Draft", "Sent", "Sent", "Viewed", "Viewed", "Accepted", "Accepted",
    "Rejected", "Expired",
  ];
  const quotes: Quotation[] = [];
  let qIdx = 1;

  // Every lead gets at least 1 quotation; some get 2
  for (const lead of leads) {
    const count = rand() < 0.35 ? 2 : 1;
    for (let c = 0; c < count; c++) {
      const createdAt = addDays(new Date(lead.createdAt), randInt(1, 7));
      const status = pick(QUOTE_STATUSES);
      const [lo, hi] = CATEGORY_PRICE[lead.category];
      const unitPrice = randAmount(lo, hi);
      const subtotal = unitPrice;
      const taxRate = 0.18;
      const taxAmount = Math.round(subtotal * taxRate);
      const totalAmount = subtotal + taxAmount;
      const q: Quotation = {
        id: `QT-${String(qIdx).padStart(4, "0")}`,
        leadId: lead.id,
        quoteNumber: `Q${new Date(createdAt).getFullYear()}-${String(qIdx).padStart(4, "0")}`,
        status,
        category: lead.category,
        assignedTo: pick(salesReps).id,
        items: [{
          description: `${lead.category} Services`,
          quantity: 1,
          unitPrice,
          total: unitPrice,
        }],
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        validUntil: iso(addDays(createdAt, 30)),
        createdAt: iso(createdAt),
        sentAt: status !== "Draft" ? iso(addDays(createdAt, 1)) : undefined,
        respondedAt: ["Accepted","Rejected","Expired"].includes(status)
          ? iso(addDays(createdAt, randInt(3, 15)))
          : undefined,
      };
      quotes.push(q);
      qIdx++;
    }
  }

  // Pad to 200+ with extra quotes from qualified/won leads
  const qualifiedLeads = leads.filter(l =>
    ["Qualified","Proposal Sent","Negotiation","Won"].includes(l.status)
  );
  while (quotes.length < 205) {
    const lead = pick(qualifiedLeads);
    const createdAt = addDays(new Date(lead.createdAt), randInt(10, 20));
    const status: QuotationStatus = pick(["Accepted","Sent","Viewed"]);
    const [lo, hi] = CATEGORY_PRICE[lead.category];
    const unitPrice = randAmount(lo, hi);
    const subtotal = unitPrice;
    const taxAmount = Math.round(subtotal * 0.18);
    quotes.push({
      id: `QT-${String(qIdx).padStart(4, "0")}`,
      leadId: lead.id,
      quoteNumber: `Q${new Date(createdAt).getFullYear()}-${String(qIdx).padStart(4, "0")}`,
      status,
      category: lead.category,
      assignedTo: pick(salesReps).id,
      items: [{ description: `${lead.category} Services`, quantity: 1, unitPrice, total: unitPrice }],
      subtotal,
      taxRate: 0.18,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      validUntil: iso(addDays(createdAt, 30)),
      createdAt: iso(createdAt),
      sentAt: iso(addDays(createdAt, 1)),
    });
    qIdx++;
  }

  return quotes;
}

// ── Step 4: Deals (60+) ──────────────────────────────────────────────────────
function genDeals(leads: Lead[], quotations: Quotation[], employees: Employee[]): Deal[] {
  const salesReps = employees.filter(e => e.department === "Sales");
  const DEAL_STATUSES: DealStatus[] = ["Won","Won","Won","Active","Active","Lost","On Hold","Cancelled"];
  const acceptedQuotes = quotations.filter(q => q.status === "Accepted");

  const deals: Deal[] = [];
  let dIdx = 1;

  for (const quote of acceptedQuotes) {
    const lead = leads.find(l => l.id === quote.leadId);
    if (!lead) continue;
    const createdAt = addDays(new Date(quote.createdAt), randInt(1, 5));
    const status = pick(DEAL_STATUSES);
    const closedAt = ["Won","Lost","Cancelled"].includes(status)
      ? addDays(createdAt, randInt(7, 45))
      : undefined;

    deals.push({
      id: `DEAL-${String(dIdx).padStart(4, "0")}`,
      leadId: lead.id,
      quotationId: quote.id,
      dealNumber: `D${new Date(createdAt).getFullYear()}-${String(dIdx).padStart(4, "0")}`,
      status,
      category: quote.category,
      assignedTo: pick(salesReps).id,
      value: quote.totalAmount,
      probability: status === "Won" ? 100 : status === "Lost" ? 0 : status === "Active" ? randInt(40, 80) : 30,
      createdAt: iso(createdAt),
      closedAt: closedAt ? iso(closedAt) : undefined,
      expectedCloseDate: iso(addDays(createdAt, randInt(15, 60))),
      priority: lead.priority,
    });
    dIdx++;
  }

  // Ensure minimum 60
  const wonLeads = leads.filter(l => l.status === "Won");
  while (deals.length < 65) {
    const lead = pick(wonLeads);
    const existingQuote = quotations.find(q => q.leadId === lead.id);
    const quote = existingQuote || quotations[0];
    const createdAt = addDays(new Date(lead.createdAt), randInt(5, 20));
    const status: DealStatus = "Won";
    deals.push({
      id: `DEAL-${String(dIdx).padStart(4, "0")}`,
      leadId: lead.id,
      quotationId: quote.id,
      dealNumber: `D${new Date(createdAt).getFullYear()}-${String(dIdx).padStart(4, "0")}`,
      status,
      category: lead.category,
      assignedTo: pick(salesReps).id,
      value: quote.totalAmount,
      probability: 100,
      createdAt: iso(createdAt),
      closedAt: iso(addDays(createdAt, randInt(7, 30))),
      expectedCloseDate: iso(addDays(createdAt, 30)),
      priority: lead.priority,
    });
    dIdx++;
  }

  return deals;
}

// ── Step 5: Orders (80+) ─────────────────────────────────────────────────────
function genOrders(deals: Deal[], leads: Lead[], employees: Employee[]): Order[] {
  const opsReps = employees.filter(e => e.department === "Operations");
  const ORDER_STATUSES: OrderStatus[] = [
    "Completed","Completed","In Progress","In Progress","Pending","Cancelled","On Hold",
  ];
  const wonDeals = deals.filter(d => d.status === "Won");
  const orders: Order[] = [];
  let oIdx = 1;

  for (const deal of wonDeals) {
    const createdAt = addDays(new Date(deal.closedAt ?? deal.createdAt), randInt(1, 3));
    const status = pick(ORDER_STATUSES);
    const completedAt = status === "Completed"
      ? addDays(createdAt, randInt(7, 45))
      : undefined;
    const progress = status === "Completed" ? 100 : status === "In Progress" ? randInt(40, 85) : status === "Pending" ? 15 : status === "On Hold" ? 30 : 0;
    orders.push({
      id: `ORD-${String(oIdx).padStart(4, "0")}`,
      dealId: deal.id,
      leadId: deal.leadId,
      orderNumber: `ORD-${new Date(createdAt).getFullYear()}-${String(oIdx).padStart(4, "0")}`,
      status,
      category: deal.category,
      assignedTo: pick(opsReps).id,
      value: deal.value,
      createdAt: iso(createdAt),
      startedAt: ["In Progress","Completed"].includes(status) ? iso(addDays(createdAt, 1)) : undefined,
      completedAt: completedAt ? iso(completedAt) : undefined,
      dueDate: iso(addDays(createdAt, 30)),
      deliverables: DELIVERABLE_MAP[deal.category] ?? ["Filing", "Certificate"],
      progress,
    });
    oIdx++;
  }

  // Pad to 85
  while (orders.length < 85) {
    const deal = pick(wonDeals);
    const createdAt = addDays(new Date(deal.closedAt ?? deal.createdAt), randInt(3, 10));
    const status: OrderStatus = pick(["Completed","In Progress"]);
    const progress = status === "Completed" ? 100 : randInt(45, 80);
    orders.push({
      id: `ORD-${String(oIdx).padStart(4, "0")}`,
      dealId: deal.id,
      leadId: deal.leadId,
      orderNumber: `ORD-${new Date(createdAt).getFullYear()}-${String(oIdx).padStart(4, "0")}`,
      status,
      category: deal.category,
      assignedTo: pick(opsReps).id,
      value: deal.value,
      createdAt: iso(createdAt),
      startedAt: iso(addDays(createdAt, 1)),
      completedAt: status === "Completed" ? iso(addDays(createdAt, randInt(10, 30))) : undefined,
      dueDate: iso(addDays(createdAt, 30)),
      deliverables: DELIVERABLE_MAP[deal.category] ?? ["Filing", "Certificate"],
      progress,
    });
    oIdx++;
  }

  return orders;
}

// ── Step 6: Invoices (60+) ───────────────────────────────────────────────────
function genInvoices(orders: Order[], deals: Deal[]): Invoice[] {
  const invoices: Invoice[] = [];
  let iIdx = 1;
  const INVOICE_STATUSES: InvoiceStatus[] = [
    "Paid","Paid","Paid","Partially Paid","Partially Paid","Issued","Overdue",
  ];

  // Generate invoice for each Completed order and most In Progress orders
  const eligibleOrders = orders.filter(o =>
    ["Completed", "In Progress"].includes(o.status)
  );

  for (const order of eligibleOrders) {
    if (iIdx > 85) break;
    if (order.status === "In Progress" && rand() > 0.85) continue;
    const deal = deals.find(d => d.id === order.dealId);
    if (!deal) continue;

    const issuedAt = addDays(new Date(order.createdAt), randInt(1, 4));
    const status = pick(INVOICE_STATUSES);
    const totalAmount = order.value;
    const taxRate = 0.18;
    const subtotal = Math.round(totalAmount / (1 + taxRate));
    const taxAmount = totalAmount - subtotal;

    let paidAmount = 0;
    let outstandingAmount = totalAmount;
    let paidAt: string | undefined;

    if (status === "Paid") {
      paidAmount = totalAmount;
      outstandingAmount = 0;
      paidAt = iso(addDays(issuedAt, randInt(3, 15)));
    } else if (status === "Partially Paid") {
      paidAmount = Math.round(totalAmount * (0.35 + rand() * 0.35) / 100) * 100;
      outstandingAmount = totalAmount - paidAmount;
    } else if (status === "Overdue" || status === "Issued") {
      paidAmount = 0;
      outstandingAmount = totalAmount;
    }

    invoices.push({
      id: `INV-${String(iIdx).padStart(4, "0")}`,
      orderId: order.id,
      dealId: deal.id,
      leadId: order.leadId,
      invoiceNumber: `INV-${new Date(issuedAt).getFullYear()}-${String(iIdx).padStart(4, "0")}`,
      status,
      category: order.category,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      paidAmount,
      outstandingAmount,
      issuedAt: iso(issuedAt),
      dueDate: iso(addDays(issuedAt, 30)),
      paidAt,
    });
    iIdx++;
  }

  return invoices;
}

// ── Step 7: Payments (100+) ──────────────────────────────────────────────────
function genPayments(invoices: Invoice[], orders: Order[], deals: Deal[], leads: Lead[]): Payment[] {
  const payments: Payment[] = [];
  let pIdx = 1;

  for (const inv of invoices) {
    if (["Cancelled", "Draft"].includes(inv.status)) continue;

    const order = orders.find(o => o.id === inv.orderId);
    const deal = deals.find(d => d.id === inv.dealId);
    if (!order || !deal) continue;

    const baseDate = new Date(inv.issuedAt);

    if (inv.status === "Paid") {
      // 40% of paid invoices paid in 2 installments (50% advance + 50% delivery), summing exactly to totalAmount
      if (rand() < 0.42 && inv.totalAmount >= 20000) {
        const p1Amount = Math.round((inv.totalAmount * 0.5) / 100) * 100;
        const p2Amount = inv.totalAmount - p1Amount;
        const p1Date = addDays(baseDate, randInt(2, 6));
        const p2Date = addDays(p1Date, randInt(7, 18));

        // Milestone 1 (Completed)
        payments.push({
          id: `PAY-${String(pIdx).padStart(4, "0")}`,
          invoiceId: inv.id,
          orderId: order.id,
          dealId: deal.id,
          leadId: inv.leadId,
          paymentNumber: `PAY-${new Date(p1Date).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
          status: "Completed",
          method: pick(PAYMENT_METHODS),
          amount: p1Amount,
          currency: "INR",
          transactionRef: `TXN${randInt(100000, 999999)}`,
          paidAt: iso(p1Date),
          createdAt: iso(p1Date),
          notes: "Advance installment (50%)",
        });
        pIdx++;

        // Milestone 2 (Completed)
        payments.push({
          id: `PAY-${String(pIdx).padStart(4, "0")}`,
          invoiceId: inv.id,
          orderId: order.id,
          dealId: deal.id,
          leadId: inv.leadId,
          paymentNumber: `PAY-${new Date(p2Date).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
          status: "Completed",
          method: pick(PAYMENT_METHODS),
          amount: p2Amount,
          currency: "INR",
          transactionRef: `TXN${randInt(100000, 999999)}`,
          paidAt: iso(p2Date),
          createdAt: iso(p2Date),
          notes: "Final settlement installment (50%)",
        });
        pIdx++;
      } else {
        // Single full payment
        const paidAt = addDays(baseDate, randInt(3, 15));
        payments.push({
          id: `PAY-${String(pIdx).padStart(4, "0")}`,
          invoiceId: inv.id,
          orderId: order.id,
          dealId: deal.id,
          leadId: inv.leadId,
          paymentNumber: `PAY-${new Date(paidAt).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
          status: "Completed",
          method: pick(PAYMENT_METHODS),
          amount: inv.totalAmount,
          currency: "INR",
          transactionRef: `TXN${randInt(100000, 999999)}`,
          paidAt: iso(paidAt),
          createdAt: iso(paidAt),
          notes: "Full settlement",
        });
        pIdx++;
      }
    } else if (inv.status === "Partially Paid") {
      // Completed partial payment
      const paidAt = addDays(baseDate, randInt(2, 10));
      payments.push({
        id: `PAY-${String(pIdx).padStart(4, "0")}`,
        invoiceId: inv.id,
        orderId: order.id,
        dealId: deal.id,
        leadId: inv.leadId,
        paymentNumber: `PAY-${new Date(paidAt).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
        status: "Completed",
        method: pick(PAYMENT_METHODS),
        amount: inv.paidAmount,
        currency: "INR",
        transactionRef: `TXN${randInt(100000, 999999)}`,
        paidAt: iso(paidAt),
        createdAt: iso(paidAt),
        notes: "Partial payment received",
      });
      pIdx++;

      // Outstanding pending balance
      const dueAt = addDays(baseDate, 30);
      payments.push({
        id: `PAY-${String(pIdx).padStart(4, "0")}`,
        invoiceId: inv.id,
        orderId: order.id,
        dealId: deal.id,
        leadId: inv.leadId,
        paymentNumber: `PAY-${new Date(dueAt).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
        status: "Pending",
        method: pick(PAYMENT_METHODS),
        amount: inv.outstandingAmount,
        currency: "INR",
        paidAt: iso(dueAt),
        createdAt: iso(baseDate),
        notes: "Pending balance payment",
      });
      pIdx++;
    } else if (inv.status === "Overdue") {
      // Failed payment attempt
      const attemptDate = addDays(baseDate, randInt(20, 32));
      payments.push({
        id: `PAY-${String(pIdx).padStart(4, "0")}`,
        invoiceId: inv.id,
        orderId: order.id,
        dealId: deal.id,
        leadId: inv.leadId,
        paymentNumber: `PAY-${new Date(attemptDate).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
        status: "Failed",
        method: pick(PAYMENT_METHODS),
        amount: inv.totalAmount,
        currency: "INR",
        paidAt: iso(attemptDate),
        createdAt: iso(attemptDate),
        notes: "Transaction failed / insufficient funds",
      });
      pIdx++;
    } else if (inv.status === "Issued") {
      // Pending payment scheduled
      const schedDate = addDays(baseDate, 15);
      payments.push({
        id: `PAY-${String(pIdx).padStart(4, "0")}`,
        invoiceId: inv.id,
        orderId: order.id,
        dealId: deal.id,
        leadId: inv.leadId,
        paymentNumber: `PAY-${new Date(schedDate).getFullYear()}-${String(pIdx).padStart(4, "0")}`,
        status: "Pending",
        method: pick(PAYMENT_METHODS),
        amount: inv.totalAmount,
        currency: "INR",
        paidAt: iso(schedDate),
        createdAt: iso(baseDate),
        notes: "Awaiting customer payment",
      });
      pIdx++;
    }
  }

  return payments;
}

// ── Step 8: CRM Activities (200+) ────────────────────────────────────────────
function genActivities(
  leads: Lead[],
  employees: Employee[],
  quotations: Quotation[],
  deals: Deal[],
  invoices: Invoice[],
  payments: Payment[],
): CRMActivity[] {
  const activities: CRMActivity[] = [];
  let aIdx = 1;

  const subjects: Record<CRMActivityType, string[]> = {
    "Call": ["Initial enquiry call", "Follow-up call", "Pricing discussion", "Callback scheduled"],
    "Email": ["Sent introduction email", "Quotation follow-up", "Reminder email", "Document checklist sent"],
    "Meeting": ["Online meeting scheduled", "In-person consultation", "Walkthrough meeting"],
    "Follow-up": ["WhatsApp follow-up", "Phone follow-up", "Pending docs reminder"],
    "Demo": ["Product demo conducted", "Service demo walkthrough"],
    "Proposal Sent": ["Proposal emailed", "Proposal shared via portal"],
    "Contract Signed": ["Agreement signed", "Engagement letter executed"],
    "Invoice Sent": ["Invoice emailed to client", "Invoice shared via WhatsApp"],
    "Payment Received": ["Partial payment received", "Full payment received", "Advance payment received"],
    "Note Added": ["Meeting notes added", "Client preference noted", "Internal note"],
    "Status Changed": ["Lead status updated", "Deal status changed", "Order status updated"],
  };

  for (const lead of leads) {
    const count = randInt(1, 4);
    for (let c = 0; c < count; c++) {
      const type = pick(ACTIVITY_TYPES);
      const createdAt = addDays(new Date(lead.createdAt), randInt(0, 30));
      const relDeal = deals.find(d => d.leadId === lead.id);
      const relQuote = quotations.find(q => q.leadId === lead.id);
      const relInv = invoices.find(i => i.leadId === lead.id);
      const relPay = payments.find(p => p.leadId === lead.id);

      activities.push({
        id: `ACT-${String(aIdx).padStart(4, "0")}`,
        type,
        leadId: lead.id,
        employeeId: lead.assignedTo,
        subject: pick(subjects[type]),
        description: `${type} activity for ${lead.companyName} regarding ${lead.category}.`,
        outcome: rand() > 0.5 ? "Positive response" : undefined,
        relatedDealId: relDeal?.id,
        relatedQuotationId: relQuote?.id,
        relatedOrderId: undefined,
        relatedInvoiceId: relInv?.id,
        relatedPaymentId: type === "Payment Received" ? relPay?.id : undefined,
        createdAt: iso(createdAt),
        completedAt: rand() > 0.3 ? iso(addDays(createdAt, randInt(0, 2))) : undefined,
        duration: ["Call","Meeting","Demo"].includes(type) ? randInt(15, 90) : undefined,
      });
      aIdx++;
    }
  }

  // Pad to 200
  while (activities.length < 210) {
    const lead = pick(leads);
    const type = pick(ACTIVITY_TYPES);
    const createdAt = addDays(new Date("2026-01-01"), randInt(0, 290));
    activities.push({
      id: `ACT-${String(aIdx).padStart(4, "0")}`,
      type,
      leadId: lead.id,
      employeeId: lead.assignedTo,
      subject: pick(subjects[type]),
      description: `${type} activity for ${lead.companyName}.`,
      createdAt: iso(createdAt),
      completedAt: rand() > 0.4 ? iso(addDays(createdAt, 1)) : undefined,
    });
    aIdx++;
  }

  return activities;
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateData(): DashboardData {
  // Reset seed for determinism
  seed = 20240101;

  const employees = genEmployees();
  const leads = genLeads(employees);
  const quotations = genQuotations(leads, employees);
  const deals = genDeals(leads, quotations, employees);
  const orders = genOrders(deals, leads, employees);
  const invoices = genInvoices(orders, deals);
  const payments = genPayments(invoices, orders, deals, leads);
  const activities = genActivities(leads, employees, quotations, deals, invoices, payments);

  return { employees, leads, quotations, deals, orders, invoices, payments, activities };
}

export const dashboardData: DashboardData = generateData();
