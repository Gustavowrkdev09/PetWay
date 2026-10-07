import { useEffect, useState } from 'react';
import useUsuario from './useUsuario';
import { nomeDoEmail, ouvirPerfil } from '../services/perfilService';

export default function usePerfil() {
    const { usuario, carregando: carregandoAuth } = useUsuario();
    const [dados, setDados] = useState(null);
    const [carregandoDados, setCarregandoDados] = useState(true);

    useEffect(() => {
        if (!usuario) {
            setDados(null);
            setCarregandoDados(false);
            return undefined;
        }
        setCarregandoDados(true);
        return ouvirPerfil(
            usuario.uid,
            (d) => {
                setDados(d);
                setCarregandoDados(false);
            },
            () => setCarregandoDados(false),
        );
    }, [usuario?.uid]);

    const perfil = usuario
        ? {
              uid: usuario.uid,
              email: usuario.email,
              nome: dados?.nome || usuario.displayName || nomeDoEmail(usuario.email),
              descricao: dados?.descricao || '',
              localizacao: dados?.localizacao || '',
              desde:
                  dados?.criadoEm?.toDate?.() ??
                  (usuario.metadata?.creationTime ? new Date(usuario.metadata.creationTime) : null),
          }
        : null;

    return { perfil, carregando: carregandoAuth || carregandoDados };
}