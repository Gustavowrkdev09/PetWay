import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    addDoc,
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CANAL = 'default';
const naWeb = Platform.OS === 'web';

const log = (...args) => {
    if (__DEV__) {
        console.warn('[notificacoes]', ...args);
    }
};

if (!naWeb) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
}

async function garantirPermissao() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CANAL, {
            name: 'Geral',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    const atual = await Notifications.getPermissionsAsync();

    if (atual.granted) {
        return true;
    }

    if (atual.canAskAgain === false) {
        return false;
    }

    const pedido = await Notifications.requestPermissionsAsync();

    return pedido.granted;
}

async function mostrarNoAparelho(titulo, corpo, tipo) {
    if (naWeb) {
        return;
    }

    try {
        if (!(await garantirPermissao())) {
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: corpo,
                data: { tipo },
            },
            trigger:
                Platform.OS === 'android'
                    ? { channelId: CANAL }
                    : null,
        });
    } catch (error) {
        log('aparelho', error);
    }
}

export async function notificar(
    uid,
    { tipo = 'novidade', titulo, descricao }
) {
    try {
        await addDoc(
            collection(db, 'usuarios', uid, 'notificacoes'),
            {
                tipo,
                titulo,
                descricao,
                lida: false,
                criadaEm: serverTimestamp(),
            }
        );
    } catch (error) {
        log('firestore', error);
    }

    await mostrarNoAparelho(titulo, descricao, tipo);
}

export function ouvirNotificacoes(uid, aoMudar, aoErro) {
    const consulta = query(
        collection(db, 'usuarios', uid, 'notificacoes'),
        orderBy('criadaEm', 'desc'),
        limit(50)
    );

    return onSnapshot(
        consulta,
        (snapshot) => {
            aoMudar(
                snapshot.docs.map((documento) => {
                    const dados = documento.data({
                        serverTimestamps: 'estimate',
                    });

                    return {
                        id: documento.id,
                        tipo: dados.tipo,
                        titulo: dados.titulo,
                        descricao: dados.descricao,
                        lida: dados.lida === true,
                        criadaEm:
                            dados.criadaEm?.toDate?.() ?? null,
                    };
                })
            );
        },
        (error) => {
            log('ouvir', error);
            aoErro?.(error);
        }
    );
}

export async function marcarComoLida(uid, id) {
    try {
        await updateDoc(
            doc(db, 'usuarios', uid, 'notificacoes', id),
            {
                lida: true,
            }
        );
    } catch (error) {
        log('marcarComoLida', error);
    }
}
