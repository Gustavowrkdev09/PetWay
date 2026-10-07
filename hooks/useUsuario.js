import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function useUsuario() {
    const [usuario, setUsuario] = useState(auth.currentUser);
    const [carregando, setCarregando] = useState(!auth.currentUser);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUsuario(u);
            setCarregando(false);
        });
    }, []);

    return { usuario, carregando };
}