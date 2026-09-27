import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  Lead,
  Customer,
  Quote,
  Order,
  InventoryItem,
  Task,
  ProductionJob,
  ComplianceRecord,
  AuditLog,
  CompanySettings,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export type CollectionName =
  | 'users'
  | 'user_profiles'
  | 'leads'
  | 'customers'
  | 'quotes'
  | 'orders'
  | 'inventory'
  | 'tasks'
  | 'production_jobs'
  | 'compliance_records'
  | 'audit_logs'
  | 'company_settings';

/**
 * Persists an entity document into Firestore
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionName: CollectionName,
  docId: string,
  data: T
): Promise<boolean> {
  const docPath = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}

/**
 * Removes an entity document from Firestore
 */
export async function deleteDocument(
  collectionName: CollectionName,
  docId: string
): Promise<boolean> {
  const docPath = `${collectionName}/${docId}`;
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
    return false;
  }
}

/**
 * Subscribes to real-time changes in a Firestore collection
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: CollectionName,
  onUpdate: (items: T[]) => void,
  maxItems: number = 100
): () => void {
  try {
    const q = query(collection(db, collectionName), limit(maxItems));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: T[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...(d.data() as any) });
          });
          onUpdate(items);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, collectionName);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionName);
    return () => {};
  }
}

/**
 * Subscribes to single Company Settings document
 */
export function subscribeToCompanySettings(
  onUpdate: (settings: CompanySettings) => void
): () => void {
  try {
    const docRef = doc(db, 'company_settings', 'default');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as CompanySettings);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'company_settings/default');
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, 'company_settings/default');
    return () => {};
  }
}

/**
 * Seeds initial enterprise entities to Firestore if remote database is empty
 */
export async function seedInitialFirestoreData(initialState: {
  leads: Lead[];
  customers: Customer[];
  quotes: Quote[];
  orders: Order[];
  inventory: InventoryItem[];
  tasks: Task[];
  complianceRecords: ComplianceRecord[];
  companySettings: CompanySettings;
}) {
  try {
    // 1. Check if leads exist
    const leadsSnap = await getDocs(query(collection(db, 'leads'), limit(1)));
    if (leadsSnap.empty) {
      console.info('[FirestoreDb] Seeding initial leads to Firestore...');
      for (const lead of initialState.leads) {
        await saveDocument('leads', lead.id, lead);
      }
    }

    // 2. Check if orders exist
    const ordersSnap = await getDocs(query(collection(db, 'orders'), limit(1)));
    if (ordersSnap.empty) {
      console.info('[FirestoreDb] Seeding initial orders to Firestore...');
      for (const order of initialState.orders) {
        await saveDocument('orders', order.id, order);
      }
    }

    // 3. Check if quotes exist
    const quotesSnap = await getDocs(query(collection(db, 'quotes'), limit(1)));
    if (quotesSnap.empty) {
      console.info('[FirestoreDb] Seeding initial quotes to Firestore...');
      for (const quote of initialState.quotes) {
        await saveDocument('quotes', quote.id, quote);
      }
    }

    // 4. Check if customers exist
    const custSnap = await getDocs(query(collection(db, 'customers'), limit(1)));
    if (custSnap.empty) {
      console.info('[FirestoreDb] Seeding initial customers to Firestore...');
      for (const cust of initialState.customers) {
        await saveDocument('customers', cust.id, cust);
      }
    }

    // 5. Check if company settings exist
    const settingsDoc = await getDoc(doc(db, 'company_settings', 'default'));
    if (!settingsDoc.exists()) {
      console.info('[FirestoreDb] Seeding initial company settings to Firestore...');
      await saveDocument('company_settings', 'default', initialState.companySettings);
    }

    // 6. Check inventory
    const invSnap = await getDocs(query(collection(db, 'inventory'), limit(1)));
    if (invSnap.empty) {
      for (const inv of initialState.inventory) {
        await saveDocument('inventory', inv.id, inv);
      }
    }

    // 7. Check tasks
    const tasksSnap = await getDocs(query(collection(db, 'tasks'), limit(1)));
    if (tasksSnap.empty) {
      for (const task of initialState.tasks) {
        await saveDocument('tasks', task.id, task);
      }
    }
  } catch (err) {
    console.warn('[FirestoreDb] Seeding check notice (online status):', err);
  }
}
