import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC9jPTyctgxDrrY_tTOpFrNZyiZzlZ3fSI",
  authDomain: "apex-athletics-8097c.firebaseapp.com",
  projectId: "apex-athletics-8097c",
  storageBucket: "apex-athletics-8097c.firebasestorage.app",
  messagingSenderId: "517266905604",
  appId: "1:517266905604:web:528488f5b1e2a7c0d23351",
  measurementId: "G-SDY2D197WQ",
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let analyticsInstance: Analytics | null = null;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  const supported = await isSupported();
  if (supported) {
    analyticsInstance = getAnalytics(firebaseApp);
  }
  return analyticsInstance;
}
