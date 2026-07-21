import { useEffect, useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import ArtigoCard from '../components/ArtigoCard';
import * as artigoService from '../services/artigoService';
import type { Artigo } from '../types';

const CATEGORIAS = ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Segurança'];

export default function TodosArtigos() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [layout, setLayout] = useState<'grid' | 'lista'>('grid');

  useEffect(() => {
    async function buscarDados() {
      try {
        const dados = await artigoService.listarArtigos();
        setArtigos(dados);
      } catch (erro) {
        console.error('Erro ao buscar artigos:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  const artigosFiltrados = artigos.filter((artigo) => {
    const bateBusca = artigo.titulo.toLowerCase().includes(busca.toLowerCase());
    const bateCategoria = categoriaFiltro === 'todas' || artigo.categoria === categoriaFiltro;
    return bateBusca && bateCategoria;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-1">Todos os Artigos</h1>
      <p className="text-muted-foreground mb-6">Explore nossa coleção completa de artigos técnicos</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {CATEGORIAS.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 border border-border rounded-md p-1">
          <button
            onClick={() => setLayout('grid')}
            className={`p-2 rounded ${layout === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('lista')}
            className={`p-2 rounded ${layout === 'lista' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="text-muted-foreground">Carregando artigos...</p>
      ) : artigosFiltrados.length === 0 ? (
        <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigosFiltrados.map((artigo) => (
            <ArtigoCard key={artigo.id} artigo={artigo} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {artigosFiltrados.map((artigo) => (
            <ArtigoCard key={artigo.id} artigo={artigo} layout="lista" />
          ))}
        </div>
      )}
    </div>
  );
}