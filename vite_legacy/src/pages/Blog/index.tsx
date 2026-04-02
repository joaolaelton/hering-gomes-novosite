import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import FooterSection from '../../sections/FooterSection';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BookOpen, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string;
  published_at: string | null;
  created_at: string;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800';

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, slug, title, excerpt, cover_url, category, published_at, created_at')
        .eq('published', true)
        .order('published_at', { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = ['Todos', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === 'Todos' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-charcoal min-h-screen text-white/90">
      <Navigation />

      <main className="pt-32 pb-24 px-[4vw] max-w-7xl mx-auto min-h-[80vh]">
        {/* Header */}
        <div className="mb-12">
          <div style={{ width: '40px', height: '2px', background: '#D4AF37', marginBottom: '16px' }} />
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white">
            Artigos e <span className="text-gold">Notícias</span>
          </h1>
          <p className="mt-4 text-white/50 max-w-lg">
            Atualizações jurídicas, análises de legislação e orientações do escritório Hering Gomes.
          </p>
        </div>

        {/* Category Filter */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? 'bg-gold text-charcoal border-gold font-bold'
                    : 'border-white/10 text-white/50 hover:border-gold/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32 gap-3 text-white/30">
            <Loader2 className="animate-spin" size={24} />
            <span>Carregando artigos…</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-white/30">
            <BookOpen size={48} />
            <p className="text-lg font-medium">Nenhum artigo publicado ainda.</p>
            <p className="text-sm">Volte em breve — o escritório está preparando conteúdo para você.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-neutral-900 rounded-xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col shadow-lg hover:shadow-gold/5"
              >
                <div className="w-full h-52 overflow-hidden bg-neutral-800">
                  <img
                    src={post.cover_url || PLACEHOLDER}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{post.category}</span>
                    <span className="text-white/30 text-xs">{formatDate(post.published_at ?? post.created_at)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-white/55 text-sm line-clamp-3 mb-5 flex-1">{post.excerpt}</p>
                  )}
                  <div className="text-gold text-sm font-semibold mt-auto flex items-center gap-2">
                    Ler artigo{' '}
                    <span className="group-hover:translate-x-1.5 transition-transform inline-block">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
