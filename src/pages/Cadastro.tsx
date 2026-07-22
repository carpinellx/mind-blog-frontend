import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/useAuth';
import * as authService from '../services/authService';
import axios from 'axios';

export default function Cadastro() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErro('');

  if (senha !== confirmarSenha) {
    setErro('As senhas não coincidem.');
    return;
  }

  setEnviando(true);

  try {
    await authService.cadastrar(nome, email, senha);
    await entrar(email, senha);
    navigate('/');
  } catch (erroApi: unknown) {
    if (axios.isAxiosError(erroApi) && erroApi.response?.data?.erro) {
      setErro(erroApi.response.data.erro);
    } else {
      setErro('Erro ao criar conta.');
    }
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
          <label className="text-sm font-medium block mb-1">Nome Completo</label>
          <Input
            placeholder="John Doe"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

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
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Confirmar senha</label>
          <Input
            type="password"
            placeholder="********"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit" disabled={enviando} className="w-full">
          <UserPlus className="w-4 h-4 mr-1" /> {enviando ? 'Criando conta...' : 'Criar conta'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-foreground font-medium hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}