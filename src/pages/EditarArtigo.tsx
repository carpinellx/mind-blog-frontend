import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, X, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import * as artigoService from '../services/artigoService';

const CATEGORIAS = ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Segurança'];

export default function EditarArtigo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagem, setImagem] = useState<File | undefined>(undefined);
  const [tagAtual, setTagAtual] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const inputImagemRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function buscarArtigo() {
      if (!id) return;
      try {
        const artigo = await artigoService.buscarArtigo(Number(id));
        setTitulo(artigo.titulo);
        setResumo(artigo.resumo || '');
        setCategoria(artigo.categoria || '');
        setConteudo(artigo.conteudo);
        setTags(artigo.tags);
      } catch (erroApi) {
        console.error(erroApi);
        setErro('Erro ao carregar artigo.');
      } finally {
        setCarregando(false);
      }
    }

    buscarArtigo();
  }, [id]);

  function adicionarTag() {
    const nomeTag = tagAtual.trim();
    if (nomeTag && !tags.includes(nomeTag)) {
      setTags([...tags, nomeTag]);
    }
    setTagAtual('');
  }

  function removerTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!titulo || !conteudo || !id) {
      setErro('Título e conteúdo são obrigatórios.');
      return;
    }

    setEnviando(true);

    try {
      await artigoService.atualizarArtigo(Number(id), {
        titulo,
        resumo: resumo || undefined,
        conteudo,
        categoria: categoria || undefined,
        tags,
        imagem,
      });
      navigate(`/artigos/${id}`);
    } catch (erroApi: unknown) {
      if (axios.isAxiosError(erroApi) && erroApi.response?.data?.erro) {
        setErro(erroApi.response.data.erro);
      } else {
        setErro('Erro ao atualizar artigo. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p className="max-w-2xl mx-auto px-6 py-12 text-muted-foreground">Carregando...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-1">Editar Artigo</h1>
      <p className="text-muted-foreground text-sm mb-6">Atualize as informações do seu artigo</p>

      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Título do Artigo *</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Resumo</label>
          <textarea
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-20"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            maxLength={300}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Categoria</label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Nova Imagem de Capa</label>
          <input
            ref={inputImagemRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImagem(e.target.files?.[0])}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputImagemRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {imagem ? imagem.name : 'Escolher nova imagem'}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">Deixe em branco para manter a imagem atual.</p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagAtual}
              onChange={(e) => setTagAtual(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  adicionarTag();
                }
              }}
              placeholder="Digite e pressione Enter"
            />
            <Button type="button" variant="outline" onClick={adicionarTag}>Adicionar</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {tag}
                  <button type="button" onClick={() => removerTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Conteúdo do Artigo *</label>
          <textarea
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-60"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
          />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Link to="/dashboard">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}