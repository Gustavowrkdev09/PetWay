import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function nomeDoEmail(email = '') {
    const parte = email.split('@')[0] || 'Tutor';
    return parte.charAt(0).toUpperCase() + parte.slice(1);
}

export async function criarPerfil(user, nome) {
    await setDoc(doc(db, 'usuarios', user.uid), {
        nome: nome || user.displayName || nomeDoEmail(user.email),
        email: user.email,
        descricao: '',
        localizacao: '',
        criadoEm: serverTimestamp(),
    });
}

export async function garantirPerfil(user) {
    const ref = doc(db, 'usuarios', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) await criarPerfil(user, user.displayName);
}

export function ouvirPerfil(uid, aoMudar, aoErro) {
    return onSnapshot(
        doc(db, 'usuarios', uid),
        (snap) => aoMudar(snap.exists() ? snap.data({ serverTimestamps: 'estimate' }) : null),
        aoErro,
    );
}

export async function atualizarPerfil(uid, campos) {
    await updateDoc(doc(db, 'usuarios', uid), campos);
}