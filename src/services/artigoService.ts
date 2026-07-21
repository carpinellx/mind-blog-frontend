import api from './api';
import type { Artigo, Comentario } from '../types';

interface DadosArtigo {
  titulo: string;
  resumo?: string;
  conteudo: string;
  categoria?: string;
  tags?: string[];
  imagem?: File;
}

function montarFormData(dados: DadosArtigo): FormData {
  const formData = new FormData();
  formData.append('titulo', dados.titulo);
  formData.append('conteudo', dados.conteudo);

  if (dados.resumo) formData.append('resumo', dados.resumo);
  if (dados.categoria) formData.append('categoria', dados.categoria);
  if (dados.tags) formData.append('tags', JSON.stringify(dados.tags));
  if (dados.imagem) formData.append('imagem', dados.imagem);

  return formData;
}

export async function listarArtigos(): Promise<Artigo[]> {
  const resposta = await api.get<Artigo[]>('/artigos');
  return resposta.data;
}

export async function buscarArtigo(id: number): Promise<Artigo> {
  const resposta = await api.get<Artigo>(`/artigos/${id}`);
  return resposta.data;
}

export async function criarArtigo(dados: DadosArtigo): Promise<Artigo> {
  const formData = montarFormData(dados);
  const resposta = await api.post<Artigo>('/artigos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resposta.data;
}

export async function atualizarArtigo(id: number, dados: DadosArtigo): Promise<void> {
  const formData = montarFormData(dados);
  await api.put(`/artigos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function excluirArtigo(id: number): Promise<void> {
  await api.delete(`/artigos/${id}`);
}

export async function alternarCurtida(id: number): Promise<{ curtido: boolean; total_curtidas: number }> {
  const resposta = await api.post(`/artigos/${id}/curtir`);
  return resposta.data;
}

export async function listarComentarios(artigoId: number): Promise<Comentario[]> {
  const resposta = await api.get<Comentario[]>(`/artigos/${artigoId}/comentarios`);
  return resposta.data;
}

export async function criarComentario(artigoId: number, conteudo: string): Promise<Comentario> {
  const resposta = await api.post<Comentario>(`/artigos/${artigoId}/comentarios`, { conteudo });
  return resposta.data;
}

export async function excluirComentario(id: number): Promise<void> {
  await api.delete(`/comentarios/${id}`);
}