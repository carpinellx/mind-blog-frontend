import { useAuth } from '../contexts/useAuth';

export default function Home() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      {usuario ? (
        <p>Logado como: {usuario.nome} ({usuario.email})</p>
      ) : (
        <p>Ninguém logado ainda.</p>
      )}
    </div>
  );
}