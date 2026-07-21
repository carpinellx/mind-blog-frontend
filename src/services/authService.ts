import api from './api';
import type { Usuario } from '../types';

interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

export async function login(email: string, senha: string): Promise<RespostaLogin> {
  const resposta = await api.post<RespostaLogin>('/login', { email, senha });
  return resposta.data;
}

export async function cadastrar(nome: string, email: string, senha: string): Promise<Usuario> {
  const resposta = await api.post<Usuario>('/usuarios', { nome, email, senha });
  return resposta.data;
}

export async function buscarPerfil(): Promise<Usuario> {
  const resposta = await api.get<Usuario>('/perfil');
  return resposta.data;
}

export async function atualizarPerfil(nome: string, bio: string | null, foto_url: string | null): Promise<Usuario> {
  const resposta = await api.put<Usuario>('/perfil', { nome, bio, foto_url });
  return resposta.data;
}