/**
 * Firestore Service Layer
 * Replaces browser localStorage with Cloud Firestore persistent synchronization
 * Handles User Leads, Orders, and Products Catalog
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Lead, Order, Product, BottleSize, BottleStyle } from '../types';
import { handleFirestoreError, OperationType } from './firestoreDb';

export const INITIAL_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod-500-sq',
    name: '500ml Heritage Square Ribbed',
    size: '500ml',
    style: 'Square',
    tagline: 'Made For Tables — The Hospitality Benchmark',
    description:
      'Engineered for premium dining tables, hotel suites, and executive meetings. Stays in front of guests throughout dinner.',
    basePrice: 6.8,
    moq: 300,
    labelType: 'Waterproof BOPP Matte',
    unitsPerCrate: 24,
    imageUrl:
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-500-rnd',
    name: '500ml Classic Cylindrical Round',
    size: '500ml',
    style: 'Round',
    tagline: 'Clean Minimalist Café Standard',
    description:
      'High-clarity virgin PET flask with tactile ergonomics for artisan roasteries, bistros, and high-frequency hospitality venues.',
    basePrice: 6.2,
    moq: 300,
    labelType: 'Metallic Foil & Gloss Wrap',
    unitsPerCrate: 24,
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-1000-sq',
    name: '1L Heritage Architectural Square',
    size: '1000ml',
    style: 'Square',
    tagline: 'Boardroom & Presidential Suite Statement',
    description:
      'Substantial 1000ml presence with diamond-cut corners. Demands authority on convention hall speaker podiums and luxury boardroom desks.',
    basePrice: 11.2,
    moq: 300,
    labelType: 'Embossed Textured Synthetic',
    unitsPerCrate: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-1000-rnd',
    name: '1L Sleek Nordic Cylinder',
    size: '1000ml',
    style: 'Round',
    tagline: 'Grand Banquet & VIP Gala Centerpiece',
    description:
      'Refined Scandinavian proportions for wedding banquet round-tables, conference delegation seats, and upscale resort suites.',
    basePrice: 10.5,
    moq: 300,
    labelType: 'Soft-Touch Matte Monolithic',
    unitsPerCrate: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-250-rnd',
    name: '250ml Quick-Hydrate Minibar Flask',
    size: '250ml',
    style: 'Round',
    tagline: 'In-Room Refreshment & Luxury Flight Welcome',
    description:
      'Compact handheld bottle designed for in-vehicle VIP transfers, luxury fleet gloveboxes, and bedside nightstand carafes.',
    basePrice: 4.8,
    moq: 500,
    labelType: 'Ultra-Clear Transparent BOPP',
    unitsPerCrate: 36,
    imageUrl:
      'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-750-sq',
    name: '750ml Reserve Decanter Silhouette',
    size: '750ml',
    style: 'Square',
    tagline: 'Michelin-Star Sommelier Pairing Water',
    description:
      'Bespoke heavy-gauge silhouette crafted to mirror fine wine and champagne service on white tablecloth tables.',
    basePrice: 9.4,
    moq: 400,
    labelType: 'Hot-Stamp Foil Metallic',
    unitsPerCrate: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 1. USER LEADS SERVICE
// ============================================================================

/**
 * Subscribes to leads with real-time updates from Firestore
 * Optionally filters by userId/owner if specified
 */
export function syncUserLeads(
  onUpdate: (leads: Lead[]) => void,
  userId?: string
): () => void {
  try {
    const leadsRef = collection(db, 'leads');
    // If user ID provided and not admin, query user-owned leads
    const q = userId
      ? query(leadsRef, where('assignedTo', '==', userId), limit(100))
      : query(leadsRef, limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const leads: Lead[] = [];
        snapshot.forEach((docSnap) => {
          leads.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(leads);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'leads');
    return () => {};
  }
}

/**
 * Fetches all leads once from Firestore
 */
export async function fetchUserLeads(userId?: string): Promise<Lead[]> {
  try {
    const leadsRef = collection(db, 'leads');
    const q = userId
      ? query(leadsRef, where('assignedTo', '==', userId), limit(100))
      : query(leadsRef, limit(100));
    const snap = await getDocs(q);
    const leads: Lead[] = [];
    snap.forEach((d) => leads.push({ id: d.id, ...(d.data() as any) }));
    return leads;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'leads');
    return [];
  }
}

/**
 * Creates a new Lead in Firestore
 */
export async function createLeadInFirestore(
  lead: Omit<Lead, 'id'> & { id?: string }
): Promise<Lead> {
  const leadId = lead.id || `lead-${Date.now()}`;
  const now = new Date().toISOString();
  const fullLead: Lead = {
    ...lead,
    id: leadId,
    createdAt: lead.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'leads', leadId), fullLead, { merge: true });
    return fullLead;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `leads/${leadId}`);
    return fullLead;
  }
}

/**
 * Updates an existing Lead in Firestore
 */
export async function updateLeadInFirestore(
  leadId: string,
  updates: Partial<Lead>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'leads', leadId);
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    return false;
  }
}

/**
 * Deletes a Lead from Firestore
 */
export async function deleteLeadFromFirestore(leadId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'leads', leadId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `leads/${leadId}`);
    return false;
  }
}

// ============================================================================
// 2. USER ORDERS SERVICE
// ============================================================================

/**
 * Subscribes to orders with real-time updates from Firestore
 */
export function syncUserOrders(
  onUpdate: (orders: Order[]) => void,
  userEmailOrId?: string
): () => void {
  try {
    const ordersRef = collection(db, 'orders');
    const q = userEmailOrId
      ? query(ordersRef, where('customerEmail', '==', userEmailOrId), limit(100))
      : query(ordersRef, limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(orders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders');
    return () => {};
  }
}

/**
 * Fetches all orders once from Firestore
 */
export async function fetchUserOrders(userEmailOrId?: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = userEmailOrId
      ? query(ordersRef, where('customerEmail', '==', userEmailOrId), limit(100))
      : query(ordersRef, limit(100));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push({ id: d.id, ...(d.data() as any) }));
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'orders');
    return [];
  }
}

/**
 * Creates a new Order in Firestore
 */
export async function createOrderInFirestore(
  order: Omit<Order, 'id'> & { id?: string }
): Promise<Order> {
  const orderId = order.id || `ord-${Date.now()}`;
  const now = new Date().toISOString();
  const fullOrder: Order = {
    ...order,
    id: orderId,
    createdAt: order.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'orders', orderId), fullOrder, { merge: true });
    return fullOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    return fullOrder;
  }
}

/**
 * Updates an Order in Firestore
 */
export async function updateOrderInFirestore(
  orderId: string,
  updates: Partial<Order>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    return false;
  }
}

/**
 * Deletes an Order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    return false;
  }
}

/**
 * Finds order by public tracking token
 */
export async function fetchOrderByTrackingToken(
  trackingToken: string
): Promise<Order | null> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('trackingToken', '==', trackingToken.trim()), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as any) };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `orders?trackingToken=${trackingToken}`);
    return null;
  }
}

// ============================================================================
// 3. PRODUCTS & CATALOG SERVICE
// ============================================================================

/**
 * Subscribes to products catalog in Firestore
 */
export function syncProducts(onUpdate: (products: Product[]) => void): () => void {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, limit(50));

    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const products: Product[] = [];
          snapshot.forEach((docSnap) => {
            products.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          onUpdate(products);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    return () => {};
  }
}

/**
 * Fetches all products from Firestore
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(query(collection(db, 'products'), limit(50)));
    const products: Product[] = [];
    snap.forEach((d) => products.push({ id: d.id, ...(d.data() as any) }));
    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
    return [];
  }
}

/**
 * Creates a new Product in Firestore
 */
export async function createProductInFirestore(
  product: Omit<Product, 'id'> & { id?: string }
): Promise<Product> {
  const productId = product.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();
  const fullProduct: Product = {
    ...product,
    id: productId,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'products', productId), fullProduct, { merge: true });
    return fullProduct;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `products/${productId}`);
    return fullProduct;
  }
}

/**
 * Updates a Product in Firestore
 */
export async function updateProductInFirestore(
  productId: string,
  updates: Partial<Product>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', productId);
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    return false;
  }
}

/**
 * Deletes a Product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    return false;
  }
}

/**
 * Automatically seeds the products collection in Cloud Firestore if empty
 */
export async function seedInitialProductsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(query(collection(db, 'products'), limit(1)));
    if (snap.empty) {
      console.info('[FirestoreService] Seeding initial bottle catalog into Cloud Firestore...');
      for (const prod of INITIAL_CATALOG_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }
      console.info('[FirestoreService] Products successfully synchronized with Firestore.');
    }
  } catch (err) {
    console.warn('[FirestoreService] Product seeding status check notice:', err);
  }
}
