import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TodosArtigos from './pages/TodosArtigos';
import ArtigoDetalhe from './pages/ArtigoDetalhe';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import RotaProtegida from './components/RotaProtegida';
import NovoArtigo from './pages/NovoArtigo';
import EditarArtigo from './pages/EditarArtigo';
import Configuracoes from './pages/Configuracoes';
import BotaoFlutuante from './components/BotaoFlutuante';
import ScrollParaTopo from './components/ScrollParaTopo';

function App() {
  return (
    <>
      <ScrollParaTopo />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<TodosArtigos />} />
        <Route path="/artigos/:id" element={<ArtigoDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/novo-artigo"
          element={
            <RotaProtegida>
              <NovoArtigo />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/editar-artigo/:id"
          element={
            <RotaProtegida>
              <EditarArtigo />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/configuracoes"
          element={
            <RotaProtegida>
              <Configuracoes />
            </RotaProtegida>
          }
        />
      </Routes>
      <Footer />
      <BotaoFlutuante />
    </>
  );
}

export default App;