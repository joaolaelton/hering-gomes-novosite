import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import FooterSection from '../../sections/FooterSection';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Clock, Tag, Loader2, AlertCircle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  cover_url: string | null;
  category: string;
  published_at: string | null;
  created_at: string;
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function estimateReadTime(html: string | null): string {
  if (!html) return '1 min';
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de leitura`;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, cover_url, category, published_at, created_at')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!data || error) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  return (
    <div className="bg-charcoal min-h-screen text-white/90">
      <Navigation />

      <main className="pt-32 pb-24 px-[4vw] max-w-4xl mx-auto min-h-[80vh]">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-white/50 hover:text-gold mb-10 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Voltar para os artigos
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32 gap-3 text-white/30">
            <Loader2 className="animate-spin" size={24} />
            <span>Carregando artigo…</span>
          </div>
        )}

        {/* Not Found */}
        {notFound && !loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-white/40 text-center">
            <AlertCircle size={48} />
            <h2 className="text-2xl font-bold text-white">Artigo não encontrado</h2>
            <p className="text-sm max-w-xs">
              Este artigo pode ter sido removido ou o endereço está incorreto.
            </p>
            <Link
              to="/blog"
              className="mt-4 px-6 py-2.5 bg-gold text-charcoal text-sm font-bold rounded-lg hover:bg-white transition-colors"
            >
              Ver todos os artigos
            </Link>
          </div>
        )}

        {/* Post Content */}
        {post && !loading && (
          <>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
              <span className="flex items-center gap-1.5">
                <Tag size={14} className="text-gold" />
                <span className="text-gold font-semibold">{post.category}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDate(post.published_at ?? post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {estimateReadTime(post.content)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight mb-8">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-white/60 leading-relaxed mb-10 border-l-2 border-gold pl-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Cover Image */}
            {post.cover_url && (
              <div className="w-full aspect-[21/9] rounded-xl overflow-hidden mb-12 border border-white/10 shadow-lg">
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Separator */}
            <div
              className="w-12 h-0.5 mb-12"
              style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
            />

            {/* Article Body */}
            <article
              className="
                prose prose-lg prose-invert max-w-none
                prose-headings:font-serif prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-gold prose-h2:pl-4
                prose-p:text-white/75 prose-p:leading-relaxed
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-gold prose-blockquote:text-white/60 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                prose-strong:text-white
                prose-li:text-white/75
                prose-img:rounded-xl prose-img:border prose-img:border-white/10
              "
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />

            {/* Footer CTA */}
            <div
              className="mt-16 p-8 rounded-xl text-center"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <p className="text-white/70 mb-2 text-sm uppercase tracking-widest">Precisa de orientação jurídica?</p>
              <h3 className="text-xl font-bold text-white mb-5">Fale com o escritório Hering Gomes</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/5548991199407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3 bg-gold text-charcoal font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white transition-colors"
                >
                  WhatsApp
                </a>
                <Link
                  to="/#contact"
                  className="px-7 py-3 border border-gold/30 text-gold font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-gold/10 transition-colors"
                >
                  Formulário de contato
                </Link>
              </div>
            </div>

            {/* Back link bottom */}
            <div className="mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-sm"
              >
                <ArrowLeft size={14} />
                Todos os artigos
              </Link>
            </div>
          </>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
