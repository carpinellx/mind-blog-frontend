import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/useAuth';

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      await entrar(email, senha);
      navigate('/');
    } catch {
      setErro('Email ou senha inválidos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <p className="text-3xl font-bold mb-4">{'<M/>'}</p>
        <h1 className="text-2xl font-bold mb-1">Entrar na Plataforma</h1>
        <p className="text-muted-foreground text-sm">Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <Input
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Senha</label>
          <Input
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit" disabled={enviando} className="w-full">
          <LogIn className="w-4 h-4 mr-1" /> {enviando ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-foreground font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}