// Shared primitives
export type ServiceCategory =
  | "Private Limited Registration"
  | "LLP Registration"
  | "GST"
  | "Trademark"
  | "Startup India Registration"
  | "ISO Certification"
  | "Annual Compliance"
  | "Other Services";

export type LeadSource =
  | "Google Ads"
  | "Website"
  | "Referral"
  | "Social Media"
  | "Just Dial"
  | "Other";

export type Priority = "Low" | "Medium" | "High";
export type Department = "Sales" | "Operations" | "Finance" | "Management";

// Employee
export type EmployeeRole =
  | "Sales Executive"
  | "Senior Sales Executive"
  | "Business Development Manager"
  | "Operations Executive"
  | "Operations Manager"
  | "Finance Executive"
  | "Finance Manager"
  | "General Manager";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: Department;
  joinedAt: string;
  avatarInitials: string;
  targetRevenue: number;
  isActive: boolean;
}

// Lead
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Unqualified";

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  source: LeadSource;
  category: ServiceCategory;
  status: LeadStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  expectedValue: number;
  notes?: string;
}

// Quotation
export type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Expired";

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  leadId: string;
  quoteNumber: string;
  status: QuotationStatus;
  category: ServiceCategory;
  assignedTo: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  validUntil: string;
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  notes?: string;
}

// Deal
export type DealStatus = "Active" | "Won" | "Lost" | "On Hold" | "Cancelled";

export interface Deal {
  id: string;
  leadId: string;
  quotationId: string;
  dealNumber: string;
  status: DealStatus;
  category: ServiceCategory;
  assignedTo: string;
  value: number;
  probability: number;
  createdAt: string;
  closedAt?: string;
  expectedCloseDate: string;
  notes?: string;
  priority?: Priority;
}

// Order
export type OrderStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "On Hold";

export interface Order {
  id: string;
  dealId: string;
  leadId: string;
  orderNumber: string;
  status: OrderStatus;
  category: ServiceCategory;
  assignedTo: string;
  value: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  dueDate: string;
  deliverables: string[];
  notes?: string;
  progress?: number;
}

// Invoice
export type InvoiceStatus =
  | "Draft"
  | "Issued"
  | "Partially Paid"
  | "Paid"
  | "Overdue"
  | "Cancelled"
  | "Written Off";

export interface Invoice {
  id: string;
  orderId: string;
  dealId: string;
  leadId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  category: ServiceCategory;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
}

// Payment
export type PaymentStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Refunded"
  | "Cancelled";

export type PaymentMethod =
  | "Bank Transfer"
  | "UPI"
  | "Cheque"
  | "Cash"
  | "Credit Card"
  | "Debit Card"
  | "Demand Draft";

export interface Payment {
  id: string;
  invoiceId: string;
  orderId: string;
  dealId: string;
  leadId: string;
  paymentNumber: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  currency: "INR";
  transactionRef?: string;
  paidAt: string;
  createdAt: string;
  notes?: string;
}

// CRM Activity
export type CRMActivityType =
  | "Call"
  | "Email"
  | "Meeting"
  | "Follow-up"
  | "Demo"
  | "Proposal Sent"
  | "Contract Signed"
  | "Invoice Sent"
  | "Payment Received"
  | "Note Added"
  | "Status Changed";

export interface CRMActivity {
  id: string;
  type: CRMActivityType;
  leadId: string;
  employeeId: string;
  subject: string;
  description: string;
  outcome?: string;
  relatedDealId?: string;
  relatedQuotationId?: string;
  relatedOrderId?: string;
  relatedInvoiceId?: string;
  relatedPaymentId?: string;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  duration?: number;
}

// Analytics / Derived types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface KPIComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

export interface CategoryBreakdown {
  category: ServiceCategory;
  count: number;
  value: number;
  percentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TeamPerformance {
  employee: Employee;
  leadsAssigned: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  target: number;
  achievementPercent: number;
}

export interface DashboardData {
  leads: Lead[];
  quotations: Quotation[];
  deals: Deal[];
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
  employees: Employee[];
  activities: CRMActivity[];
}

export interface FilterState {
  dateRange: DateRange;
  employeeId: string | null;
  department: Department | null;
  category: ServiceCategory | null;
}

export type ActiveView =
  | "overview"
  | "leads"
  | "quotations"
  | "deals"
  | "orders"
  | "payments"
  | "team";

