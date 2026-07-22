import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/useAuth';
import * as authService from '../services/authService';

export default function Configuracoes() {
  const { usuario, atualizarUsuarioLocal } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [bio, setBio] = useState(usuario?.bio || '');
  const [fotoUrl, setFotoUrl] = useState(usuario?.foto_url || '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      const usuarioAtualizado = await authService.atualizarPerfil(nome, bio || null, fotoUrl || null);
      atualizarUsuarioLocal(usuarioAtualizado);
      navigate('/dashboard');
    } catch (erroApi: unknown) {
      if (axios.isAxiosError(erroApi) && erroApi.response?.data?.erro) {
        setErro(erroApi.response.data.erro);
      } else {
        setErro('Erro ao salvar alterações.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-1">Configurações do Perfil</h1>
      <p className="text-muted-foreground text-sm mb-6">Gerencie suas informações pessoais</p>

      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 flex flex-col gap-4">
        {fotoUrl && (
          <img src={fotoUrl} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover mx-auto" />
        )}

        <div>
          <label className="text-sm font-medium block mb-1">Foto de Perfil</label>
          <Input
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">Adicione uma imagem ou deixe em branco</p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Nome Completo</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <Input value={usuario?.email || ''} disabled />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Bio</label>
          <textarea
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-24"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 caracteres</p>
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
}