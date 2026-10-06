import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA9xG0o37tLyEEvYFNt-Lzhn6SqAJPv0cM",
  authDomain: "petway-15c22.firebaseapp.com",
  projectId: "petway-15c22",
  storageBucket: "petway-15c22.firebasestorage.app",
  messagingSenderId: "1067454037239",
  appId: "1:1067454037239:web:58ebed3d6d8534615427f2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);