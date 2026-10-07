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
import { cadastrar } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 8;

export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const senhaRef = useRef(null);
    const confirmarSenhaRef = useRef(null);

    async function realizarCadastro() {
        if (carregando) return;

        const emailLimpo = email.trim().toLowerCase();

        if (!emailLimpo || !senha || !confirmarSenha) {
            setErro('Preencha todos os campos.');
            return;
        }

        if (!EMAIL_REGEX.test(emailLimpo)) {
            setErro('Digite um e-mail válido.');
            return;
        }

        if (senha.length < SENHA_MINIMA) {
            setErro(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setErro('');
        setCarregando(true);

        try {
            await cadastrar(emailLimpo, senha);
            navigation.navigate('Login');
        } catch (error) {
            const status = error?.response?.status;

            if (status === 409) {
                setErro('Este e-mail já está cadastrado. Tente fazer login.');
            } else if (status === 400 || status === 422) {
                setErro('Dados inválidos. Confira o e-mail e a senha.');
            } else if (!error?.response) {
                setErro('Sem conexão com o servidor. Verifique sua internet.');
            } else {
                setErro('Não foi possível criar a conta. Tente novamente em instantes.');
            }

            if (__DEV__) {
                console.log(error);
            }
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
                <TouchableOpacity
                    style={styles.voltar}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#1A1A1A"
                    />
                </TouchableOpacity>

                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.titulo}>Crie sua conta</Text>

                <Text style={styles.subtitulo}>
                    É rápido e fácil! Assim você pode aproveitar todos os
                    benefícios do PetWay.
                </Text>

                <View style={styles.campo}>
                    <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#333"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#9A9A9A"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current?.focus()}
                        editable={!carregando}
                    />
                </View>

                <View style={styles.campo}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#333"
                    />

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
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
                        editable={!carregando}
                    />

                    <TouchableOpacity
                        onPress={() => setMostrarSenha((valor) => !valor)}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={
                            mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                        }
                    >
                        <Ionicons
                            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.campo}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#333"
                    />

                    <TextInput
                        ref={confirmarSenhaRef}
                        style={styles.input}
                        placeholder="Confirmar senha"
                        placeholderTextColor="#9A9A9A"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry={!mostrarConfirmarSenha}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={realizarCadastro}
                        editable={!carregando}
                    />

                    <TouchableOpacity
                        onPress={() =>
                            setMostrarConfirmarSenha((valor) => !valor)
                        }
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={
                            mostrarConfirmarSenha
                                ? 'Ocultar confirmação de senha'
                                : 'Mostrar confirmação de senha'
                        }
                    >
                        <Ionicons
                            name={
                                mostrarConfirmarSenha
                                    ? 'eye-off-outline'
                                    : 'eye-outline'
                            }
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                {!!erro && (
                    <Text
                        style={styles.erro}
                        accessibilityLiveRegion="polite"
                    >
                        {erro}
                    </Text>
                )}

                <TouchableOpacity
                    style={[
                        styles.botao,
                        carregando && styles.botaoDesabilitado,
                    ]}
                    onPress={realizarCadastro}
                    disabled={carregando}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                >
                    {carregando ? (
                        <ActivityIndicator color="#1A1A1A" />
                    ) : (
                        <Text style={styles.botaoTexto}>Cadastrar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.rodape}>
                    <Text style={styles.textoEscuro}>
                        Já tem uma conta?{' '}
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.link}>Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#FFFAEE',
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 32,
    },

    voltar: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    logo: {
        width: 180,
        height: 150,
        alignSelf: 'center',
        marginBottom: 16,
    },

    titulo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    subtitulo: {
        fontSize: 15,
        color: '#333',
        marginTop: 8,
        marginBottom: 24,
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
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            },
        }),
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

    botaoDesabilitado: {
        opacity: 0.7,
    },

    botaoTexto: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    textoEscuro: {
        fontSize: 14,
        color: '#1A1A1A',
    },

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

