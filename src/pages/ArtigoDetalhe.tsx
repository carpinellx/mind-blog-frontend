import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart } from 'lucide-react';
import * as artigoService from '../services/artigoService';
import type { Artigo } from '../types';
import { useAuth } from '../contexts/useAuth';
import { Button } from '../components/ui/button';

export default function ArtigoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { usuario } = useAuth();
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(0);

  useEffect(() => {
    async function buscarArtigo() {
      if (!id) return;
      try {
        const dados = await artigoService.buscarArtigo(Number(id));
        setArtigo(dados);
        setTotalCurtidas(dados.total_curtidas);
      } catch (erro) {
        console.error('Erro ao buscar artigo:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarArtigo();
  }, [id]);

  async function handleCurtir() {
    if (!usuario || !id) return;

    try {
      const resultado = await artigoService.alternarCurtida(Number(id));
      setCurtido(resultado.curtido);
      setTotalCurtidas(resultado.total_curtidas);
    } catch (erro) {
      console.error('Erro ao curtir:', erro);
    }
  }

  if (carregando) {
    return <p className="max-w-3xl mx-auto px-6 py-12 text-muted-foreground">Carregando...</p>;
  }

  if (!artigo) {
    return <p className="max-w-3xl mx-auto px-6 py-12 text-muted-foreground">Artigo não encontrado.</p>;
  }

  const urlImagem = artigo.imagem_banner ? `http://localhost:3333/uploads/${artigo.imagem_banner}` : null;
  const dataFormatada = new Date(artigo.data_publicacao).toLocaleDateString('pt-BR');

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link to="/artigos" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar aos Artigos
      </Link>

      {artigo.categoria && (
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
          {artigo.categoria}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-3">{artigo.titulo}</h1>

      {artigo.resumo && <p className="text-muted-foreground mb-4">{artigo.resumo}</p>}

      <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-4 mb-6">
        <span>{artigo.autor_nome}</span>
        <span>{dataFormatada}</span>
        {artigo.tempo_leitura && (
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {artigo.tempo_leitura}min</span>
        )}
        <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {artigo.visualizacoes} visualizações</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button variant={curtido ? 'default' : 'outline'} size="sm" onClick={handleCurtir} disabled={!usuario}>
          <Heart className={`w-4 h-4 mr-1 ${curtido ? 'fill-current' : ''}`} /> {totalCurtidas}
        </Button>
        {!usuario && <span className="text-xs text-muted-foreground">Faça login para curtir</span>}
      </div>

      {urlImagem && (
        <img src={urlImagem} alt={artigo.titulo} className="w-full rounded-lg mb-6" />
      )}

      <div className="prose prose-invert max-w-none mb-8 whitespace-pre-line">
        {artigo.conteudo}
      </div>

      {artigo.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {artigo.tags.map((tag) => (
            <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}