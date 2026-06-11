import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  CollectionReference,
  DocumentReference,
  Query,
  DocumentData
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth();

// Auto sign-in anonymously if not signed in to allow Firestore security rules to be tied to a valid request.auth.uid
signInAnonymously(auth).catch((err) => {
  console.warn('Anonymous sign-in failed during initialization:', err);
});

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Intercepted: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Hardened CRUD Helpers wrapped in full telemetry exception reporters
export async function safeGetDoc(docRef: DocumentReference<DocumentData>) {
  try {
    return await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docRef.path);
  }
}

export async function safeGetDocs(queryRef: Query<DocumentData> | CollectionReference<DocumentData>) {
  try {
    return await getDocs(queryRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, (queryRef as any).path || 'query');
  }
}

export async function safeSetDoc(docRef: DocumentReference<DocumentData>, data: any) {
  try {
    return await setDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docRef.path);
  }
}

export async function safeUpdateDoc(docRef: DocumentReference<DocumentData>, data: any) {
  try {
    return await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docRef.path);
  }
}

export async function safeDeleteDoc(docRef: DocumentReference<DocumentData>) {
  try {
    return await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docRef.path);
  }
}

export function safeOnSnapshot(
  ref: any,
  onNext: (snapshot: any) => void,
  operationType: OperationType = OperationType.LIST
) {
  return onSnapshot(
    ref,
    onNext,
    (error) => {
      handleFirestoreError(error, operationType, ref.path || 'snapshot_ref');
    }
  );
}

// Connection Validation Test on Initial Boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'main'));
    console.log('✅ Firebase connection validated successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your offline network or Firebase configuration.");
    }
  }
}
testConnection();
