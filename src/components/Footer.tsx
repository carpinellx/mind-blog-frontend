import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-sm">
          <p className="text-2xl font-bold mb-2">{'<M/>'}</p>
          <p className="text-sm text-muted-foreground">
            Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3">Navegação</p>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/artigos" className="hover:text-foreground transition-colors">Artigos</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </nav>
        </div>

        <div>
          <p className="font-semibold mb-3">Redes Sociais</p>
          <div className="flex gap-4 text-muted-foreground">
            <FaLinkedin className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
            <FaGithub className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
            <FaTwitter className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © 2026 TechBlog. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}