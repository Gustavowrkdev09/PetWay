import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import usePerfil from '../hooks/usePerfil';
import { sair } from '../services/authService';

const MESES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

const AMARELO = '#FBB827';
const PRETO = '#1A1A1A';
const VERMELHO = '#C62828';

function formatarMesAno(data) {
    return `${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function avisar(mensagem) {
    if (Platform.OS === 'web') {
        window.alert(mensagem);
    } else {
        Alert.alert('Ops', mensagem);
    }
}

export default function Perfil({ navigation }) {
    const { perfil, carregando } = usePerfil();
    const [saindo, setSaindo] = useState(false);

    async function realizarSaida() {
        if (saindo) {
            return;
        }

        setSaindo(true);

        try {
            await sair();
            navigation.navigate('Login');
        } catch (error) {
            avisar('Não foi possível sair. Tente novamente.');

            if (__DEV__) {
                console.log(error);
            }

            setSaindo(false);
        }
    }

    const informacoes = perfil
        ? [
              perfil.localizacao && {
                  id: 'local',
                  icone: 'map-marker-outline',
                  rotulo: 'Localização',
                  valor: perfil.localizacao,
              },
              perfil.desde && {
                  id: 'desde',
                  icone: 'calendar-outline',
                  rotulo: 'Membro desde',
                  valor: formatarMesAno(perfil.desde),
              },
          ].filter(Boolean)
        : [];

    return (
        <SafeAreaView style={styles.tela} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        hitSlop={{
                            top: 12,
                            bottom: 12,
                            left: 12,
                            right: 12,
                        }}
                        accessibilityLabel="Voltar"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={26}
                            color={PRETO}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitulo}>
                        Perfil
                    </Text>
                </View>

                {carregando ? (
                    <ActivityIndicator
                        size="large"
                        color={AMARELO}
                        style={styles.carregando}
                    />
                ) : !perfil ? (
                    <Text style={styles.vazio}>
                        Você não está logado.
                    </Text>
                ) : (
                    <>
                        <View style={styles.topo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarLetra}>
                                    {perfil.nome
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase()}
                                </Text>
                            </View>

                            <Text style={styles.nome}>
                                {perfil.nome}
                            </Text>

                            <Text style={styles.email}>
                                {perfil.email}
                            </Text>
                        </View>

                        <Text style={styles.secao}>
                            Sobre
                        </Text>

                        <View style={styles.cartao}>
                            {perfil.descricao ? (
                                <Text style={styles.descricao}>
                                    {perfil.descricao}
                                </Text>
                            ) : (
                                <Text style={styles.descricaoVazia}>
                                    Você ainda não adicionou uma descrição.
                                </Text>
                            )}
                        </View>

                        {informacoes.length > 0 && (
                            <>
                                <Text style={styles.secao}>
                                    Informações
                                </Text>

                                <View style={styles.cartao}>
                                    {informacoes.map((item, indice) => (
                                        <View
                                            key={item.id}
                                            style={[
                                                styles.linha,
                                                indice > 0 &&
                                                    styles.linhaDivisor,
                                            ]}
                                        >
                                            <View style={styles.linhaIcone}>
                                                <MaterialCommunityIcons
                                                    name={item.icone}
                                                    size={20}
                                                    color={AMARELO}
                                                />
                                            </View>

                                            <View style={styles.linhaTextos}>
                                                <Text
                                                    style={styles.linhaRotulo}
                                                >
                                                    {item.rotulo}
                                                </Text>

                                                <Text
                                                    style={styles.linhaValor}
                                                >
                                                    {item.valor}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.botaoSair,
                                saindo && styles.botaoSairBloqueado,
                            ]}
                            onPress={realizarSaida}
                            disabled={saindo}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                        >
                            {saindo ? (
                                <ActivityIndicator color={VERMELHO} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons
                                        name="logout"
                                        size={20}
                                        color={VERMELHO}
                                    />

                                    <Text style={styles.botaoSairTexto}>
                                        Log out
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: '#FFFAEE',
    },

    conteudo: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 32,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
    },

    headerTitulo: {
        marginLeft: 16,
        fontSize: 20,
        fontWeight: '700',
        color: PRETO,
    },

    carregando: {
        marginTop: 80,
    },

    vazio: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 15,
        marginTop: 80,
    },

    topo: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },

    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#FFF0C9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: AMARELO,
    },

    avatarLetra: {
        fontSize: 40,
        fontWeight: '800',
        color: '#E8890C',
    },

    nome: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginTop: 14,
    },

    email: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },

    secao: {
        fontSize: 16,
        fontWeight: '700',
        color: PRETO,
        marginBottom: 10,
    },

    cartao: {
        backgroundColor: '#FFFDF8',
        borderWidth: 1,
        borderColor: '#F3EBDD',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 22,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
    },

    descricao: {
        fontSize: 15,
        lineHeight: 22,
        color: '#374151',
    },

    descricaoVazia: {
        fontSize: 14,
        lineHeight: 20,
        color: '#9A9A9A',
        fontStyle: 'italic',
    },

    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },

    linhaDivisor: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E3DAC6',
    },

    linhaIcone: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFF0C9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    linhaTextos: {
        marginLeft: 12,
        flex: 1,
    },

    linhaRotulo: {
        fontSize: 12,
        color: '#6B7280',
    },

    linhaValor: {
        fontSize: 15,
        fontWeight: '600',
        color: PRETO,
        marginTop: 1,
    },

    botaoSair: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        borderRadius: 27,
        borderWidth: 1.5,
        borderColor: VERMELHO,
        backgroundColor: '#FFFFFF',
        marginTop: 4,
    },

    botaoSairBloqueado: {
        opacity: 0.7,
    },

    botaoSairTexto: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700',
        color: VERMELHO,
    },
});