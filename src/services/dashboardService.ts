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