import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    // If login succeeds, onAuthStateChange will flip isAuthenticated
    // and DashboardLayout redirect will navigate the user in
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative">
      <div className="grain-overlay" />

      <div className="bg-charcoal-light w-full max-w-md p-8 md:p-10 rounded-2xl border border-white/5 relative z-10 shadow-2xl">
        <div className="flex justify-center mb-8 w-[260px] mx-auto">
          <img src="/images/logo-hd.png" alt="Hering Gomes Logo" className="w-full h-auto" />
        </div>

        <h2 className="text-3xl font-serif font-bold text-center text-white mb-2">Acesso Restrito</h2>
        <p className="text-center text-white/50 mb-8 text-sm">Painel de gerenciamento do site</p>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              {error === 'Invalid login credentials'
                ? 'E-mail ou senha incorretos.'
                : error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 uppercase tracking-wider block">
              Email Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md leading-5 bg-charcoal text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors sm:text-sm"
                placeholder="advogado@heringgomes.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 uppercase tracking-wider block">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md leading-5 bg-charcoal text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-charcoal bg-gold hover:bg-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold focus:ring-offset-charcoal font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <span className="text-xs text-white/30">Hering Gomes Advogados Associados © 2026</span>
        </div>
      </div>
    </div>
  );
}
