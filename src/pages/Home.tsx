import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import ArtigoCard from '../components/ArtigoCard';
import * as artigoService from '../services/artigoService';
import { useAuth } from '../contexts/useAuth';
import type { Artigo } from '../types';

export default function Home() {
  const { usuario } = useAuth();
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [carregando, setCarregando] = useState(true);

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

const destaques = [...artigos].sort((a, b) => b.total_curtidas - a.total_curtidas).slice(0, 3);
const recentes = [...artigos].slice(0, 6);

  return (
    <div>
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Explore o Futuro da <span className="text-primary">Tecnologia</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/artigos">
            <Button size="lg">Explorar Artigos</Button>
          </Link>
          <Link to={usuario ? '/dashboard/novo-artigo' : '/cadastro'}>
            <Button size="lg" variant="outline">Começar a Escrever</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Artigos em Destaque</h2>
            <p className="text-muted-foreground text-sm">Os melhores conteúdos selecionados para você</p>
          </div>
          <Link to="/artigos" className="text-primary text-sm hover:underline">
            Ver todos →
          </Link>
        </div>

        {carregando ? (
          <p className="text-muted-foreground">Carregando artigos...</p>
        ) : destaques.length === 0 ? (
          <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destaques.map((artigo) => (
              <ArtigoCard key={artigo.id} artigo={artigo} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-1">Artigos Recentes</h2>
        <p className="text-muted-foreground text-sm mb-6">Conteúdo recente da comunidade</p>

        {!carregando && recentes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentes.map((artigo) => (
              <ArtigoCard key={artigo.id} artigo={artigo} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-card border-y border-border py-16 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Newsletter Semanal</h2>
          <p className="text-muted-foreground mb-6">
            Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteúdo de qualidade.
          </p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="exemplo@email.com"
              className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm"
            />
            <Button type="submit">Inscrever</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Mais de 10.000 desenvolvedores já recebem nossa newsletter
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Compartilhe Seu Conhecimento</h2>
        <p className="text-muted-foreground mb-6">
          Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia
        </p>
        <Link to="/cadastro">
          <Button size="lg">Criar Conta Gratuita</Button>
        </Link>
      </section>
    </div>
  );
  
}