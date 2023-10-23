// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  apiKey,
  appId,
  authDomain,
  measurementId,
  messagingSenderId,
  projectId,
  storageBucket
} from '../constants/vars';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey,
  appId,
  authDomain,
  measurementId,
  messagingSenderId,
  projectId,
  storageBucket
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// facebook uri
// https://cometa-e5dd5.firebaseapp.com/__/auth/handler
