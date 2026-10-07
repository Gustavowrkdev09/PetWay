import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUsuario from '../hooks/useUsuario';
import {
    marcarComoLida,
    ouvirNotificacoes,
} from '../services/notificacaoService';

const AMARELO = '#FBB827';
const PRETO = '#1A1A1A';

const TIPOS = {
    entrega: {
        icone: 'paw',
        cor: AMARELO,
        fundo: '#FFF0C9',
    },
    promocao: {
        icone: 'heart',
        cor: '#E53935',
        fundo: '#FDE8E8',
    },
    lembrete: {
        icone: 'calendar-month',
        cor: '#3B6FD4',
        fundo: '#E6EEFB',
    },
    novidade: {
        icone: 'bullhorn',
        cor: '#2F5D9E',
        fundo: '#E6EEFB',
    },
    avaliacao: {
        icone: 'star',
        cor: AMARELO,
        fundo: '#FFF0C9',
    },
};

function formatarTempo(data) {
    if (!data) return '';

    const segundos = Math.max(
        0,
        Math.floor((Date.now() - data.getTime()) / 1000)
    );

    if (segundos < 60) {
        return 'Agora';
    }

    const minutos = Math.floor(segundos / 60);

    if (minutos < 60) {
        return `Há ${minutos} ${
            minutos === 1 ? 'minuto' : 'minutos'
        }`;
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
        return `Há ${horas} ${
            horas === 1 ? 'hora' : 'horas'
        }`;
    }

    const dias = Math.floor(horas / 24);

    if (dias < 30) {
        return `Há ${dias} ${
            dias === 1 ? 'dia' : 'dias'
        }`;
    }

    return data.toLocaleDateString('pt-BR');
}

export default function Notificacao({ navigation }) {
    const { usuario } = useUsuario();
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        if (!usuario) {
            setNotificacoes([]);
            return undefined;
        }

        return ouvirNotificacoes(usuario.uid, (lista) => {
            const notificacoesFormatadas = lista.map((notificacao) => ({
                ...notificacao,
                tempo: formatarTempo(notificacao.criadaEm),
            }));

            setNotificacoes(notificacoesFormatadas);
        });
    }, [usuario?.uid]);

    return (
        <SafeAreaView style={styles.tela} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{
                        top: 12,
                        bottom: 12,
                        left: 12,
                        right: 12,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={26}
                        color={PRETO}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitulo}>
                    Notificações
                </Text>
            </View>

            <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.lista}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                    <View style={styles.divisor} />
                )}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <MaterialCommunityIcons
                            name="bell-outline"
                            size={48}
                            color={AMARELO}
                        />

                        <Text style={styles.vazioTitulo}>
                            Nada por aqui ainda
                        </Text>

                        <Text style={styles.vazioTexto}>
                            Pedidos, lembretes e promoções vão aparecer aqui.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const tipo = TIPOS[item.tipo] ?? TIPOS.novidade;

                    return (
                        <TouchableOpacity
                            style={styles.item}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (!item.lida) {
                                    marcarComoLida(
                                        usuario.uid,
                                        item.id
                                    );
                                }
                            }}
                        >
                            <View
                                style={[
                                    styles.icone,
                                    { backgroundColor: tipo.fundo },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={tipo.icone}
                                    size={24}
                                    color={tipo.cor}
                                />
                            </View>

                            <View style={styles.textos}>
                                <View style={styles.tituloLinha}>
                                    <Text
                                        style={styles.titulo}
                                        numberOfLines={1}
                                    >
                                        {item.titulo}
                                    </Text>

                                    {!item.lida && (
                                        <View style={styles.ponto} />
                                    )}
                                </View>

                                <Text
                                    style={styles.descricao}
                                    numberOfLines={2}
                                >
                                    {item.descricao}
                                </Text>

                                <Text style={styles.tempo}>
                                    {item.tempo}
                                </Text>
                            </View>

                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={22}
                                color="#8A8A8A"
                            />
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: '#FFFAEE',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    headerTitulo: {
        marginLeft: 16,
        fontSize: 20,
        fontWeight: '700',
        color: PRETO,
    },

    lista: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 32,
        flexGrow: 1,
    },

    divisor: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E3DAC6',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },

    icone: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textos: {
        flex: 1,
        marginHorizontal: 12,
    },

    tituloLinha: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    titulo: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: '700',
        color: PRETO,
    },

    ponto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E8890C',
        marginLeft: 8,
    },

    descricao: {
        fontSize: 13,
        lineHeight: 18,
        color: '#6B7280',
        marginTop: 2,
    },

    tempo: {
        fontSize: 12,
        color: '#9A9A9A',
        marginTop: 4,
    },

    vazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },

    vazioTitulo: {
        fontSize: 17,
        fontWeight: '700',
        color: PRETO,
        marginTop: 12,
    },

    vazioTexto: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 32,
    },
});