import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import usePerfil from '../hooks/usePerfil';

const AMARELO = '#FBB827';

const ATALHOS = [
    { id: 'racoes', titulo: 'Rações\ne petiscos', icone: 'paw' },
    { id: 'banho', titulo: 'Banho e\ntosa', icone: 'shower-head' },
    { id: 'veterinario', titulo: 'Veterinário', icone: 'stethoscope' },
    { id: 'produtos', titulo: 'Produtos', icone: 'shopping' },
    { id: 'servicos', titulo: 'Serviços', icone: 'calendar-check' },
    { id: 'carrinho', titulo: 'Carrinho', icone: 'cart' },
];

export default function Home({ navigation }) {
    const { perfil } = usePerfil();

    return (
        <SafeAreaView style={styles.tela} edges={['top']}>
            <View
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
            >
                <MaterialCommunityIcons
                    name="paw"
                    size={110}
                    color={AMARELO}
                    style={[styles.pata, styles.pataEsquerda]}
                />

                <MaterialCommunityIcons
                    name="paw"
                    size={90}
                    color={AMARELO}
                    style={[styles.pata, styles.pataDireita]}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={styles.acoesHeader}>
                        <TouchableOpacity
                            style={styles.botaoPerfil}
                            accessibilityLabel="Notificações"
                            onPress={() => navigation.navigate('Notificacao')}
                        >
                            <MaterialCommunityIcons
                                name="bell-outline"
                                size={28}
                                color="#1A1A1A"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoPerfil}
                            accessibilityLabel="Perfil"
                            onPress={() => navigation.navigate('Perfil')}
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={28}
                                color="#1A1A1A"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.saudacao}>
                    Olá, {perfil?.nome || 'usuário'}
                </Text>

                <Text style={styles.subtitulo}>
                    Tudo o que seu pet precisa,{'\n'}
                    em um só lugar.
                </Text>

                <ImageBackground
                    source={require('../assets/banner.jpeg')}
                    style={styles.banner}
                    resizeMode="cover"
                >
                    <View style={styles.bannerEscuro} />

                    <View style={styles.bannerConteudo}>
                        <Text style={styles.bannerTitulo}>
                            Seu pet{'\n'}
                            sempre bem!
                        </Text>

                        <Text style={styles.bannerTexto}>
                            Produtos, serviços e muito{'\n'}
                            mais em um só lugar.
                        </Text>

                        <TouchableOpacity
                            style={styles.bannerBotao}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.bannerBotaoTexto}>
                                Ver ofertas
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <View style={styles.grade}>
                    {ATALHOS.map((atalho) => (
                        <TouchableOpacity
                            key={atalho.id}
                            style={styles.card}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconeCirculo}>
                                <MaterialCommunityIcons
                                    name={atalho.icone}
                                    size={28}
                                    color={AMARELO}
                                />
                            </View>

                            <Text
                                style={styles.cardTexto}
                                numberOfLines={2}
                            >
                                {atalho.titulo}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        paddingTop: 12,
        paddingBottom: 32,
    },

    pata: {
        position: 'absolute',
        opacity: 0.15,
    },

    pataEsquerda: {
        left: -24,
        bottom: -8,
        transform: [{ rotate: '-20deg' }],
    },

    pataDireita: {
        right: -16,
        bottom: 24,
        transform: [{ rotate: '20deg' }],
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logo: {
        width: 70,
        height: 70,
        marginLeft: 20,
    },

    acoesHeader: {
        flexDirection: 'row',
        gap: 15,
    },

    botaoPerfil: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0C9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    saudacao: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111827',
        marginTop: 20,
    },

    subtitulo: {
        fontSize: 16,
        lineHeight: 23,
        color: '#6B7280',
        marginTop: 6,
        marginBottom: 20,
    },

    banner: {
        height: 190,
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        justifyContent: 'center',
    },

    bannerEscuro: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 25, 10, 0.45)',
    },

    bannerConteudo: {
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },

    bannerTitulo: {
        fontSize: 26,
        lineHeight: 30,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    bannerTexto: {
        fontSize: 13,
        lineHeight: 18,
        color: '#FFFFFF',
        marginTop: 6,
    },

    bannerBotao: {
        backgroundColor: AMARELO,
        paddingHorizontal: 22,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },

    bannerBotaoTexto: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    grade: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    card: {
        width: '31.5%',
        minHeight: 120,
        backgroundColor: '#FFFDF8',
        borderWidth: 1,
        borderColor: '#F3EBDD',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 6,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
    },

    iconeCirculo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF0C9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    cardTexto: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        lineHeight: 17,
    },
});