import { useEffect, useRef, useState } from 'react';import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle, Trash2, Pencil } from 'lucide-react';import * as artigoService from '../services/artigoService';
import type { Artigo, Comentario } from '../types';import { useAuth } from '../contexts/useAuth';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';


export default function ArtigoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { usuario } = useAuth();
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(0);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const jaExecutou = useRef(false);

useEffect(() => {
  if (jaExecutou.current) return;
  jaExecutou.current = true;

  async function buscarDados() {
    if (!id) return;
    try {
      const [dadosArtigo, dadosComentarios] = await Promise.all([
        artigoService.buscarArtigo(Number(id)),
        artigoService.listarComentarios(Number(id)),
      ]);
      setArtigo(dadosArtigo);
      setTotalCurtidas(dadosArtigo.total_curtidas);
      setCurtido(dadosArtigo.curtido_pelo_usuario);
      setComentarios(dadosComentarios);
    } catch (erro) {
      console.error('Erro ao buscar artigo:', erro);
    } finally {
      setCarregando(false);
    }
  }

  buscarDados();
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

async function handleComentar(e: React.FormEvent) {
  e.preventDefault();
  if (!novoComentario.trim() || !id || !usuario) return;

  setEnviandoComentario(true);
  try {
    const comentarioCriado = await artigoService.criarComentario(Number(id), novoComentario);
    const comentarioCompleto: Comentario = {
      ...comentarioCriado,
      autor_nome: usuario.nome,
      autor_foto: usuario.foto_url,
    };
    setComentarios([comentarioCompleto, ...comentarios]);
    setNovoComentario('');
  } catch (erro) {
    console.error('Erro ao comentar:', erro);
  } finally {
    setEnviandoComentario(false);
  }
}

async function handleExcluirComentario(comentarioId: number) {
  try {
    await artigoService.excluirComentario(comentarioId);
    setComentarios(comentarios.filter((c) => c.id !== comentarioId));
  } catch (erro) {
    console.error('Erro ao excluir comentário:', erro);
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

        {usuario?.id === artigo.autor_id && (
          <Link to={`/dashboard/editar-artigo/${artigo.id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-1" /> Editar Artigo
            </Button>
          </Link>
        )}
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

      <div className="border-t border-border pt-6">
    <h2 className="font-semibold mb-4 flex items-center gap-2">
      <MessageCircle className="w-4 h-4" /> {comentarios.length === 1 ? 'Comentário' : 'Comentários'} ({comentarios.length})
    </h2>

  {usuario ? (
    <form onSubmit={handleComentar} className="flex flex-col gap-2 mb-6">
      <textarea
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-20"
        placeholder="Escreva um comentário..."
        value={novoComentario}
        onChange={(e) => setNovoComentario(e.target.value)}
      />
      <Button type="submit" disabled={enviandoComentario} className="self-start">
        {enviandoComentario ? 'Publicando...' : 'Publicar Comentário'}
      </Button>
    </form>
  ) : (
    <div className="border border-border rounded-lg p-4 text-center mb-6">
      <p className="text-sm text-muted-foreground mb-2">Faça login para comentar</p>
      <Link to="/login">
        <Button size="sm">Fazer login</Button>
      </Link>
    </div>
  )}

    <div className="flex flex-col gap-4">
      {comentarios.map((comentario) => (
        <div key={comentario.id} className="flex gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={comentario.autor_foto || undefined} alt={comentario.autor_nome} />
            <AvatarFallback>{comentario.autor_nome[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{comentario.autor_nome}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(comentario.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {usuario?.id === comentario.autor_id && (
                <button onClick={() => handleExcluirComentario(comentario.id)}>
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>
            <p className="text-sm mt-1">{comentario.conteudo}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
    </div>

    
  );
}