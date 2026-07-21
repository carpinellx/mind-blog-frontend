import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/useAuth';

export default function Header() {
  const { usuario } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          {'<M/>'}
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/artigos" className="text-sm hover:text-primary transition-colors">
            Artigos
          </Link>

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="w-5 h-5" />
          </button>

          {usuario ? (
            <span className="text-sm">Olá, {usuario.nome}</span>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button>Cadastrar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}