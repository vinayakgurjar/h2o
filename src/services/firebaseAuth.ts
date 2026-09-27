import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserProfile, UserRole } from '../types';

// Ensure standard browser persistence
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[FirebaseAuth] Persistence setup fallback', err);
  });
} catch (e) {
  console.warn('[FirebaseAuth] Persistence init notice', e);
}

const SUPER_ADMIN_EMAIL = 'vinayakgurjar05@gmail.com';

/**
 * Maps a Firebase Auth user & Firestore record to the application's UserProfile
 */
export async function syncUserProfile(
  fbUser: FirebaseUser,
  defaultRole: UserRole = 'VIEWER',
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> {
  const isSuperAdmin = fbUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const userDocRef = doc(db, 'users', fbUser.uid);
  const profileDocRef = doc(db, 'user_profiles', fbUser.uid);

  let role: UserRole = isSuperAdmin ? 'SUPER_ADMIN' : defaultRole;
  let companyName = additionalData?.companyName || '';
  let phone = additionalData?.phone || fbUser.phoneNumber || '';
  let name = additionalData?.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'User';

  try {
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      role = isSuperAdmin ? 'SUPER_ADMIN' : (data.role as UserRole) || role;
      companyName = data.companyName || companyName;
      phone = data.phone || phone;
      name = data.name || name;
    } else {
      // Create initial Firestore user document
      const newRecord = {
        uid: fbUser.uid,
        id: fbUser.uid,
        name,
        email: fbUser.email || '',
        role,
        phone,
        companyName,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newRecord, { merge: true });
      await setDoc(profileDocRef, newRecord, { merge: true });
    }
  } catch (err) {
    console.warn('[FirebaseAuth] Firestore user profile sync note:', err);
  }

  return {
    id: fbUser.uid,
    name,
    email: fbUser.email || '',
    role,
    phone,
    companyName,
    active: true,
  };
}

/**
 * 1. Email & Password Login
 */
export async function loginWithEmail(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const profile = await syncUserProfile(cred.user);
    return { success: true, user: profile };
  } catch (err: any) {
    let message = 'Login failed. Please verify your credentials.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      message = 'Invalid email or password. Please verify and try again.';
    } else if (err.code === 'auth/wrong-password') {
      message = 'Incorrect password. Try again or use forgot password.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Access temporarily disabled due to multiple failed attempts. Please reset password.';
    }
    return { success: false, error: message };
  }
}

/**
 * 2. Email & Password Registration
 */
export async function registerWithEmail(params: {
  name: string;
  email: string;
  pass?: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  companyName?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const rawPassword = params.password || params.pass || '';
    if (!rawPassword) {
      return { success: false, error: 'Password is required.' };
    }
    const cred = await createUserWithEmailAndPassword(auth, params.email.trim(), rawPassword);
    
    // Update Firebase Auth user display name
    try {
      await updateProfile(cred.user, { displayName: params.name.trim() });
    } catch {}

    const profile = await syncUserProfile(cred.user, params.role || 'VIEWER', {
      name: params.name.trim(),
      phone: params.phone,
      companyName: params.companyName,
    });

    return { success: true, user: profile };
  } catch (err: any) {
    let message = 'Registration failed. Please try again.';
    if (err.code === 'auth/email-already-in-use') {
      message = 'An account with this email address already exists. Please log in.';
    } else if (err.code === 'auth/weak-password') {
      message = 'Password is too weak. Please use at least 6 characters.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Please provide a valid email address.';
    }
    return { success: false, error: message };
  }
}

/**
 * 3. Google Sign-In
 */
export async function signInWithGoogle(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(credential.user);
    return { success: true, user: profile };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Google sign-in popup was closed.' };
    }
    return { success: false, error: err.message || 'Google sign-in failed.' };
  }
}

/**
 * 4. Forgot / Reset Password
 */
export async function sendResetPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
    };
  } catch (err: any) {
    let msg = 'Could not send reset email.';
    if (err.code === 'auth/user-not-found') {
      msg = 'No registered user found with this email address.';
    } else if (err.code === 'auth/invalid-email') {
      msg = 'Invalid email address format.';
    }
    return { success: false, error: msg };
  }
}

/**
 * 5. Logout
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * 6. Auth State Listener
 */
export function initAuthStateListener(
  onUserChanged: (user: UserProfile | null) => void
): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await syncUserProfile(fbUser);
      onUserChanged(profile);
    } else {
      onUserChanged(null);
    }
  });
}

/**
 * 7. Get Current Auth User
 */
export function getCurrentAuthUser(): FirebaseUser | null {
  return auth.currentUser;
}
