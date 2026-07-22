export interface Usuario {
  id: number;
  nome: string;
  email: string;
  foto_url: string | null;
  bio: string | null;
  criado_em: string;
}

export interface Artigo {
  id: number;
  titulo: string;
  resumo: string | null;
  conteudo: string;
  categoria: string | null;
  imagem_banner: string | null;
  tempo_leitura: number | null;
  visualizacoes: number;
  autor_id: number;
  autor_nome: string;
  autor_foto?: string | null;
  data_publicacao: string;
  data_atualizacao: string;
  tags: string[];
  total_curtidas: number;
  curtido_pelo_usuario: boolean;
}

export interface Comentario {
  id: number;
  conteudo: string;
  autor_id: number;
  artigo_id: number;
  autor_nome: string;
  autor_foto: string | null;
  criado_em: string;
}