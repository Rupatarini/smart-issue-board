/*
  Firebase Setup File
  This file initializes Firebase for our app.
  It sets up Authentication and Firestore database.
  
  What is Firebase?
  Firebase is a service by Google that provides:
  1. Authentication (sign up, log in)
  2. Database (store data in the cloud)
  3. Hosting (put your app online)
*/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
// These will be used in other parts of the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
