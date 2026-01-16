import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let db: Firestore;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key"
  );
}

// Collection names
export const COLLECTIONS = {
  QUIZ_RESULTS: "quiz_results",
  ANALYTICS_EVENTS: "analytics_events",
  QUIZ_CONFIG: "quiz_config",
} as const;

// Types
export interface QuizResult {
  memberId?: string;
  personality: string;
  scores: Record<string, number>;
  answers: Array<{ questionIndex: number; answerId: string; personality: string }>;
  timestamp: Timestamp;
  duration?: number;
}

export interface AnalyticsEvent {
  event: string;
  data: Record<string, unknown>;
  timestamp: Timestamp;
}

// Quiz Results
export async function saveQuizResult(result: Omit<QuizResult, "timestamp">): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, COLLECTIONS.QUIZ_RESULTS), {
    ...result,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getQuizResults(limitCount: number = 100): Promise<QuizResult[]> {
  const db = getDb();
  const q = query(
    collection(db, COLLECTIONS.QUIZ_RESULTS),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as QuizResult & { id: string }));
}

// Analytics Events
export async function logAnalyticsEvent(
  event: string,
  data: Record<string, unknown>
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, COLLECTIONS.ANALYTICS_EVENTS), {
    event,
    data,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getAnalyticsEvents(limitCount: number = 1000): Promise<AnalyticsEvent[]> {
  const db = getDb();
  const q = query(
    collection(db, COLLECTIONS.ANALYTICS_EVENTS),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AnalyticsEvent & { id: string }));
}

// Quiz Config (questions and personalities)
export async function getQuizConfig(docName: "questions" | "personalities"): Promise<unknown> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.QUIZ_CONFIG, docName);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
}

export async function setQuizConfig(
  docName: "questions" | "personalities",
  data: Record<string, unknown>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.QUIZ_CONFIG, docName);
  await setDoc(docRef, data);
}

export {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  Timestamp,
};
