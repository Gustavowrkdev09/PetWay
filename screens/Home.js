import { View, Text, Button, Alert } from 'react-native';
import { sair } from '../services/authService';
import { auth } from '../config/firebase';

export default function Home({ navigation }) {
    async function realizarLogout() {
        await sair()
        navigation.navigate('Login');
    }

    return (
        <View></View>
    );
}