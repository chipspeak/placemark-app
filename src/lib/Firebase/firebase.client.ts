import { getApps, getApp, deleteApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Firebase configuration - adopted from firebase documentation and this video: https://www.youtube.com/watch?v=8NlUTFppJkU&t=1693s&ab_channel=Smoljames
export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };

  let firebaseApp;

  // checks for  deleting and reinitializing firebase app if svelte loads it incorrectly
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
  };

  // exporting auth
  export const auth = getAuth(firebaseApp);



