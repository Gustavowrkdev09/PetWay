import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
    criarPerfil,
    garantirPerfil,
    nomeDoEmail,
} from './perfilService';
import { notificar } from './notificacaoService';

const log = (...args) => {
    if (__DEV__) {
        console.warn('[auth]', ...args);
    }
};

const dois = (numero) => String(numero).padStart(2, '0');

export async function login(email, senha) {
    const credencial = await signInWithEmailAndPassword(
        auth,
        email,
        senha
    );

    const { user } = credencial;

    garantirPerfil(user).catch(log);

    const agora = new Date();

    notificar(user.uid, {
        tipo: 'novidade',
        titulo: 'Login realizado',
        descricao:
            `Olá, ${user.displayName || nomeDoEmail(user.email)}! ` +
            `Você entrou às ${dois(agora.getHours())}:${dois(
                agora.getMinutes()
            )} de ${dois(agora.getDate())}/${dois(
                agora.getMonth() + 1
            )}.`,
    });

    return credencial;
}

export async function cadastrar(email, senha, nome) {
    const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
    );

    const { user } = credencial;
    const nomeFinal = (nome || '').trim() || nomeDoEmail(email);

    try {
        await updateProfile(user, {
            displayName: nomeFinal,
        });
    } catch (error) {
        log('updateProfile', error);
    }

    criarPerfil(user, nomeFinal).catch(log);

    notificar(user.uid, {
        tipo: 'novidade',
        titulo: 'Bem-vindo ao PetWay!',
        descricao: `Sua conta foi criada com sucesso, ${nomeFinal}.`,
    });

    return credencial;
}

export function sair() {
    return signOut(auth);
}