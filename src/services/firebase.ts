import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { UserProfile, UserRole, Lead, CompanySettings } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore using the specific databaseId if provided
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Connection test as required by Firebase skill
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('[Firebase] Firestore connected securely.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client offline; local persistence active.');
    } else {
      console.info('[Firebase] Initialized with cloud credentials.');
    }
    return false;
  }
}

// Re-export Auth Methods from firebaseAuth
export {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  sendResetPassword,
  initAuthStateListener,
  getCurrentAuthUser,
} from './firebaseAuth';

// Re-export Storage Methods
export {
  storage,
  uploadFileToStorage,
  uploadCompanyLogo,
  uploadUserProfileImage,
  uploadArtworkProof,
  deleteStorageFile,
} from './firebaseStorage';

// Re-export Firestore Service Layer (Leads, Orders, Products)
export {
  syncUserLeads,
  fetchUserLeads,
  createLeadInFirestore,
  updateLeadInFirestore,
  deleteLeadFromFirestore,
  syncUserOrders,
  fetchUserOrders,
  createOrderInFirestore,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  fetchOrderByTrackingToken,
  syncProducts,
  fetchProducts,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  seedInitialProductsIfEmpty,
  INITIAL_CATALOG_PRODUCTS,
} from './firestoreService';

// Firestore Real-Time Leads Synchronization
export function subscribeToFirestoreLeads(onUpdate: (leads: Lead[]) => void) {
  try {
    const q = query(collection(db, 'leads'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const remoteLeads: Lead[] = [];
        snapshot.forEach((docSnap) => {
          remoteLeads.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (remoteLeads.length > 0) {
          onUpdate(remoteLeads);
        }
      },
      (error) => {
        console.warn('Firestore leads snapshot listener notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not establish firestore listener', err);
    return () => {};
  }
}

// Add Lead to Firestore
export async function addLeadToFirestore(lead: Partial<Lead>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...lead,
      createdAt: lead.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore lead save error, persisting locally:', err);
    return null;
  }
}

// Sync Company Settings to Firestore
export async function saveCompanySettingsToFirestore(settings: CompanySettings): Promise<boolean> {
  try {
    await setDoc(doc(db, 'company_settings', 'default'), settings, { merge: true });
    return true;
  } catch (err) {
    console.warn('Could not save company settings to firestore', err);
    return false;
  }
}
