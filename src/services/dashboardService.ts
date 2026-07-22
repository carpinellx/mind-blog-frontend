import api from './api';

export interface Estatisticas {
  total_artigos: number;
  total_curtidas: number;
  total_comentarios: number;
  tempo_medio_leitura: number;
}

export async function buscarEstatisticas(): Promise<Estatisticas> {
  const resposta = await api.get<Estatisticas>('/dashboard/estatisticas');
  return resposta.data;
}

export interface AtividadeRecente {
  id: number;
  conteudo: string;
  criado_em: string;
  autor_nome: string;
  autor_foto: string | null;
  artigo_id: number;
  artigo_titulo: string;
}

export async function buscarAtividadeRecente(): Promise<AtividadeRecente[]> {
  const resposta = await api.get<AtividadeRecente[]>('/dashboard/atividade-recente');
  return resposta.data;
}