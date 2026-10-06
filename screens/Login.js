import { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../services/authService';

const logo = require('../assets/logo.png');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const senhaRef = useRef(null);

    async function realizarLogin() {
        if (carregando) return;

        const emailLimpo = email.trim().toLowerCase();
        if (!emailLimpo || !senha) {
            setErro('Preencha e-mail e senha.');
            return;
        }
        if (!EMAIL_REGEX.test(emailLimpo)) {
            setErro('Digite um e-mail válido.');
            return;
        }

        setErro('');
        setCarregando(true);
        try {
            await login(emailLimpo, senha);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 401 || status === 400) {
                setErro('E-mail ou senha incorretos.');
            } else if (!error?.response) {
                setErro('E-mail ou senha incorretos.');
            } else {
                setErro('Algo deu errado. Tente novamente em instantes.');
            }
            if (__DEV__) console.log(error);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Image source={logo} style={styles.logo} resizeMode="contain" />

                <Text style={styles.titulo}>Bem-vindo de volta!</Text>
                <Text style={styles.subtitulo}>
                    Faça login para continuar{'\n'}cuidando do seu pet.
                </Text>

                <View style={styles.campo}>
                    <Ionicons name="mail-outline" size={20} color="#333" />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#9A9A9A"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        autoComplete="username"
                        textContentType="username"
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current?.focus()}
                        editable={!carregando}
                    />
                </View>

                <View style={styles.campo}>
                    <Ionicons name="lock-closed-outline" size={20} color="#333" />
                    <TextInput
                        ref={senhaRef}
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#9A9A9A"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={!mostrarSenha}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={realizarLogin}
                        editable={!carregando}
                    />
                    <TouchableOpacity
                        onPress={() => setMostrarSenha((v) => !v)}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                    </TouchableOpacity>
                </View>

                {!!erro && (
                    <Text style={styles.erro} accessibilityLiveRegion="polite">
                        {erro}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.botao, carregando && styles.botaoDesabilitado]}
                    onPress={realizarLogin}
                    disabled={carregando}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                >
                    {carregando ? (
                        <ActivityIndicator color="#1A1A1A" />
                    ) : (
                        <Text style={styles.botaoTexto}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.rodape}>
                    <Text style={styles.textoEscuro}>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.link}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#FFFAEE' },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 72,
        paddingBottom: 32,
    },
    logo: {
        width: 200,
        height: 170,
        alignSelf: 'center',
        marginBottom: 24,
    },
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 28,
        lineHeight: 21,
    },
    campo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F0E6D2',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 54,
        marginBottom: 14,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1A1A1A',
         ...Platform.select({ web: { outlineStyle: 'none' } }),
    },
    erro: {
        color: '#C62828',
        fontSize: 13,
        marginBottom: 12,
    },
    botao: {
        backgroundColor: '#FBB827',
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    botaoDesabilitado: { opacity: 0.7 },
    botaoTexto: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    linkEsqueci: {
        alignSelf: 'center',
        paddingVertical: 14,
    },
    textoEscuro: { fontSize: 14, color: '#1A1A1A' },
    rodape: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: 32,
    },
    link: {
        fontSize: 14,
        color: '#E8890C',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});