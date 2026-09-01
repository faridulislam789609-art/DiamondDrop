import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Reusable Firebase Modular SDK Configuration for DiamondDrop
 */
export const firebaseConfig = {
  apiKey: "AIzaSyC5EU7XJ_l00KMVhkNSNHOfv_uwQWUE31c",
  authDomain: "diamonddrop-9b43b.firebaseapp.com",
  projectId: "diamonddrop-9b43b",
  messagingSenderId: "994265045422",
  appId: "1:994265045422:web:9d62eee1cd13ee8eec103f",
};

// Initialize Firebase App singleton safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance (browser persistence enabled by default)
export const auth = getAuth(app);

// Firestore Database instance
export const db = getFirestore(app, 'ai-studio-diamonddrop-d73db8cb-1e21-4189-b66d-01c02c0b69ed');

// Configured Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

