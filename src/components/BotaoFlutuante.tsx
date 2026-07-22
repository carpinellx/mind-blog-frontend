import { Link, useLocation } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from './ui/tooltip';

export default function BotaoFlutuante() {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario || location.pathname === '/dashboard/novo-artigo') {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/dashboard/novo-artigo"
            className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:opacity-90 transition-opacity"
          >
            <PenSquare className="w-6 h-6" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Criar novo artigo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}