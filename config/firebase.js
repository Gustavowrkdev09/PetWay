import { Platform } from 'react-native';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyA9xG0o37tLyEEvYFNt-Lzhn6SqAJPv0cM',
    authDomain: 'petway-15c22.firebaseapp.com',
    projectId: 'petway-15c22',
    storageBucket: 'petway-15c22.firebasestorage.app',
    messagingSenderId: '1067454037239',
    appId: '1:1067454037239:web:58ebed3d6d8534615427f2',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    try {
        auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch (e) {
        auth = getAuth(app);
    }
}

const db = getFirestore(app);

export { auth, db };