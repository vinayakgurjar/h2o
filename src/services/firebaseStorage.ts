import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { app } from './firebase';

export const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage under a clean structured path
 * e.g. users/{uid}/profile/{filename}, companies/{companyId}/{filename}
 */
export async function uploadFileToStorage(
  storagePath: string,
  file: File | Blob,
  metadata?: Record<string, string>
): Promise<string> {
  const fileRef = ref(storage, storagePath);
  const uploadResult = await uploadBytes(fileRef, file, {
    customMetadata: metadata,
  });
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
}

/**
 * Upload company logo
 */
export async function uploadCompanyLogo(
  companyId: string,
  file: File
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `companies/${companyId || 'default'}/${Date.now()}_${sanitizedName}`;
  return uploadFileToStorage(path, file);
}

/**
 * Upload user profile picture
 */
export async function uploadUserProfileImage(
  uid: string,
  file: File
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `users/${uid}/profile/${Date.now()}_${sanitizedName}`;
  return uploadFileToStorage(path, file);
}

/**
 * Upload artwork proof or label vector asset
 */
export async function uploadArtworkProof(
  orderOrProjectId: string,
  file: File
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `artworks/${orderOrProjectId}/${Date.now()}_${sanitizedName}`;
  return uploadFileToStorage(path, file);
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteStorageFile(storagePathOrUrl: string): Promise<boolean> {
  try {
    const fileRef = ref(storage, storagePathOrUrl);
    await deleteObject(fileRef);
    return true;
  } catch (err) {
    console.warn('[FirebaseStorage] Delete notice:', err);
    return false;
  }
}
