/**
 * MLUE B2B Operating System & Customized Water Bottle Platform - Core Type Definitions
 * Brand: MLUE — Every Bottle Tells Your Story.
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'DESIGNER'
  | 'PRODUCTION_MANAGER'
  | 'ACCOUNTS'
  | 'DELIVERY_MANAGER'
  | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  companyName?: string;
  passwordHash?: string;
  active: boolean;
}

export type BottleSize = '500ml' | '1000ml' | '250ml' | '750ml';

export type BottleStyle =
  | 'Round'
  | 'Square'
  | 'Classic Round'
  | 'Heritage Square Ribbed'
  | 'Sleek Nordic Cylinder';

export type LabelStyle =
  | 'MLUE Indigo Signature'
  | 'Matte Black & White'
  | 'Bold Pink Minimal'
  | 'Clean Monochrome'
  | 'Custom Full-Wrap';

export type BusinessType =
  | 'Café'
  | 'Restaurant'
  | 'Luxury Hotel'
  | 'Resort'
  | 'Event / Festival'
  | 'Corporate Office'
  | 'Banquet Hall'
  | 'Wedding Planner'
  | 'Promotional Campaign'
  | 'Gym / Fitness'
  | 'Other';

export type LeadStage =
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'SAMPLE_DESIGN'
  | 'QUOTATION'
  | 'NEGOTIATION'
  | 'ORDER_CONFIRMED'
  | 'PRODUCTION'
  | 'DELIVERED'
  | 'REPEAT_ORDER';

export type LeadSource =
  | 'Website'
  | 'WhatsApp'
  | 'Instagram'
  | 'Referral'
  | 'Cold Outreach'
  | 'Google'
  | 'Walk-in'
  | 'Other';

export interface BottleCustomization {
  bottleSize: BottleSize;
  bottleStyle: BottleStyle;
  capColor: string; // Hex color e.g. '#111118' (Black) or '#EC4899' (Pink)
  labelColor: string; // Hex color e.g. '#0B0B10' or '#6366F1'
  labelStyle: LabelStyle;
  brandName: string;
  tagline: string;
  logoUrl?: string;
  artworkUrl?: string;
  qrCodeText?: string;
  instagramHandle?: string;
  promoMessage?: string;
  finish: 'Gloss' | 'Matte' | 'Metallic Foil' | 'Clear Transparent';
  designNotes?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city: string;
  businessType: BusinessType;
  bottleSize: BottleSize;
  bottleStyle: BottleStyle;
  quantity: number;
  requiredDate?: string;
  source: LeadSource;
  stage: LeadStage;
  assignedTo?: string; // User ID / name
  lastContactAt?: string;
  nextFollowUpAt?: string;
  nextFollowUpType?: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Sample delivery' | 'Quotation Follow-up' | 'Payment Follow-up' | 'General';
  estimatedValue: number;
  leadScore: number; // 0 - 100
  customization?: BottleCustomization;
  deliveryLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Activity {
  id: string;
  leadId?: string;
  customerId?: string;
  orderId?: string;
  userId: string;
  userName: string;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'NOTE' | 'QUOTE' | 'DESIGN' | 'FOLLOW_UP' | 'STATUS_CHANGE';
  summary: string;
  details?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  leadId?: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  instagram?: string;
  businessType: BusinessType;
  gstin?: string;
  billingAddress: string;
  shippingAddress: string;
  city: string;
  state: string;
  pinCode: string;
  assignedSalesperson?: string;
  customerSince: string;
  notes?: string;
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
  outstandingAmount: number;
  lastOrderDate?: string;
  repeatOrderCount: number;
  isDemo?: boolean;
}

export type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'NEGOTIATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CONVERTED_TO_ORDER';

export interface QuoteItem {
  id: string;
  bottleSize: BottleSize;
  bottleStyle: BottleStyle;
  labelType: string;
  quantity: number;
  unitBaseCost: number;
  unitLabelCost: number;
  unitPrintingCost: number;
  unitPackagingCost: number;
  unitTransportCost: number;
  unitDesignCost: number;
  unitMargin: number;
  unitPrice: number; // final selling price per bottle
  totalPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  leadId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  items: QuoteItem[];
  subtotal: number;
  discountAmount: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  totalInternalCost: number; // hidden from client
  estimatedProfit: number; // hidden from client
  profitMarginPct: number; // hidden from client
  status: QuoteStatus;
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  termsAndConditions: string;
  validUntil: string;
  customizationDetails?: BottleCustomization;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  isDemo?: boolean;
}

export type OrderStatus =
  | 'ORDER_CONFIRMED'
  | 'DESIGN_PENDING'
  | 'DESIGN_IN_PROGRESS'
  | 'ARTWORK_SENT'
  | 'ARTWORK_APPROVED'
  | 'PRODUCTION_QUEUED'
  | 'IN_PRODUCTION'
  | 'QUALITY_CHECK'
  | 'READY_TO_DISPATCH'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CLOSED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'REFUNDED';
export type DeliveryStatus = 'PENDING' | 'READY' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';

export interface Order {
  id: string;
  orderNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  businessName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  bottleSize: BottleSize;
  bottleStyle: BottleStyle;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  currentArtworkVersion?: string;
  artworkApproved: boolean;
  artworkApprovedAt?: string;
  artworkApprovedBy?: string;
  requiredDate: string;
  assignedStaff?: string;
  trackingToken: string; // secure public tracking token
  courierPartner?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  customization?: BottleCustomization;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface DesignProject {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  businessName: string;
  designerName?: string;
  status: 'DESIGN_REQUESTED' | 'DESIGN_IN_PROGRESS' | 'INTERNAL_REVIEW' | 'SENT_TO_CUSTOMER' | 'REVISION_REQUESTED' | 'APPROVED' | 'FINAL_ARTWORK' | 'DRAFT' | 'PENDING_CLIENT_REVIEW';
  assignedDesigner?: string;
  versions: {
    id?: string;
    version?: string;
    versionNumber?: string;
    uploadedAt: string;
    uploadedBy: string;
    previewUrl?: string;
    fileUrl?: string;
    printFileUrl?: string;
    notes?: string;
    feedback?: string;
    approved?: boolean;
    status?: string;
    clientFeedback?: string;
  }[];
  activeVersion: string;
  logoUrl?: string;
  referenceNotes?: string;
  approvalToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionJob {
  id: string;
  jobId?: string;
  orderId: string;
  orderNumber: string;
  customerName?: string;
  businessName: string;
  bottleSize: BottleSize;
  targetQuantity?: number;
  line?: string;
  capColor?: string;
  status?: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  orderedQuantity: number;
  producedQuantity: number;
  rejectedQuantity: number;
  acceptedQuantity: number;
  stage: 'QUEUED' | 'MATERIAL_READY' | 'PRINTING' | 'LABELING' | 'PACKAGING' | 'QUALITY_CHECK' | 'READY';
  supplierOrPlant: string;
  startDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  assignedStaff?: string;
  qualityCheckNotes?: string;
  isDemo?: boolean;
}

export interface PaymentRecord {
  id: string;
  receiptNumber?: string;
  orderId: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentType?: string;
  transactionReference: string;
  paymentDate?: string;
  status?: string;
  notes?: string;
  recordedBy?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Other';
  transactionReference: string;
  paymentDate: string;
  notes?: string;
  recordedBy: string;
}

export interface DeliveryRecord {
  id: string;
  deliveryId?: string;
  deliveryNumber?: string;
  orderId: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  destinationCity?: string;
  cartonCount?: number;
  bottlesCount?: number;
  shippingAddress?: string;
  contactPhone?: string;
  courierPartner: string;
  trackingNumber: string;
  dispatchDate?: string;
  estimatedArrival?: string;
  estimatedDelivery?: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  status: DeliveryStatus;
  notes?: string;
}

export interface PricingRule {
  id: string;
  bottleSize: BottleSize;
  bottleStyle: BottleStyle;
  moq: number; // Minimum Order Quantity in bottles
  moqLiters?: number; // Volume based MOQ e.g. 1000L
  baseBottleCost: number; // bottle raw material
  waterProductionCost?: number; // water purification & bottling
  labelCost: number; // label material
  printingCost: number; // digital/flexo print
  packagingCost: number; // corrugated boxes & partition
  designCost: number; // graphic prepress
  capCost?: number; // cap customization
  deliveryCostPerUnit: number; // logistics
  setupCharges?: number;
  taxPct: number; // 18% GST (if applicable)
  targetMarginPct: number; // e.g. 35%
  volumeDiscounts?: { minVolumeLiters: number; discountPct: number }[];
  active: boolean;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  itemName?: string;
  category: 'Bottle' | 'Cap' | 'Label' | 'Packaging' | 'Carton' | 'Other';
  size?: string;
  supplier?: string;
  currentStock: number;
  availableQuantity?: number;
  reservedStock: number;
  reorderLevel: number;
  minReorderLevel?: number;
  unitCost: number;
  unit: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  productsSupplied: string[];
  moq: number;
  leadTimeDays: number;
  paymentTerms: string;
  active: boolean;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  customerName?: string;
  leadId?: string;
  orderId?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  type?: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Sample Delivery' | 'Quotation Follow-up' | 'Payment Follow-up' | 'General' | 'CALL';
  notes?: string;
  createdAt?: string;
}

export interface ComplianceRecord {
  id: string;
  title: string;
  category?: 'FSSAI License' | 'BIS / ISI Standard' | 'Water Test Report' | 'Label Declarations' | 'Factory Audit' | 'Other';
  licenceOrDocNumber: string;
  issuingAuthority: string;
  issuedDate?: string;
  expiryDate: string;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'EXPIRED' | 'REQUIRES_REVIEW' | 'VALID' | 'Verification Required';
  documentUrl?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName?: string;
  userRole?: UserRole;
  action: string;
  entity?: string;
  entityType?: string;
  entityId: string;
  details: string;
  performedBy?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  trigger: string;
  body: string;
}

export interface CompanySettings {
  companyName: string;
  brandName: string;
  brandTagline: string;
  secondaryTagline?: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  deliveryServiceArea: string;
  waterSourcePartner: string;
  gstin: string;
  pan?: string;
  fssaiLicence?: string;
  bisLicence?: string;
  complianceStatus?: string;
  moqLiters: number;
  defaultCurrency: string; // 'INR (₹)'
  defaultAdvancePaymentPct: number; // e.g. 50%
  defaultBalanceDueDays: number;
  leadNotificationEmail: string;
}
