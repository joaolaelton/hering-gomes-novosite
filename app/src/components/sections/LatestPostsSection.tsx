"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const LatestPostsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch 3 latest published posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, slug, title, excerpt, cover_url, category, published_at, created_at')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setPosts(data as Post[]);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
        }
      );

      // Cards stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.blog-card');
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="latest-posts"
      className="relative py-28 bg-charcoal overflow-hidden"
    >
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-[4vw]">
        {/* Heading */}
        <div ref={headingRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <div
              className="gold-rule mb-5"
              style={{ width: '48px', height: '2px', background: '#D4AF37' }}
            />
            <span className="micro-label mb-2 block">Jurídico em pauta</span>
            <h2
              className="heading-display text-white"
              style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}
            >
              Últimas do Blog
            </h2>
          </div>

          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              router.push('/blog');
            }}
            className="flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase hover:gap-4 transition-all duration-300"
          >
            Ver todos os artigos
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            // Skeleton de loading
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="h-[220px] bg-white/10" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-5 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-white/30">
              <p className="text-lg">Nenhum artigo publicado ainda.</p>
              <p className="text-sm mt-2">Publique artigos pelo painel admin para vê-los aqui.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="blog-card group cursor-pointer"
                onMouseEnter={() => setHovered(post.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/blog/${post.slug}`)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.35s ease',
                  transform: hovered === post.id ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow:
                    hovered === post.id
                      ? '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2)'
                      : '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {/* Cover Image */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: '220px' }}
                >
                  <img
                    src={post.cover_url || '/images/hero/escritorio-1.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: hovered === post.id ? 'scale(1.06)' : 'scale(1)',
                    }}
                  />
                  {/* Gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(15,15,15,0.7) 0%, transparent 60%)',
                    }}
                  />
                  {/* Category badge */}
                  <span
                    className="absolute bottom-3 left-4 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.4)',
                      color: '#D4AF37',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div
                    className="flex items-center gap-4 mb-4 text-xs"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Leitura rápida
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-semibold leading-snug mb-3 transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(15px, 1.2vw, 18px)',
                      color: hovered === post.id ? '#D4AF37' : '#ffffff',
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <span
                    className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                    style={{
                      color: '#D4AF37',
                      gap: hovered === post.id ? '12px' : '8px',
                    }}
                  >
                    Ler artigo completo
                    <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestPostsSection;
