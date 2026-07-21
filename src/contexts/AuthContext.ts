import { createContext } from 'react';
import type { Usuario } from '../types';

export interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);