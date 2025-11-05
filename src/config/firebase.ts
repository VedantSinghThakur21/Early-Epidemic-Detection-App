/**
 * Firebase Configuration
 * 
 * Using Firebase REST API for React Native compatibility
 * (Firebase Web SDK has issues with React Native bundler)
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDlZN6IOgfvNo1YX07Xbcyrgq_rySyAI_I",
  authDomain: "web-dev-wmad.firebaseapp.com",
  projectId: "web-dev-wmad",
  storageBucket: "web-dev-wmad.firebasestorage.app",
  messagingSenderId: "849356513988",
  appId: "1:849356513988:web:4a0423bf2062a1c0861f91",
  measurementId: "G-4BQ4TL3ZJY"
};

// Firebase REST API endpoints
export const FIREBASE_AUTH_API = `https://identitytoolkit.googleapis.com/v1/accounts`;
export const FIREBASE_API_KEY = firebaseConfig.apiKey;

export default firebaseConfig;

