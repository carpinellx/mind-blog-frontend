import { Link, useNavigate } from 'react-router-dom';
import { Moon, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/useAuth';

export default function Header() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate('/');
  }

  const iniciais = usuario?.nome
    .split(' ')
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none flex items-center gap-2 cursor-pointer">
                  <span className="text-sm hidden sm:inline">{usuario.nome}</span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={usuario.foto_url || undefined} alt={usuario.nome} />
                    <AvatarFallback>{iniciais}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{usuario.nome}</p>
                  <p className="text-xs font-normal text-muted-foreground">{usuario.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/configuracoes" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSair} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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