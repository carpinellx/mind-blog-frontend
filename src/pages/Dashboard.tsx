import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Plus, Pencil, Trash2, FileText, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useAuth } from '../contexts/useAuth';
import * as artigoService from '../services/artigoService';
import * as dashboardService from '../services/dashboardService';
import type { Artigo } from '../types';
import type { Estatisticas, AtividadeRecente } from '../services/dashboardService';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [meusArtigos, setMeusArtigos] = useState<Artigo[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [artigoParaExcluir, setArtigoParaExcluir] = useState<number | null>(null);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);

  useEffect(() => {
    async function buscarDados() {
      if (!usuario) return;
      try {
        const [todosArtigos, dadosEstatisticas, dadosAtividades] = await Promise.all([
          artigoService.listarArtigos(),
          dashboardService.buscarEstatisticas(),
          dashboardService.buscarAtividadeRecente(),
        ]);

        setMeusArtigos(todosArtigos.filter((artigo) => artigo.autor_id === usuario.id));
        setEstatisticas(dadosEstatisticas);
        setAtividades(dadosAtividades);
      } catch (erro) {
        console.error('Erro ao buscar dados do dashboard:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, [usuario]);

  async function handleExcluir() {
    if (!artigoParaExcluir) return;

    try {
      await artigoService.excluirArtigo(artigoParaExcluir);
      setMeusArtigos((atual) => atual.filter((artigo) => artigo.id !== artigoParaExcluir));
    } catch (erro) {
      console.error('Erro ao excluir artigo:', erro);
    } finally {
      setArtigoParaExcluir(null);
    }
  }

  if (carregando) {
    return <p className="max-w-6xl mx-auto px-6 py-12 text-muted-foreground">Carregando...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {usuario?.nome}!</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/configuracoes">
            <Button variant="outline"><Settings className="w-4 h-4 mr-1" /> Configurações</Button>
          </Link>
          <Link to="/dashboard/novo-artigo">
            <Button><Plus className="w-4 h-4 mr-1" /> Novo Artigo</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de Artigos</span>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{estatisticas?.total_artigos ?? 0}</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Engajamento</span>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{estatisticas?.total_comentarios ?? 0}</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Curtidas</span>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{estatisticas?.total_curtidas ?? 0}</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tempo médio de leitura</span>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{estatisticas?.tempo_medio_leitura ?? 0} min</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Meus Artigos</h2>

          {meusArtigos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Você ainda não publicou nenhum artigo.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {meusArtigos.map((artigo) => (
                <div key={artigo.id} className="flex items-center justify-between py-4 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{artigo.titulo}</p>
                    <p className="text-sm text-muted-foreground truncate">{artigo.resumo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')} · {artigo.total_curtidas} curtidas
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/dashboard/editar-artigo/${artigo.id}`}>
                      <Button variant="outline" size="sm"><Pencil className="w-4 h-4 mr-1" /> Editar</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => setArtigoParaExcluir(artigo.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Atividade Recente</h2>

          {atividades.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma atividade recente.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {atividades.map((atividade) => (
                <div key={atividade.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={atividade.autor_foto || undefined} alt={atividade.autor_nome} />
                    <AvatarFallback>{atividade.autor_nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{atividade.autor_nome}</span> comentou em{' '}
                      <Link to={`/artigos/${atividade.artigo_id}`} className="text-primary hover:underline">
                        {atividade.artigo_titulo}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(atividade.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={artigoParaExcluir !== null} onOpenChange={(aberto) => !aberto && setArtigoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Artigo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}