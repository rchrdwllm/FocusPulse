import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8GaR1CZXWfwzEQRc2s2suVFXICBr-tZo",
  authDomain: "focuspulse-a3499.firebaseapp.com",
  projectId: "focuspulse-a3499",
  storageBucket: "focuspulse-a3499.firebasestorage.app",
  messagingSenderId: "361895729300",
  appId: "1:361895729300:web:6a95607cb69571dad9fc81",
};

export const firebase = initializeApp(firebaseConfig);
export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
