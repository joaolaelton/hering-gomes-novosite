import { useEffect, useState } from 'react';
import { FileText, Star, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Stats {
  posts: number;
  reviews: number;
  contacts: number;
}

export default function AdminResume() {
  const [stats, setStats] = useState<Stats>({ posts: 0, reviews: 0, contacts: 0 });
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [postsRes, reviewsRes, contactsRes] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('contact_submissions').select('id, name, subject, created_at, read').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        posts: postsRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        contacts: contactsRes.data?.length ?? 0,
      });
      setContacts(contactsRes.data ?? []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FileText, label: 'Artigos Publicados', value: stats.posts, path: '/admin/blog', color: 'text-blue-400 bg-blue-400/10' },
    { icon: Star, label: 'Avaliações Ativas', value: stats.reviews, path: '/admin/reviews', color: 'text-gold bg-gold/10' },
    { icon: Mail, label: 'Contatos Recentes', value: stats.contacts, path: null, color: 'text-green-400 bg-green-400/10' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Painel de Controle</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map(({ icon: Icon, label, value, path, color }) => (
          <div key={label} className="bg-charcoal-light border border-white/5 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 font-medium text-sm">{label}</h3>
              <div className={`p-3 rounded-lg ${color}`}><Icon size={20} /></div>
            </div>
            <p className="text-4xl font-bold text-white">{loading ? '—' : value}</p>
            {path && (
              <Link to={path} className="mt-4 flex items-center gap-1 text-xs text-white/40 hover:text-gold transition-colors">
                Gerenciar <ArrowRight size={12} />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Mail size={20} className="text-gold" />
          Últimas Mensagens de Contato
        </h2>
        <div className="bg-charcoal-light border border-white/5 rounded-xl overflow-hidden">
          {contacts.length === 0 ? (
            <p className="text-white/40 text-sm p-6">Nenhuma mensagem recebida ainda.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-black/20">
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Assunto</th>
                  <th className="px-4 py-3 text-left font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map((c) => (
                  <tr key={c.id} className={`hover:bg-white/5 transition-colors ${!c.read ? 'font-semibold' : ''}`}>
                    <td className="px-4 py-3 text-white">{c.name}{!c.read && <span className="ml-2 inline-block w-2 h-2 bg-gold rounded-full" />}</td>
                    <td className="px-4 py-3 text-white/60 hidden md:table-cell">{c.subject || '—'}</td>
                    <td className="px-4 py-3 text-white/40">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/blog" className="bg-charcoal-light hover:bg-white/5 border border-white/10 rounded-xl p-6 text-left transition-colors flex items-center justify-between group">
          <div>
            <h4 className="font-semibold text-white mb-1 group-hover:text-gold transition-colors">Escrever novo Artigo</h4>
            <p className="text-sm text-white/50">Publique novidades no blog.</p>
          </div>
          <ArrowRight size={18} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link to="/admin/reviews" className="bg-charcoal-light hover:bg-white/5 border border-white/10 rounded-xl p-6 text-left transition-colors flex items-center justify-between group">
          <div>
            <h4 className="font-semibold text-white mb-1 group-hover:text-gold transition-colors">Gerenciar Avaliações</h4>
            <p className="text-sm text-white/50">Adicione ou oculte depoimentos.</p>
          </div>
          <ArrowRight size={18} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
