import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcyBLG5mcrxyEwbBsyq4xX2Hh2Es6L1Ok",
  authDomain: "portfolio-ce615.firebaseapp.com",
  projectId: "portfolio-ce615",
  storageBucket: "portfolio-ce615.appspot.com",
  messagingSenderId: "274495429625",
  appId: "1:274495429625:web:d0c6efecd41854e616fb28",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
