/**
 * Central State & Business Logic Store
 * Shares single source of truth between Public Website and Admin Operating System
 */

import {
  Lead,
  Customer,
  Quote,
  Order,
  Product,
  DesignProject,
  ProductionJob,
  PaymentTransaction,
  DeliveryRecord,
  PricingRule,
  InventoryItem,
  Supplier,
  Task,
  ComplianceRecord,
  AuditLog,
  CompanySettings,
  UserProfile,
  UserRole,
  BottleCustomization,
  LeadStage,
  OrderStatus,
  WhatsAppTemplate,
} from '../types';
import { showToast } from '../utils/toast';
import {
  saveDocument,
  deleteDocument,
  subscribeToCollection,
  subscribeToCompanySettings,
  seedInitialFirestoreData,
} from './firestoreDb';
import {
  INITIAL_CATALOG_PRODUCTS,
  syncUserLeads,
  syncUserOrders,
  syncProducts,
  fetchUserLeads,
  fetchUserOrders,
  fetchProducts,
  createLeadInFirestore,
  updateLeadInFirestore,
  deleteLeadFromFirestore,
  createOrderInFirestore,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  seedInitialProductsIfEmpty,
} from './firestoreService';
import {
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  initAuthStateListener,
  getCurrentAuthUser,
} from './firebaseAuth';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'H2O Energy & Custom Bottling Co.',
  brandName: 'H2O',
  brandTagline: 'Next-Gen Energy Fuel & Custom Packaging Studio.',
  secondaryTagline: 'Your Brand. On Every Table.',
  ownerName: 'VINAYAK PRATAP',
  email: 'vinayakgurjar05@gmail.com',
  phone: '8827275367',
  whatsappNumber: '8827275367',
  website: 'https://h2oenergy.in',
  address: 'Indore, Madhya Pradesh, India',
  city: 'Indore',
  state: 'Madhya Pradesh',
  country: 'India',
  deliveryServiceArea: 'Indore',
  waterSourcePartner: 'MASAR BEVERAGES',
  gstin: '',
  pan: '',
  fssaiLicence: '',
  bisLicence: '',
  complianceStatus: 'Verification Required',
  moqLiters: 1000,
  defaultCurrency: 'INR (₹)',
  defaultAdvancePaymentPct: 50,
  defaultBalanceDueDays: 7,
  leadNotificationEmail: 'vinayakgurjar05@gmail.com',
};

export const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'pr-500-round',
    bottleSize: '500ml',
    bottleStyle: 'Round',
    moq: 2000,
    moqLiters: 1000,
    baseBottleCost: 3.8,
    waterProductionCost: 1.2,
    labelCost: 1.2,
    printingCost: 0.9,
    packagingCost: 0.6,
    designCost: 0.2,
    capCost: 0.5,
    deliveryCostPerUnit: 0.8,
    taxPct: 18,
    targetMarginPct: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pr-500-square',
    bottleSize: '500ml',
    bottleStyle: 'Square',
    moq: 2000,
    moqLiters: 1000,
    baseBottleCost: 4.2,
    waterProductionCost: 1.2,
    labelCost: 1.2,
    printingCost: 0.9,
    packagingCost: 0.6,
    designCost: 0.2,
    capCost: 0.5,
    deliveryCostPerUnit: 0.8,
    taxPct: 18,
    targetMarginPct: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pr-1000-round',
    bottleSize: '1000ml',
    bottleStyle: 'Round',
    moq: 1000,
    moqLiters: 1000,
    baseBottleCost: 5.8,
    waterProductionCost: 1.8,
    labelCost: 1.5,
    printingCost: 1.1,
    packagingCost: 0.9,
    designCost: 0.2,
    capCost: 0.6,
    deliveryCostPerUnit: 1.2,
    taxPct: 18,
    targetMarginPct: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pr-1000-square',
    bottleSize: '1000ml',
    bottleStyle: 'Square',
    moq: 1000,
    moqLiters: 1000,
    baseBottleCost: 6.2,
    waterProductionCost: 1.8,
    labelCost: 1.5,
    printingCost: 1.1,
    packagingCost: 0.9,
    designCost: 0.2,
    capCost: 0.6,
    deliveryCostPerUnit: 1.2,
    taxPct: 18,
    targetMarginPct: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    businessName: 'The Grand Sayaji Hospitality',
    contactName: 'Rajesh Sharma',
    phone: '+91 98270 11223',
    whatsapp: '+91 98270 11223',
    email: 'events@sayajiindore.com',
    city: 'Indore',
    businessType: 'Luxury Hotel',
    bottleSize: '500ml',
    bottleStyle: 'Square',
    quantity: 2000,
    requiredDate: '2026-10-15',
    source: 'Website',
    stage: 'QUOTATION',
    assignedTo: 'Vinayak Pratap',
    lastContactAt: '2026-09-18T10:30:00Z',
    nextFollowUpAt: '2026-09-22T11:00:00Z',
    nextFollowUpType: 'Quotation Follow-up',
    estimatedValue: 28000,
    leadScore: 92,
    customization: {
      bottleSize: '500ml',
      bottleStyle: 'Square',
      capColor: '#111118', // Black
      labelColor: '#111118',
      labelStyle: 'MLUE Indigo Signature',
      brandName: 'SAYAJI INDORE',
      tagline: 'Luxury Hospitality & Banquet Water',
      finish: 'Matte',
      designNotes: 'Require clean executive branding for presidential suites',
    },
    deliveryLocation: 'Vijay Nagar, Indore',
    notes: 'Premium 5-star hospitality property in Indore. Wants custom square bottles meeting 1000L MOQ requirement.',
    createdAt: '2026-09-14T09:12:00Z',
    updatedAt: '2026-09-18T10:30:00Z',
    isDemo: true,
  },
  {
    id: 'lead-102',
    businessName: 'Brew & Bean Artisan Café',
    contactName: 'Pooja Verma',
    phone: '+91 98270 33445',
    whatsapp: '+91 98270 33445',
    email: 'pooja@brewandbean.in',
    city: 'Indore',
    businessType: 'Café',
    bottleSize: '500ml',
    bottleStyle: 'Round',
    quantity: 2000,
    requiredDate: '2026-10-05',
    source: 'Instagram',
    stage: 'NEGOTIATION',
    assignedTo: 'Vinayak Pratap',
    lastContactAt: '2026-09-19T14:00:00Z',
    nextFollowUpAt: '2026-09-21T16:00:00Z',
    nextFollowUpType: 'Call',
    estimatedValue: 26000,
    leadScore: 84,
    customization: {
      bottleSize: '500ml',
      bottleStyle: 'Round',
      capColor: '#EC4899', // Pink
      labelColor: '#050507',
      labelStyle: 'Bold Pink Minimal',
      brandName: 'BREW & BEAN',
      tagline: 'Craft Café & Roastery Water',
      finish: 'Gloss',
    },
    deliveryLocation: 'Chhappan Dukan, Indore',
    notes: 'Boutique café brand in Indore. 2000 x 500ml meets 1000L MOQ. High repeat monthly potential.',
    createdAt: '2026-09-15T11:45:00Z',
    updatedAt: '2026-09-19T14:00:00Z',
    isDemo: true,
  },
  {
    id: 'lead-103',
    businessName: 'Brilliant Convention Centre',
    contactName: 'Kavita Patel',
    phone: '+91 98270 55667',
    whatsapp: '+91 98270 55667',
    email: 'kavita@brilliantindore.com',
    city: 'Indore',
    businessType: 'Event / Festival',
    bottleSize: '1000ml',
    bottleStyle: 'Round',
    quantity: 1000,
    requiredDate: '2026-11-20',
    source: 'Referral',
    stage: 'SAMPLE_DESIGN',
    assignedTo: 'Vinayak Pratap',
    lastContactAt: '2026-09-17T15:00:00Z',
    nextFollowUpAt: '2026-09-23T10:00:00Z',
    nextFollowUpType: 'Sample delivery',
    estimatedValue: 22000,
    leadScore: 94,
    customization: {
      bottleSize: '1000ml',
      bottleStyle: 'Round',
      capColor: '#111118',
      labelColor: '#050507',
      labelStyle: 'MLUE Indigo Signature',
      brandName: 'CENTRAL INDIA SUMMIT',
      tagline: 'National Conclave 2026',
      finish: 'Matte',
    },
    deliveryLocation: 'Brilliant Convention Centre, Scheme 78, Indore',
    notes: 'National summit in Indore. 1000 x 1L bottles meeting 1000L MOQ requirement.',
    createdAt: '2026-09-16T12:00:00Z',
    updatedAt: '2026-09-17T15:00:00Z',
    isDemo: true,
  },
  {
    id: 'lead-104',
    businessName: 'Medallion Dining & Bistro',
    contactName: 'Amit Deshmukh',
    phone: '+91 98270 77889',
    whatsapp: '+91 98270 77889',
    email: 'admin@medallionindore.com',
    city: 'Indore',
    businessType: 'Restaurant',
    bottleSize: '500ml',
    bottleStyle: 'Square',
    quantity: 2000,
    requiredDate: '2026-10-25',
    source: 'Google',
    stage: 'NEW_LEAD',
    assignedTo: 'Vinayak Pratap',
    estimatedValue: 28000,
    leadScore: 75,
    customization: {
      bottleSize: '500ml',
      bottleStyle: 'Square',
      capColor: '#111118',
      labelColor: '#111118',
      labelStyle: 'Matte Black & White',
      brandName: 'MEDALLION',
      tagline: 'Artisanal Dining Experience',
      finish: 'Matte',
    },
    deliveryLocation: 'New Palasia, Indore',
    notes: 'Fine dining destination in Indore. Glass-clarity virgin PET square bottles.',
    createdAt: '2026-09-19T08:30:00Z',
    updatedAt: '2026-09-19T08:30:00Z',
    isDemo: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-201',
    leadId: 'lead-099',
    businessName: 'Medallion Fine Dining',
    contactName: 'Chef Marc',
    phone: '+91 98270 88990',
    whatsapp: '+91 98270 88990',
    email: 'chef@medallionindore.com',
    website: 'https://medallionindore.com',
    businessType: 'Restaurant',
    billingAddress: '54 New Palasia',
    shippingAddress: '54 New Palasia',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pinCode: '452001',
    assignedSalesperson: 'Vinayak Pratap',
    customerSince: '2026-07-10T00:00:00Z',
    notes: 'Boutique dining in Indore. Reorders 2,000 units (1,000L) monthly.',
    totalOrders: 3,
    totalQuantity: 6000,
    totalRevenue: 84000,
    outstandingAmount: 0,
    lastOrderDate: '2026-09-02T10:00:00Z',
    repeatOrderCount: 2,
    isDemo: true,
  },
  {
    id: 'cust-202',
    businessName: 'Indore Grand Banquet Hall',
    contactName: 'Sunita Verma',
    phone: '+91 98270 66778',
    whatsapp: '+91 98270 66778',
    email: 'banquet@indoregrand.com',
    businessType: 'Resort',
    billingAddress: 'AB Road, Near Bypass',
    shippingAddress: 'AB Road, Near Bypass',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pinCode: '452010',
    assignedSalesperson: 'Vinayak Pratap',
    customerSince: '2026-08-01T00:00:00Z',
    notes: 'High volume wedding and banquet venue in Indore.',
    totalOrders: 2,
    totalQuantity: 4000,
    totalRevenue: 56000,
    outstandingAmount: 0,
    lastOrderDate: '2026-08-25T14:30:00Z',
    repeatOrderCount: 1,
    isDemo: true,
  },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-301',
    quoteNumber: 'QUO-2026-0042',
    leadId: 'lead-101',
    customerId: 'cust-203',
    customerName: 'Rajesh Sharma',
    customerEmail: 'events@sayajiindore.com',
    customerPhone: '+91 98270 11223',
    businessName: 'The Grand Sayaji Hospitality',
    items: [
      {
        id: 'qi-1',
        bottleSize: '500ml',
        bottleStyle: 'Square',
        labelType: 'MLUE Indigo Signature',
        quantity: 2000,
        unitBaseCost: 4.2,
        unitLabelCost: 1.2,
        unitPrintingCost: 0.9,
        unitPackagingCost: 0.6,
        unitTransportCost: 0.8,
        unitDesignCost: 0.2,
        unitMargin: 2.76,
        unitPrice: 10.66,
        totalPrice: 21320,
      },
    ],
    subtotal: 21320,
    discountAmount: 1000,
    taxRate: 18,
    taxAmount: 3657.6,
    shippingCost: 0, // Included for Indore delivery
    totalAmount: 23977.6,
    totalInternalCost: 15800,
    estimatedProfit: 5520,
    profitMarginPct: 27.1,
    status: 'SENT',
    paymentTerms: '50% advance confirmation, 50% prior to dispatch.',
    deliveryTerms: 'Doorstep delivery to Indore within 7-10 business days from artwork approval.',
    notes: 'Includes bespoke MLUE square silhouette with hotel branding.',
    termsAndConditions:
      'Prices valid for 15 days. Final artwork approval is mandatory prior to production.',
    validUntil: '2026-10-04T00:00:00Z',
    customizationDetails: {
      bottleSize: '500ml',
      bottleStyle: 'Square',
      capColor: '#111118',
      labelColor: '#111118',
      labelStyle: 'MLUE Indigo Signature',
      brandName: 'SAYAJI INDORE',
      tagline: 'Luxury Hospitality & Banquet Water',
      finish: 'Matte',
    },
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    sentAt: '2026-09-18T10:15:00Z',
    isDemo: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-401',
    orderNumber: 'ORD-2026-088',
    quoteId: 'quote-298',
    customerId: 'cust-201',
    customerName: 'Chef Marc',
    businessName: 'Medallion Fine Dining',
    customerPhone: '+91 98270 88990',
    customerEmail: 'chef@medallionindore.com',
    shippingAddress: '54 New Palasia, Indore 452001',
    city: 'Indore',
    bottleSize: '500ml',
    bottleStyle: 'Square',
    quantity: 2000,
    unitPrice: 11.5,
    totalAmount: 27140, // including GST
    paidAmount: 27140,
    paymentStatus: 'PAID',
    orderStatus: 'IN_PRODUCTION',
    deliveryStatus: 'PENDING',
    currentArtworkVersion: 'V2_FINAL',
    artworkApproved: true,
    artworkApprovedAt: '2026-09-12T14:00:00Z',
    artworkApprovedBy: 'Chef Marc',
    requiredDate: '2026-09-26',
    assignedStaff: 'Vinayak Pratap',
    trackingToken: 'TRK-MED-98821',
    courierPartner: 'MLUE Direct Fleet (Indore)',
    customization: {
      bottleSize: '500ml',
      bottleStyle: 'Square',
      capColor: '#111118',
      labelColor: '#111118',
      labelStyle: 'Matte Black & White',
      brandName: 'MEDALLION',
      tagline: 'Artisanal Dining Experience',
      finish: 'Matte',
    },
    internalNotes: 'Batch #B24 running on Line 1. Glass-clarity virgin PET bottled with MASAR BEVERAGES.',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
    isDemo: true,
  },
  {
    id: 'ord-402',
    orderNumber: 'ORD-2026-089',
    customerId: 'cust-202',
    customerName: 'Sunita Verma',
    businessName: 'Indore Grand Banquet Hall',
    customerPhone: '+91 98270 66778',
    customerEmail: 'banquet@indoregrand.com',
    shippingAddress: 'AB Road, Near Bypass, Indore 452010',
    city: 'Indore',
    bottleSize: '1000ml',
    bottleStyle: 'Round',
    quantity: 1000,
    unitPrice: 15.5,
    totalAmount: 18290,
    paidAmount: 10000,
    paymentStatus: 'PARTIAL',
    orderStatus: 'ARTWORK_APPROVED',
    deliveryStatus: 'PENDING',
    currentArtworkVersion: 'V1',
    artworkApproved: true,
    artworkApprovedAt: '2026-09-19T09:30:00Z',
    artworkApprovedBy: 'Sunita Verma',
    requiredDate: '2026-10-02',
    assignedStaff: 'Vinayak Pratap',
    trackingToken: 'TRK-IGB-33214',
    customization: {
      bottleSize: '1000ml',
      bottleStyle: 'Round',
      capColor: '#111118',
      labelColor: '#050507',
      labelStyle: 'MLUE Indigo Signature',
      brandName: 'INDORE GRAND',
      tagline: 'Celebration & Banquet Water',
      finish: 'Matte',
    },
    createdAt: '2026-09-17T12:00:00Z',
    updatedAt: '2026-09-19T09:30:00Z',
    isDemo: true,
  },
];

export const INITIAL_DESIGN_PROJECTS: DesignProject[] = [
  {
    id: 'des-501',
    orderId: 'ord-401',
    orderNumber: 'ORD-2026-088',
    customerName: 'Chef Marc',
    businessName: 'Medallion Fine Dining',
    status: 'APPROVED',
    assignedDesigner: 'MLUE Creative Studio',
    versions: [
      {
        version: 'V1',
        uploadedAt: '2026-09-11T10:00:00Z',
        uploadedBy: 'MLUE Creative Studio',
        previewUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
        approved: false,
        clientFeedback: 'Increase Medallion typography tracking and deepen the dark contrast.',
      },
      {
        version: 'V2_FINAL',
        uploadedAt: '2026-09-12T11:30:00Z',
        uploadedBy: 'MLUE Creative Studio',
        previewUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
        printFileUrl: 'https://mlue.in/prints/MED-V2-cmyk.pdf',
        approved: true,
      },
    ],
    activeVersion: 'V2_FINAL',
    approvalToken: 'appr-med-8821',
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-12T14:00:00Z',
  },
];

export const INITIAL_PRODUCTION_JOBS: ProductionJob[] = [
  {
    id: 'prod-601',
    orderId: 'ord-401',
    orderNumber: 'ORD-2026-088',
    businessName: 'Medallion Fine Dining',
    bottleSize: '500ml',
    orderedQuantity: 2000,
    producedQuantity: 1800,
    rejectedQuantity: 10,
    acceptedQuantity: 1790,
    stage: 'PRINTING',
    supplierOrPlant: 'MASAR BEVERAGES (Partner Plant Line 1)',
    startDate: '2026-09-18T08:00:00Z',
    expectedCompletionDate: '2026-09-22T18:00:00Z',
    assignedStaff: 'Vinayak Pratap',
    qualityCheckNotes: 'Pressure seal and optical clarity test passed 100%.',
    isDemo: true,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'PET-500-RND',
    name: '500ml Virgin PET Round Bottles',
    category: 'Bottle',
    size: '500ml',
    supplier: 'MASAR BEVERAGES (Partner Plant)',
    currentStock: 22000,
    reservedStock: 4000,
    reorderLevel: 5000,
    unitCost: 3.8,
    unit: 'pcs',
  },
  {
    id: 'inv-2',
    sku: 'PET-500-SQ',
    name: '500ml Virgin PET Square Bottles',
    category: 'Bottle',
    size: '500ml',
    supplier: 'MASAR BEVERAGES (Partner Plant)',
    currentStock: 18000,
    reservedStock: 3000,
    reorderLevel: 5000,
    unitCost: 4.2,
    unit: 'pcs',
  },
  {
    id: 'inv-3',
    sku: 'PET-1000-RND',
    name: '1L Virgin PET Round Bottles',
    category: 'Bottle',
    size: '1000ml',
    supplier: 'MASAR BEVERAGES (Partner Plant)',
    currentStock: 12000,
    reservedStock: 2000,
    reorderLevel: 3000,
    unitCost: 5.8,
    unit: 'pcs',
  },
  {
    id: 'inv-4',
    sku: 'PET-1000-SQ',
    name: '1L Virgin PET Square Bottles',
    category: 'Bottle',
    size: '1000ml',
    supplier: 'MASAR BEVERAGES (Partner Plant)',
    currentStock: 10000,
    reservedStock: 1500,
    reorderLevel: 3000,
    unitCost: 6.2,
    unit: 'pcs',
  },
  {
    id: 'inv-5',
    sku: 'CAP-MLUE-BLK',
    name: '30mm Tamper-Evident Black Caps (#111118)',
    category: 'Cap',
    supplier: 'Crown Closures India',
    currentStock: 35000,
    reservedStock: 6000,
    reorderLevel: 8000,
    unitCost: 0.5,
    unit: 'pcs',
  },
  {
    id: 'inv-6',
    sku: 'CAP-MLUE-PNK',
    name: '30mm Tamper-Evident Pink Caps (#EC4899)',
    category: 'Cap',
    supplier: 'Crown Closures India',
    currentStock: 28000,
    reservedStock: 4000,
    reorderLevel: 6000,
    unitCost: 0.5,
    unit: 'pcs',
  },
];

export const INITIAL_COMPLIANCE_RECORDS: ComplianceRecord[] = [
  {
    id: 'comp-1',
    title: 'FSSAI Central Food Safety License',
    category: 'FSSAI License',
    licenceOrDocNumber: 'Pending Upload / Entry',
    issuingAuthority: 'Food Safety and Standards Authority of India (FSSAI)',
    expiryDate: '',
    status: 'Verification Required',
    notes: 'Document verification required. Upload official certification copy in Admin.',
  },
  {
    id: 'comp-2',
    title: 'Bureau of Indian Standards (BIS / ISI Certification)',
    category: 'BIS / ISI Standard',
    licenceOrDocNumber: 'Pending Upload / Entry',
    issuingAuthority: 'Bureau of Indian Standards (BIS)',
    expiryDate: '',
    status: 'Verification Required',
    notes: 'Document verification required. Upload official certification copy in Admin.',
  },
  {
    id: 'comp-3',
    title: 'GSTIN Registration',
    category: 'Other',
    licenceOrDocNumber: 'Not provided / not applicable at this stage',
    issuingAuthority: 'Goods and Services Tax Network',
    expiryDate: '',
    status: 'Verification Required',
    notes: 'Statutory tax registration status pending verification by administrator.',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Follow-up on Quotation QUO-2026-0042',
    assignedTo: 'Vinayak Pratap',
    customerName: 'The Grand Sayaji Hospitality',
    leadId: 'lead-101',
    dueDate: '2026-09-22',
    priority: 'HIGH',
    status: 'TODO',
    type: 'Quotation Follow-up',
    notes: 'Discuss delivery schedule in Indore and sign-off on black cap sample.',
    createdAt: '2026-09-18T10:30:00Z',
  },
  {
    id: 'task-2',
    title: 'Dispatch sample bottle kit to Brilliant Convention Centre',
    assignedTo: 'Vinayak Pratap',
    customerName: 'Kavita Patel',
    leadId: 'lead-103',
    dueDate: '2026-09-23',
    priority: 'URGENT',
    status: 'TODO',
    type: 'Sample Delivery',
    notes: 'Include 1L round bottle with custom MLUE indigo label mockup.',
    createdAt: '2026-09-17T15:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-19T09:30:00Z',
    userName: 'Chef Marc (Client)',
    userRole: 'VIEWER',
    action: 'ARTWORK_APPROVED',
    entity: 'Order',
    entityId: 'ORD-2026-089',
    details: 'Customer verified and approved V1 design online.',
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-18T10:15:00Z',
    userName: 'Vinayak Pratap',
    userRole: 'SUPER_ADMIN',
    action: 'QUOTE_SENT',
    entity: 'Quote',
    entityId: 'QUO-2026-0042',
    details: 'Quotation sent to The Grand Sayaji Hospitality via Email & WhatsApp.',
  },
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wa-1',
    name: 'New Inquiry Welcome & 3D Catalog Link',
    trigger: 'NEW_LEAD',
    body: 'Hello {{CustomerName}}! Thank you for reaching out to MLUE Custom Branded Water. We have received your inquiry for {{BusinessName}}. You can preview custom bottle silhouettes and create your 3D digital label in real-time here: {{CustomizerLink}}.\n\nOur concierge team will connect shortly.',
  },
  {
    id: 'wa-2',
    name: 'Formal Quotation & Production Spec',
    trigger: 'QUOTATION',
    body: 'Dear {{CustomerName}},\n\nPlease find our formal commercial quotation {{QuoteNumber}} for {{BusinessName}}. Turn every bottle into your brand touchpoint! Reply to confirm and begin digital artwork generation.',
  },
  {
    id: 'wa-3',
    name: 'Digital Label Proof Sign-off Request',
    trigger: 'ARTWORK_READY',
    body: 'Hello {{CustomerName}},\n\nYour bespoke 3D bottle label proof for {{BusinessName}} is ready for your review! Please inspect and approve your digital label proof online here: {{TrackingLink}}.\n\nOnce approved, production bottling will commence.',
  },
  {
    id: 'wa-4',
    name: 'Dispatch & Courier Tracking Notification',
    trigger: 'DISPATCHED',
    body: 'Exciting news {{CustomerName}}!\n\nYour MLUE custom branded water shipment for {{BusinessName}} (Order #{{OrderNumber}}) has been dispatched. Expected delivery within Indore.\n\nLive tracking portal: {{TrackingLink}}',
  },
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-1',
    orderId: 'ord-401',
    orderNumber: 'ORD-2026-088',
    customerId: 'cust-201',
    customerName: 'Chef Marc D’Souza',
    amount: 25665,
    paymentMethod: 'Bank Transfer',
    transactionReference: 'HDFC-NEFT-9918231',
    paymentDate: '2026-09-17T11:00:00Z',
    notes: 'Full invoice cleared',
    recordedBy: 'Accounts Dept',
  },
  {
    id: 'pay-2',
    orderId: 'ord-402',
    orderNumber: 'ORD-2026-089',
    customerId: 'cust-202',
    customerName: 'Sunita Meena',
    amount: 32000,
    paymentMethod: 'UPI',
    transactionReference: 'UPI-RAZORPAY-882194',
    paymentDate: '2026-09-19T09:45:00Z',
    notes: '50% advance production token',
    recordedBy: 'Accounts Dept',
  },
];

export const INITIAL_DELIVERIES: DeliveryRecord[] = [
  {
    id: 'del-1',
    deliveryId: 'DEL-2026-088',
    orderId: 'ord-401',
    orderNumber: 'ORD-2026-088',
    customerName: 'Medallion Fine Dining',
    destinationCity: 'Indore',
    bottlesCount: 2000,
    courierPartner: 'MLUE Direct Fleet (Indore)',
    trackingNumber: 'MLUE-FLEET-44210',
    dispatchDate: '2026-09-18T10:00:00Z',
    status: 'IN_TRANSIT',
    estimatedDelivery: '2026-09-21T18:00:00Z',
  },
  {
    id: 'del-2',
    deliveryId: 'DEL-2026-089',
    orderId: 'ord-402',
    orderNumber: 'ORD-2026-089',
    customerName: 'Indore Grand Banquet Hall',
    destinationCity: 'Indore',
    bottlesCount: 1000,
    courierPartner: 'MLUE Direct Fleet (Indore)',
    trackingNumber: 'MLUE-FLEET-44211',
    dispatchDate: '2026-09-19T14:30:00Z',
    status: 'DELIVERED',
    estimatedDelivery: '2026-09-20T12:00:00Z',
  },
];

export interface AppState {
  leads: Lead[];
  customers: Customer[];
  quotes: Quote[];
  orders: Order[];
  products: Product[];
  designProjects: DesignProject[];
  productionJobs: ProductionJob[];
  inventory: InventoryItem[];
  pricingRules: PricingRule[];
  tasks: Task[];
  complianceRecords: ComplianceRecord[];
  auditLogs: AuditLog[];
  companySettings: CompanySettings;
  currentUser: UserProfile;
  whatsappTemplates: WhatsAppTemplate[];
  payments: PaymentTransaction[];
  deliveries: DeliveryRecord[];
  users: UserProfile[];
  isFirestoreLoading: boolean;
}

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    name: 'Vinayak Pratap',
    email: 'vinayakgurjar05@gmail.com',
    role: 'SUPER_ADMIN',
    phone: '8827275367',
    companyName: 'MLUE',
    active: true,
  },
];

const DEFAULT_USER: UserProfile = INITIAL_USERS[0];

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest Client',
  email: 'guest@leelapalace.com',
  role: 'VIEWER',
  active: false,
};

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();
  private unsubscribers: Array<() => void> = [];

  constructor() {
    this.state = this.getInitialState();
    this.initFirestoreSync();
  }

  private getInitialState(): AppState {
    return {
      leads: INITIAL_LEADS,
      customers: INITIAL_CUSTOMERS,
      quotes: INITIAL_QUOTES,
      orders: INITIAL_ORDERS,
      products: INITIAL_CATALOG_PRODUCTS,
      designProjects: INITIAL_DESIGN_PROJECTS,
      productionJobs: INITIAL_PRODUCTION_JOBS,
      inventory: INITIAL_INVENTORY,
      pricingRules: INITIAL_PRICING_RULES,
      tasks: INITIAL_TASKS,
      complianceRecords: INITIAL_COMPLIANCE_RECORDS,
      auditLogs: INITIAL_AUDIT_LOGS,
      companySettings: INITIAL_COMPANY_SETTINGS,
      currentUser: DEFAULT_USER,
      whatsappTemplates: INITIAL_WHATSAPP_TEMPLATES,
      payments: INITIAL_PAYMENTS,
      deliveries: INITIAL_DELIVERIES,
      users: INITIAL_USERS,
      isFirestoreLoading: true,
    };
  }

  public initFirestoreSync() {
    try {
      // 1. Seed initial enterprise records and products to Cloud Firestore if collections are empty
      seedInitialFirestoreData({
        leads: INITIAL_LEADS,
        customers: INITIAL_CUSTOMERS,
        quotes: INITIAL_QUOTES,
        orders: INITIAL_ORDERS,
        inventory: INITIAL_INVENTORY,
        tasks: INITIAL_TASKS,
        complianceRecords: INITIAL_COMPLIANCE_RECORDS,
        companySettings: INITIAL_COMPANY_SETTINGS,
      });

      seedInitialProductsIfEmpty();

      let pendingCollections = 3;
      const markCollectionSynced = () => {
        pendingCollections--;
        if (pendingCollections <= 0 && this.state.isFirestoreLoading) {
          this.state.isFirestoreLoading = false;
          this.notify();
        }
      };

      // Safety timeout so skeletons smoothly dissolve even if network is delayed
      setTimeout(() => {
        if (this.state.isFirestoreLoading) {
          this.state.isFirestoreLoading = false;
          this.notify();
        }
      }, 750);

      // 2. Real-time Firestore synchronization listeners (Leads, Orders, Products, etc.)
      this.unsubscribers.push(
        syncUserLeads((remoteLeads) => {
          if (remoteLeads && remoteLeads.length > 0) {
            this.state.leads = remoteLeads;
          }
          markCollectionSynced();
          this.notify();
        })
      );

      this.unsubscribers.push(
        syncUserOrders((remoteOrders) => {
          if (remoteOrders && remoteOrders.length > 0) {
            this.state.orders = remoteOrders;
          }
          markCollectionSynced();
          this.notify();
        })
      );

      this.unsubscribers.push(
        syncProducts((remoteProducts) => {
          if (remoteProducts && remoteProducts.length > 0) {
            this.state.products = remoteProducts;
          }
          markCollectionSynced();
          this.notify();
        })
      );

      this.unsubscribers.push(
        subscribeToCollection<Quote>('quotes', (remoteQuotes) => {
          if (remoteQuotes && remoteQuotes.length > 0) {
            this.state.quotes = remoteQuotes;
            this.notify();
          }
        })
      );

      this.unsubscribers.push(
        subscribeToCollection<Customer>('customers', (remoteCustomers) => {
          if (remoteCustomers && remoteCustomers.length > 0) {
            this.state.customers = remoteCustomers;
            this.notify();
          }
        })
      );

      this.unsubscribers.push(
        subscribeToCollection<InventoryItem>('inventory', (remoteInventory) => {
          if (remoteInventory && remoteInventory.length > 0) {
            this.state.inventory = remoteInventory;
            this.notify();
          }
        })
      );

      this.unsubscribers.push(
        subscribeToCollection<Task>('tasks', (remoteTasks) => {
          if (remoteTasks && remoteTasks.length > 0) {
            this.state.tasks = remoteTasks;
            this.notify();
          }
        })
      );

      this.unsubscribers.push(
        subscribeToCompanySettings((settings) => {
          if (settings) {
            this.state.companySettings = { ...this.state.companySettings, ...settings };
            this.notify();
          }
        })
      );

      // 3. Persistent Firebase Auth state listener
      this.unsubscribers.push(
        initAuthStateListener((authProfile) => {
          if (authProfile) {
            this.state.currentUser = authProfile;
          } else {
            this.state.currentUser = DEFAULT_GUEST_USER;
          }
          this.notify();
        })
      );
    } catch (err) {
      console.warn('[Store] Firestore synchronization notice:', err);
    }
  }

  private saveToStorage() {
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): AppState {
    return this.state;
  }

  public isFirestoreLoading(): boolean {
    return this.state.isFirestoreLoading;
  }

  public setFirestoreLoading(loading: boolean) {
    this.state.isFirestoreLoading = loading;
    this.notify();
  }

  public async refreshFirestoreData(): Promise<void> {
    this.state.isFirestoreLoading = true;
    this.notify();
    try {
      const [freshLeads, freshOrders, freshProducts] = await Promise.all([
        fetchUserLeads(),
        fetchUserOrders(),
        fetchProducts(),
      ]);
      if (freshLeads.length > 0) this.state.leads = freshLeads;
      if (freshOrders.length > 0) this.state.orders = freshOrders;
      if (freshProducts.length > 0) this.state.products = freshProducts;
    } catch (err) {
      console.warn('[Store] Firestore refresh error:', err);
    } finally {
      setTimeout(() => {
        this.state.isFirestoreLoading = false;
        this.notify();
      }, 500);
    }
  }

  public setCurrentUserRole(role: UserRole) {
    this.state.currentUser = {
      ...this.state.currentUser,
      role,
    };
    saveDocument('users', this.state.currentUser.id, { role });
    saveDocument('user_profiles', this.state.currentUser.id, { role });
    this.saveToStorage();
  }

  // --- Lead Scoring Calculation ---
  public calculateLeadScore(data: {
    quantity: number;
    businessType: string;
    requiredDate?: string;
    hasLogo?: boolean;
    hasCustomDesign?: boolean;
  }): number {
    let score = 30; // base score
    if (data.quantity >= 3000) score += 30;
    else if (data.quantity >= 1500) score += 20;
    else if (data.quantity >= 500) score += 10;

    if (['Luxury Hotel', 'Resort', 'Wedding Planner'].includes(data.businessType)) {
      score += 25;
    } else if (['Café', 'Restaurant', 'Corporate Office'].includes(data.businessType)) {
      score += 15;
    }

    if (data.requiredDate) score += 10;
    if (data.hasLogo) score += 10;
    if (data.hasCustomDesign) score += 10;

    return Math.min(100, Math.max(10, score));
  }

  // --- Volume & MOQ Helper ---
  public calculateVolumeAndMoq(bottleSize: string, quantity: number) {
    let litersPerBottle = 0.5;
    if (bottleSize === '1000ml' || bottleSize === '1L') {
      litersPerBottle = 1.0;
    } else if (bottleSize === '250ml') {
      litersPerBottle = 0.25;
    } else if (bottleSize === '750ml') {
      litersPerBottle = 0.75;
    }

    const totalVolumeLiters = parseFloat((quantity * litersPerBottle).toFixed(1));
    const moqLiters = this.state.companySettings.moqLiters || 1000;
    const isSatisfied = totalVolumeLiters >= moqLiters;
    const minBottlesRequired = Math.ceil(moqLiters / litersPerBottle);

    return {
      bottleSize,
      quantity,
      litersPerBottle,
      totalVolumeLiters,
      moqLiters,
      isSatisfied,
      minBottlesRequired,
      deficitLiters: Math.max(0, moqLiters - totalVolumeLiters),
      deficitBottles: Math.max(0, minBottlesRequired - quantity),
    };
  }

  // --- Dynamic Pricing Engine ---
  public calculateQuotePricing(
    bottleSize: string,
    bottleStyle: string,
    quantity: number,
    discountAmount: number = 0
  ) {
    const rule =
      this.state.pricingRules.find(
        (r) => r.bottleSize === bottleSize && (bottleStyle ? r.bottleStyle === bottleStyle : true) && r.active
      ) ||
      this.state.pricingRules.find((r) => r.bottleSize === bottleSize && r.active) ||
      this.state.pricingRules[0]; // fallback 500ml

    const waterCost = rule.waterProductionCost ?? 1.2;
    const capCost = rule.capCost ?? 0.5;

    const unitInternalCost = parseFloat(
      (
        rule.baseBottleCost +
        waterCost +
        rule.labelCost +
        rule.printingCost +
        rule.packagingCost +
        rule.designCost +
        capCost +
        rule.deliveryCostPerUnit
      ).toFixed(2)
    );

    const unitMargin = parseFloat((unitInternalCost * (rule.targetMarginPct / 100)).toFixed(2));
    const unitPrice = parseFloat((unitInternalCost + unitMargin).toFixed(2));
    const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = parseFloat(((discountedSubtotal * rule.taxPct) / 100).toFixed(2));
    const totalAmount = parseFloat((discountedSubtotal + taxAmount).toFixed(2));
    const totalInternalCost = parseFloat((unitInternalCost * quantity).toFixed(2));
    const estimatedProfit = parseFloat((discountedSubtotal - totalInternalCost).toFixed(2));
    const profitMarginPct = parseFloat(
      discountedSubtotal > 0
        ? ((estimatedProfit / discountedSubtotal) * 100).toFixed(1)
        : '0'
    );

    const volumeMoq = this.calculateVolumeAndMoq(bottleSize, quantity);

    return {
      rule,
      unitInternalCost,
      breakdown: {
        baseBottleCost: rule.baseBottleCost,
        waterProductionCost: waterCost,
        labelCost: rule.labelCost,
        printingCost: rule.printingCost,
        packagingCost: rule.packagingCost,
        designCost: rule.designCost,
        capCost: capCost,
        deliveryCostPerUnit: rule.deliveryCostPerUnit,
      },
      unitMargin,
      unitPrice,
      subtotal,
      discountAmount,
      taxRate: rule.taxPct,
      taxAmount,
      totalAmount,
      totalInternalCost,
      estimatedProfit,
      profitMarginPct,
      volumeMoq,
    };
  }

  // --- Duplicate / Reorder Previous Order ---
  public duplicateOrReorder(orderId: string): Order | null {
    const existing = this.state.orders.find((o) => o.id === orderId);
    if (!existing) return null;
    const newOrderNumber = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...existing,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      paymentStatus: 'UNPAID',
      paidAmount: 0,
      orderStatus: 'ORDER_CONFIRMED',
      deliveryStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      artworkApproved: true,
      internalNotes: `Reordered from ${existing.orderNumber}. Cloned bottle size (${existing.bottleSize}), style (${existing.bottleStyle}), cap color (${existing.customization?.capColor || '#111118'}), quantity (${existing.quantity}) and customer details.`,
    };
    this.state.orders.unshift(newOrder);
    createOrderInFirestore(newOrder);
    this.addAuditLog('REORDER_CREATED', 'Order', newOrder.id, `Reorder initiated from order ${existing.orderNumber}`);
    this.saveToStorage();
    return newOrder;
  }

  // --- Public Website -> Lead Creation ---
  public createLead(payload: {
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    city: string;
    businessType: any;
    bottleSize: any;
    bottleStyle: any;
    quantity: number;
    requiredDate?: string;
    deliveryLocation?: string;
    source?: any;
    customization?: BottleCustomization;
    notes?: string;
  }): Lead {
    const pricing = this.calculateQuotePricing(
      payload.bottleSize,
      payload.bottleStyle,
      payload.quantity
    );

    const leadScore = this.calculateLeadScore({
      quantity: payload.quantity,
      businessType: payload.businessType,
      requiredDate: payload.requiredDate,
      hasLogo: Boolean(payload.customization?.logoUrl),
      hasCustomDesign: Boolean(payload.customization?.brandName),
    });

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      businessName: payload.businessName,
      contactName: payload.contactName,
      phone: payload.phone,
      whatsapp: payload.phone,
      email: payload.email,
      city: payload.city,
      businessType: payload.businessType,
      bottleSize: payload.bottleSize,
      bottleStyle: payload.bottleStyle,
      quantity: payload.quantity,
      requiredDate: payload.requiredDate,
      source: payload.source || 'Website',
      stage: 'NEW_LEAD',
      assignedTo: 'Ananya Sharma', // default assignee
      estimatedValue: pricing.totalAmount,
      leadScore,
      customization: payload.customization,
      deliveryLocation: payload.deliveryLocation || payload.city,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    this.state.leads.unshift(newLead);
    createLeadInFirestore(newLead);

    // Create automated task for sales team
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 1);

    const initialTask: Task = {
      id: `task-${Date.now()}`,
      title: `Call new lead: ${newLead.businessName}`,
      assignedTo: 'Ananya Sharma',
      customerName: newLead.businessName,
      leadId: newLead.id,
      dueDate: followUpDate.toISOString().split('T')[0],
      priority: leadScore > 80 ? 'URGENT' : 'HIGH',
      status: 'TODO',
      type: 'Call',
      notes: `Inquired for ${newLead.quantity} units of ${newLead.bottleSize}. Required by: ${newLead.requiredDate || 'TBD'}.`,
      createdAt: new Date().toISOString(),
    };
    this.state.tasks.unshift(initialTask);
    saveDocument('tasks', initialTask.id, initialTask);

    // Audit log
    this.addAuditLog(
      'LEAD_CREATED',
      'Lead',
      newLead.id,
      `New lead received from website: ${newLead.businessName} (${newLead.quantity} pcs, Score: ${leadScore})`
    );

    this.saveToStorage();
    return newLead;
  }

  public updateLeadStage(leadId: string, newStage: LeadStage) {
    const lead = this.state.leads.find((l) => l.id === leadId);
    if (!lead) return;
    const oldStage = lead.stage;
    lead.stage = newStage;
    lead.updatedAt = new Date().toISOString();
    updateLeadInFirestore(lead.id, lead);

    this.addAuditLog(
      'LEAD_STAGE_CHANGED',
      'Lead',
      leadId,
      `Lead stage moved from ${oldStage} to ${newStage}`
    );

    this.saveToStorage();
  }

  public assignLead(leadId: string, assignedTo: string) {
    const lead = this.state.leads.find((l) => l.id === leadId);
    if (!lead) return;
    lead.assignedTo = assignedTo;
    lead.updatedAt = new Date().toISOString();
    updateLeadInFirestore(lead.id, lead);

    this.addAuditLog(
      'LEAD_ASSIGNED',
      'Lead',
      leadId,
      `Assigned to ${assignedTo}`
    );

    this.saveToStorage();
  }

  public convertLeadToCustomer(leadId: string): Customer {
    const lead = this.state.leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const existingCustomer = this.state.customers.find(
      (c) => c.phone === lead.phone || c.email === lead.email
    );

    if (existingCustomer) {
      return existingCustomer;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      leadId: lead.id,
      businessName: lead.businessName,
      contactName: lead.contactName,
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      businessType: lead.businessType,
      billingAddress: lead.deliveryLocation || `${lead.city}, India`,
      shippingAddress: lead.deliveryLocation || `${lead.city}, India`,
      city: lead.city,
      state: 'State',
      pinCode: '000000',
      assignedSalesperson: lead.assignedTo,
      customerSince: new Date().toISOString(),
      totalOrders: 0,
      totalQuantity: 0,
      totalRevenue: 0,
      outstandingAmount: 0,
      repeatOrderCount: 0,
    };

    this.state.customers.unshift(newCust);
    saveDocument('customers', newCust.id, newCust);
    saveDocument('leads', lead.id, { ...lead, stage: 'CONVERTED' });

    this.addAuditLog(
      'CUSTOMER_CREATED',
      'Customer',
      newCust.id,
      `Converted lead ${lead.businessName} to official customer record.`
    );

    this.saveToStorage();
    return newCust;
  }

  public createQuote(quoteData: Partial<Quote>): Quote {
    const quoteNum = `QUO-2026-${String(this.state.quotes.length + 43).padStart(4, '0')}`;
    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      quoteNumber: quoteNum,
      customerName: quoteData.customerName || 'Valued Client',
      customerEmail: quoteData.customerEmail || '',
      customerPhone: quoteData.customerPhone || '',
      businessName: quoteData.businessName || 'Client Business',
      items: quoteData.items || [],
      subtotal: quoteData.subtotal || 0,
      discountAmount: quoteData.discountAmount || 0,
      taxRate: quoteData.taxRate || 18,
      taxAmount: quoteData.taxAmount || 0,
      shippingCost: quoteData.shippingCost || 0,
      totalAmount: quoteData.totalAmount || 0,
      totalInternalCost: quoteData.totalInternalCost || 0,
      estimatedProfit: quoteData.estimatedProfit || 0,
      profitMarginPct: quoteData.profitMarginPct || 0,
      status: quoteData.status || 'DRAFT',
      paymentTerms:
        quoteData.paymentTerms || '50% advance confirmation, 50% prior to dispatch.',
      deliveryTerms:
        quoteData.deliveryTerms || 'Doorstep delivery within 8-10 working days of artwork sign-off.',
      notes: quoteData.notes || '',
      termsAndConditions:
        quoteData.termsAndConditions ||
        'Quote valid for 15 calendar days. Final digital and physical proof approval is mandatory prior to plate engraving.',
      validUntil:
        quoteData.validUntil ||
        new Date(Date.now() + 15 * 86400000).toISOString(),
      customizationDetails: quoteData.customizationDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    this.state.quotes.unshift(newQuote);
    saveDocument('quotes', newQuote.id, newQuote);
    this.addAuditLog('QUOTE_CREATED', 'Quote', newQuote.id, `Created quotation ${newQuote.quoteNumber}`);
    this.saveToStorage();
    return newQuote;
  }

  public updateQuoteStatus(quoteId: string, status: any) {
    const q = this.state.quotes.find((item) => item.id === quoteId);
    if (!q) return;
    q.status = status;
    q.updatedAt = new Date().toISOString();
    if (status === 'SENT') q.sentAt = new Date().toISOString();
    if (status === 'ACCEPTED') q.acceptedAt = new Date().toISOString();

    saveDocument('quotes', q.id, q);
    this.addAuditLog('QUOTE_STATUS_CHANGED', 'Quote', quoteId, `Status updated to ${status}`);
    this.saveToStorage();
  }

  // --- Quote -> Order Conversion ---
  public convertQuoteToOrder(quoteId: string): Order {
    const quote = this.state.quotes.find((q) => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    quote.status = 'CONVERTED_TO_ORDER';
    const orderNum = `ORD-2026-${String(this.state.orders.length + 90).padStart(3, '0')}`;
    const primaryItem = quote.items[0] || {
      bottleSize: '500ml',
      bottleStyle: 'Heritage Square Ribbed',
      quantity: 1000,
      unitPrice: 15,
    };

    // Ensure customer exists
    let customer = this.state.customers.find(
      (c) => c.businessName === quote.businessName || c.email === quote.customerEmail
    );
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        businessName: quote.businessName,
        contactName: quote.customerName,
        phone: quote.customerPhone,
        email: quote.customerEmail,
        businessType: 'Other',
        billingAddress: 'Address on file',
        shippingAddress: 'Address on file',
        city: 'City',
        state: 'State',
        pinCode: '000000',
        customerSince: new Date().toISOString(),
        totalOrders: 1,
        totalQuantity: primaryItem.quantity,
        totalRevenue: quote.totalAmount,
        outstandingAmount: quote.totalAmount,
        repeatOrderCount: 0,
      };
      this.state.customers.unshift(customer);
    } else {
      customer.totalOrders += 1;
      customer.totalQuantity += primaryItem.quantity;
      customer.totalRevenue += quote.totalAmount;
      customer.outstandingAmount += quote.totalAmount;
      customer.repeatOrderCount += 1;
      customer.lastOrderDate = new Date().toISOString();
    }

    const trackingToken = `TRK-${quote.businessName.substring(0, 3).toUpperCase()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      quoteId: quote.id,
      customerId: customer.id,
      customerName: quote.customerName,
      businessName: quote.businessName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      shippingAddress: customer.shippingAddress,
      city: customer.city,
      bottleSize: primaryItem.bottleSize as any,
      bottleStyle: primaryItem.bottleStyle as any,
      quantity: primaryItem.quantity,
      unitPrice: primaryItem.unitPrice,
      totalAmount: quote.totalAmount,
      paidAmount: 0,
      paymentStatus: 'UNPAID',
      orderStatus: 'DESIGN_PENDING',
      deliveryStatus: 'PENDING',
      currentArtworkVersion: 'V1',
      artworkApproved: false,
      requiredDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
      assignedStaff: 'Karan Joshi (Production)',
      trackingToken,
      customization: quote.customizationDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    this.state.orders.unshift(newOrder);

    // Create Design Project
    this.state.designProjects.unshift({
      id: `des-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      businessName: newOrder.businessName,
      status: 'DESIGN_REQUESTED',
      assignedDesigner: 'Tanvi Shah',
      versions: [
        {
          version: 'V1',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'System Auto-Spec',
          previewUrl:
            'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
          approved: false,
        },
      ],
      activeVersion: 'V1',
      approvalToken: `appr-${trackingToken.toLowerCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create Production Job in QUEUED
    this.state.productionJobs.unshift({
      id: `prod-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      businessName: newOrder.businessName,
      bottleSize: newOrder.bottleSize,
      orderedQuantity: newOrder.quantity,
      producedQuantity: 0,
      rejectedQuantity: 0,
      acceptedQuantity: 0,
      stage: 'QUEUED',
      supplierOrPlant: 'MASAR BEVERAGES (Partner Plant Line 1)',
      expectedCompletionDate: newOrder.requiredDate,
      assignedStaff: 'Karan Joshi',
      isDemo: false,
    });

    // Create Task for Accounts to follow-up on advance payment
    this.state.tasks.unshift({
      id: `task-${Date.now()}`,
      title: `Collect 50% advance for ${newOrder.orderNumber}`,
      assignedTo: 'Accounts Team',
      customerName: newOrder.businessName,
      orderId: newOrder.id,
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      priority: 'HIGH',
      status: 'TODO',
      type: 'Payment Follow-up',
      notes: `Advance due: ₹${(newOrder.totalAmount * 0.5).toFixed(2)}`,
      createdAt: new Date().toISOString(),
    });

    this.addAuditLog(
      'ORDER_CREATED',
      'Order',
      newOrder.id,
      `Converted quote ${quote.quoteNumber} into Order ${newOrder.orderNumber}`
    );

    createOrderInFirestore(newOrder);
    saveDocument('quotes', quote.id, quote);
    saveDocument('customers', customer.id, customer);

    this.saveToStorage();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    // Rule: Production cannot start without artwork approval unless Super Admin overrides
    if (
      newStatus === 'IN_PRODUCTION' &&
      !order.artworkApproved &&
      this.state.currentUser.role !== 'SUPER_ADMIN'
    ) {
      showToast('Production cannot begin until final artwork is approved by the customer or Super Admin overrides.', 'error');
      return;
    }

    const prev = order.orderStatus;
    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'DISPATCHED') {
      order.dispatchedAt = new Date().toISOString();
      order.deliveryStatus = 'IN_TRANSIT';
    } else if (newStatus === 'DELIVERED') {
      order.deliveredAt = new Date().toISOString();
      order.deliveryStatus = 'DELIVERED';

      // Auto create future repeat order task 21 days out!
      const reorderDate = new Date();
      reorderDate.setDate(reorderDate.getDate() + 21);
      const reorderTask: Task = {
        id: `task-${Date.now()}`,
        title: `Reorder Check: ${order.businessName}`,
        assignedTo: order.assignedStaff || 'Ananya Sharma',
        customerName: order.businessName,
        orderId: order.id,
        dueDate: reorderDate.toISOString().split('T')[0],
        priority: 'MEDIUM',
        status: 'TODO',
        type: 'General',
        notes: `Order ${order.orderNumber} (${order.quantity} pcs) was delivered. Check customer stock levels for repeat order.`,
        createdAt: new Date().toISOString(),
      };
      this.state.tasks.unshift(reorderTask);
      saveDocument('tasks', reorderTask.id, reorderTask);
    }

    updateOrderInFirestore(order.id, order);

    this.addAuditLog(
      'ORDER_STATUS_CHANGED',
      'Order',
      orderId,
      `Status changed from ${prev} to ${newStatus}`
    );
    this.saveToStorage();
  }

  public approveArtwork(orderId: string, approverName: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.artworkApproved = true;
    order.artworkApprovedAt = new Date().toISOString();
    order.artworkApprovedBy = approverName;
    order.orderStatus = 'ARTWORK_APPROVED';
    order.updatedAt = new Date().toISOString();

    const design = this.state.designProjects.find((d) => d.orderId === orderId);
    if (design) {
      design.status = 'APPROVED';
      const active = design.versions.find((v) => v.version === design.activeVersion);
      if (active) active.approved = true;
    }

    updateOrderInFirestore(order.id, order);

    this.addAuditLog(
      'ARTWORK_APPROVED',
      'Order',
      orderId,
      `Artwork approved by ${approverName}. Ready to queue production.`
    );
    this.saveToStorage();
  }

  public recordPayment(orderId: string, amount: number, method: any, ref: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.paidAmount = parseFloat((order.paidAmount + amount).toFixed(2));
    if (order.paidAmount >= order.totalAmount) {
      order.paymentStatus = 'PAID';
    } else if (order.paidAmount > 0) {
      order.paymentStatus = 'PARTIAL';
    }

    // Update customer outstanding
    const cust = this.state.customers.find((c) => c.id === order.customerId);
    if (cust) {
      cust.outstandingAmount = Math.max(0, cust.outstandingAmount - amount);
      saveDocument('customers', cust.id, cust);
    }

    updateOrderInFirestore(order.id, order);

    this.addAuditLog(
      'PAYMENT_RECORDED',
      'Order',
      orderId,
      `Recorded ₹${amount} via ${method} (Ref: ${ref}). Order payment status: ${order.paymentStatus}`
    );

    this.saveToStorage();
  }

  public updatePricingRule(updated: PricingRule) {
    const index = this.state.pricingRules.findIndex((p) => p.id === updated.id);
    if (index >= 0) {
      this.state.pricingRules[index] = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      this.addAuditLog(
        'PRICING_UPDATED',
        'PricingRule',
        updated.id,
        `Updated pricing for ${updated.bottleSize} ${updated.bottleStyle}`
      );
      this.saveToStorage();
    }
  }

  public addAuditLog(action: string, entity: string, entityId: string, details: string) {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userName: this.state.currentUser.name,
      userRole: this.state.currentUser.role,
      action,
      entity,
      entityId,
      details,
    };
    this.state.auditLogs.unshift(newLog);
    saveDocument('audit_logs', newLog.id, newLog);
  }

  public resetToDemoData() {
    this.state = this.getInitialState();
    seedInitialFirestoreData({
      leads: INITIAL_LEADS,
      customers: INITIAL_CUSTOMERS,
      quotes: INITIAL_QUOTES,
      orders: INITIAL_ORDERS,
      inventory: INITIAL_INVENTORY,
      tasks: INITIAL_TASKS,
      complianceRecords: INITIAL_COMPLIANCE_RECORDS,
      companySettings: INITIAL_COMPANY_SETTINGS,
    });
    this.notify();
  }

  public exportDatabaseAsJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public exportStateJson(): string {
    return this.exportDatabaseAsJSON();
  }

  public importDatabaseFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.leads && parsed.orders && parsed.quotes) {
        this.state = parsed;
        this.saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON', e);
    }
    return false;
  }

  public importStateJson(jsonString: string): boolean {
    return this.importDatabaseFromJSON(jsonString);
  }

  public restockInventory(itemId: string, qty: number) {
    const item = this.state.inventory.find((i) => i.id === itemId);
    if (item) {
      item.currentStock += qty;
      item.availableQuantity = item.currentStock;
      saveDocument('inventory', item.id, item);
      this.addAuditLog(
        'INVENTORY_RESTOCKED',
        'InventoryItem',
        itemId,
        `Restocked +${qty} units. Current stock: ${item.currentStock}`
      );
      this.saveToStorage();
    }
  }

  // --- Products Catalog Service ---
  public getProducts(): Product[] {
    return this.state.products;
  }

  public async addProduct(productData: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const newProd = await createProductInFirestore(productData);
    this.state.products.unshift(newProd);
    this.addAuditLog('PRODUCT_CREATED', 'Product', newProd.id, `Created product ${newProd.name}`);
    this.saveToStorage();
    return newProd;
  }

  public async updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
    const idx = this.state.products.findIndex((p) => p.id === productId);
    if (idx >= 0) {
      this.state.products[idx] = {
        ...this.state.products[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateProductInFirestore(productId, updates);
      this.addAuditLog('PRODUCT_UPDATED', 'Product', productId, `Updated product fields`);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public async deleteProduct(productId: string): Promise<boolean> {
    this.state.products = this.state.products.filter((p) => p.id !== productId);
    await deleteProductFromFirestore(productId);
    this.addAuditLog('PRODUCT_DELETED', 'Product', productId, `Removed product ${productId}`);
    this.saveToStorage();
    return true;
  }

  public updateProductionJobProgress(jobId: string, producedQty: number) {
    const job = this.state.productionJobs.find((j) => j.id === jobId || j.jobId === jobId);
    if (job) {
      job.producedQuantity = producedQty;
      job.acceptedQuantity = producedQty;
      const target = job.targetQuantity || job.orderedQuantity;
      if (producedQty >= target) {
        job.stage = 'READY';
        job.status = 'COMPLETED';
      }
      this.saveToStorage();
    }
  }

  public updateProductionJobStatus(jobId: string, status: any) {
    const job = this.state.productionJobs.find((j) => j.id === jobId || j.jobId === jobId);
    if (job) {
      job.status = status;
      this.saveToStorage();
    }
  }

  public updateCompanySettings(settings: CompanySettings) {
    this.state.companySettings = { ...settings };
    saveDocument('company_settings', 'default', settings);
    this.addAuditLog(
      'SETTINGS_UPDATED',
      'CompanySettings',
      'global',
      'Updated statutory company profiles and tax details'
    );
    this.saveToStorage();
  }

  public updateTaskStatus(taskId: string, status: any) {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      saveDocument('tasks', task.id, task);
      this.saveToStorage();
    }
  }

  public createTask(task: Partial<Task> & { title: string }) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title,
      assignedTo: task.assignedTo || 'Sales Lead',
      customerName: task.customerName,
      leadId: task.leadId,
      orderId: task.orderId,
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      priority: task.priority || 'MEDIUM',
      status: (task.status as any) || 'TODO',
      type: (task.type as any) || 'General',
      notes: task.notes,
      createdAt: new Date().toISOString(),
    };
    this.state.tasks.unshift(newTask);
    saveDocument('tasks', newTask.id, newTask);
    this.saveToStorage();
    return newTask;
  }

  public addComplianceRecord(
    rec: Partial<ComplianceRecord> & {
      title: string;
      licenceOrDocNumber: string;
      issuingAuthority: string;
      expiryDate: string;
    }
  ) {
    const newRecord: ComplianceRecord = {
      id: `comp-${Date.now()}`,
      title: rec.title,
      category: rec.category || 'BIS / ISI Standard',
      licenceOrDocNumber: rec.licenceOrDocNumber,
      issuingAuthority: rec.issuingAuthority,
      issuedDate: rec.issuedDate || new Date().toISOString().split('T')[0],
      expiryDate: rec.expiryDate,
      status: (rec.status as any) || 'VERIFIED',
      notes: rec.notes,
    };
    this.state.complianceRecords.unshift(newRecord);
    saveDocument('compliance_records', newRecord.id, newRecord);
    this.addAuditLog(
      'COMPLIANCE_RECORD_ADDED',
      'ComplianceRecord',
      newRecord.id,
      `Added record: ${rec.title}`
    );
    this.saveToStorage();
    return newRecord;
  }

  public updateDeliveryStatus(deliveryId: string, status: any) {
    const delivery = this.state.deliveries.find((d) => d.id === deliveryId || d.deliveryId === deliveryId);
    if (delivery) {
      delivery.status = status;
      this.addAuditLog('DELIVERY_STATUS_UPDATED', 'DeliveryRecord', delivery.id, `Status set to ${status}`);
      this.saveToStorage();
    }
  }

  public addDesignVersion(projectId: string, versionData: any) {
    const project = this.state.designProjects.find((p) => p.id === projectId);
    if (project) {
      project.versions.push({
        id: `v-${Date.now()}`,
        versionNumber: versionData.versionNumber || `V${project.versions.length + 1}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: this.state.currentUser.name,
        notes: versionData.notes || '',
        feedback: versionData.feedback || '',
        approved: !!versionData.approved,
        ...versionData,
      });
      project.activeVersion = versionData.versionNumber || `V${project.versions.length}`;
      this.addAuditLog('DESIGN_VERSION_ADDED', 'DesignProject', projectId, `Uploaded artwork revision ${project.activeVersion}`);
      this.saveToStorage();
    }
  }

  public async signUp(params: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    companyName?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const res = await registerWithEmail(params);
    if (res.success && res.user) {
      this.state.currentUser = res.user;
      this.addAuditLog(
        'USER_SIGNED_UP',
        'User',
        res.user.id,
        `User ${res.user.name} created account (${res.user.role})`
      );
      this.notify();
    }
    return res;
  }

  public async logIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const res = await loginWithEmail(email, password);
    if (res.success && res.user) {
      this.state.currentUser = res.user;
      this.addAuditLog(
        'USER_LOGGED_IN',
        'User',
        res.user.id,
        `${res.user.name} logged into ${res.user.role} console`
      );
      this.notify();
    }
    return res;
  }

  public async logOut(): Promise<void> {
    const previousName = this.state.currentUser.name;
    await logoutUser();
    this.state.currentUser = DEFAULT_GUEST_USER;
    this.addAuditLog('USER_LOGGED_OUT', 'User', 'guest', `${previousName} logged out`);
    this.notify();
  }

  public switchUser(user: UserProfile): void {
    this.state.currentUser = user;
    this.addAuditLog(
      'USER_SWITCHED',
      'User',
      user.id,
      `Switched active session to ${user.name} (${user.role})`
    );
    this.notify();
  }
}

export const store = new Store();
