import { Link } from 'react-router-dom';
import { Clock, Eye, Heart } from 'lucide-react';
import type { Artigo } from '../types';

interface ArtigoCardProps {
  artigo: Artigo;
  layout?: 'grid' | 'lista';
}

const CORES_PLACEHOLDER = [
  'bg-gradient-to-br from-pink-300 to-blue-300',
  'bg-gradient-to-br from-blue-300 to-purple-300',
  'bg-gradient-to-br from-green-300 to-blue-300',
];

export default function ArtigoCard({ artigo, layout = 'grid' }: ArtigoCardProps) {
  const corPlaceholder = CORES_PLACEHOLDER[artigo.id % CORES_PLACEHOLDER.length];
  const urlImagem = artigo.imagem_banner
    ? `http://localhost:3333/uploads/${artigo.imagem_banner}`
    : null;

  const dataFormatada = new Date(artigo.data_publicacao).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (layout === 'lista') {
    return (
      <Link to={`/artigos/${artigo.id}`} className="group flex gap-4 border border-border rounded-lg p-4 hover:border-primary transition-colors">
        <div className={`w-40 h-28 shrink-0 rounded-md overflow-hidden ${!urlImagem ? corPlaceholder : ''}`}>
          {urlImagem && (
            <img src={urlImagem} alt={artigo.titulo} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            {artigo.categoria && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                {artigo.categoria}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{dataFormatada}</span>
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">{artigo.titulo}</h3>
          {artigo.resumo && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{artigo.resumo}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span>{artigo.autor_nome}</span>
            {artigo.tempo_leitura && (
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {artigo.tempo_leitura}min</span>
            )}
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {artigo.visualizacoes}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {artigo.total_curtidas}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/artigos/${artigo.id}`} className="group block">
      <div className={`h-40 rounded-t-lg overflow-hidden ${!urlImagem ? corPlaceholder : ''}`}>
        {urlImagem && (
          <img src={urlImagem} alt={artigo.titulo} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="bg-card border border-border border-t-0 rounded-b-lg p-4">
        <div className="flex items-center justify-between mb-2">
          {artigo.categoria && (
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {artigo.categoria}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{dataFormatada}</span>
        </div>

        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{artigo.titulo}</h3>

        {artigo.resumo && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{artigo.resumo}</p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{artigo.autor_nome}</span>
          <div className="flex items-center gap-3">
            {artigo.tempo_leitura && (
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {artigo.tempo_leitura}min</span>
            )}
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {artigo.visualizacoes}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {artigo.total_curtidas}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}