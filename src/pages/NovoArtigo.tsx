import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
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
import axios from 'axios';

const CATEGORIAS = ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Segurança'];

export default function NovoArtigo() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagem, setImagem] = useState<File | undefined>(undefined);
  const [tagAtual, setTagAtual] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

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
    

    if (!titulo || !conteudo) {
      setErro('Título e conteúdo são obrigatórios.');
      return;
    }

    setEnviando(true);

    try {
      const artigoCriado = await artigoService.criarArtigo({
        titulo,
        resumo: resumo || undefined,
        conteudo,
        categoria: categoria || undefined,
        tags,
        imagem,
      });
      navigate(`/artigos/${artigoCriado.id}`);
    } catch (erroApi: unknown) {
  if (axios.isAxiosError(erroApi) && erroApi.response?.data?.erro) {
    setErro(erroApi.response.data.erro);
  } else {
    setErro('Erro ao criar artigo. Tente novamente.');
  }
} finally {
  setEnviando(false);
}
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-1">Criar Novo Artigo</h1>
      <p className="text-muted-foreground text-sm mb-6">Compartilhe seu conhecimento com a comunidade</p>

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
          <label className="text-sm font-medium block mb-1">Imagem de Capa</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImagem(e.target.files?.[0])}
            className="text-sm"
          />
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
            {enviando ? 'Publicando...' : 'Publicar Artigo'}
          </Button>
          <Link to="/dashboard">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}