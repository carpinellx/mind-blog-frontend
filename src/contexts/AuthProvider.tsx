import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const dadosUsuario = await authService.buscarPerfil();
          setUsuario(dadosUsuario);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setCarregando(false);
    }

    restaurarSessao();
  }, []);

  async function entrar(email: string, senha: string) {
    const { token, usuario: dadosUsuario } = await authService.login(email, senha);
    localStorage.setItem('token', token);
    setUsuario(dadosUsuario);
  }

  function sair() {
    localStorage.removeItem('token');
    setUsuario(null);
  }

  function atualizarUsuarioLocal(dadosUsuario: Usuario) {
    setUsuario(dadosUsuario);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair, atualizarUsuarioLocal }}>
      {children}
    </AuthContext.Provider>
  );
}