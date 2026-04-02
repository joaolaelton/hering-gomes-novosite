"use client";
import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);


const VISIBLE = 3; // cards por vez em desktop

// Google icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.6 24.5c0-1.5-.1-3-.4-4.5H24v8.5h11.1c-.5 2.5-2 4.7-4.1 6.1v5h6.6c3.9-3.6 6-8.9 6-15.1z" fill="#4285F4"/>
    <path d="M24 44c5.5 0 10.2-1.8 13.6-5l-6.6-5c-1.8 1.2-4.2 1.9-7 1.9-5.4 0-10-3.6-11.6-8.5H5.6v5.2C9 39.1 16 44 24 44z" fill="#34A853"/>
    <path d="M12.4 27.4c-.4-1.2-.7-2.5-.7-3.8s.2-2.6.7-3.8v-5.2H5.6C4.2 17.1 3.2 20.4 3.2 24s1 6.9 2.4 9.4l6.8-6z" fill="#FBBC05"/>
    <path d="M24 10.8c3 0 5.7 1 7.8 3l5.8-5.8C34.2 4.8 29.5 3 24 3 16 3 9 7.9 5.6 14.6l6.8 5.2c1.6-4.9 6.2-9 11.6-9z" fill="#EA4335"/>
  </svg>
);


interface Review {
  id: string;
  author: string;
  role: string | null;
  rating: number;
  text: string;
  date_label: string;
  avatar_color: string;
}

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dbReviews, setDbReviews] = useState<Review[]>([]);


  // ONLY database reviews — no static fallback
  const allReviews = dbReviews;
  const total = allReviews.length || 1;


  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Fetch reviews from Supabase
  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setDbReviews(data as Review[]);
      });
  }, []);

  // Auto-play a cada 5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.3,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Animação do carousel re-executa quando os dados chegam do banco
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || dbReviews.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        carouselRef.current,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.3,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [dbReviews]);

  // Índices dos cards visíveis (3 no desktop, 1 no mobile)
  const getVisibleIndexes = () => {
    const idxs = [];
    for (let i = 0; i < VISIBLE; i++) {
      idxs.push((current + i) % total);
    }
    return idxs;
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative bg-charcoal py-24 lg:py-32 z-[60] overflow-hidden"
    >
      {/* Subtle gradient decoration */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[1px] bg-gradient-to-l from-gold/30 to-transparent"
      />
      <div
        className="absolute bottom-0 left-0 w-[40vw] h-[1px] bg-gradient-to-r from-gold/30 to-transparent"
      />

      <div className="px-[4vw]">
        {/* Header */}
        <div
          ref={titleRef}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <span className="micro-label mb-4 block">Depoimentos Reais</span>
            <h2
              className="heading-section text-white"
              style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
            >
              O Que Dizem Nossos{' '}
              <span className="text-gold">Clientes</span>
            </h2>
            <p className="text-secondary-gray text-base leading-relaxed mt-4 max-w-lg">
              Avaliações verificadas diretamente no Google Meu Negócio.
            </p>
          </div>

          {/* Google rating badge */}
          <a
            href="https://share.google/ugSFYe9JorYy1hK3l"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 bg-charcoal-light border border-white/10 hover:border-gold/40 transition-all duration-300 group flex-shrink-0 self-start lg:self-auto"
          >
            <GoogleIcon />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-2xl">5,0</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#FBBC05] fill-[#FBBC05]" />
                  ))}
                </div>
              </div>
              <p className="text-secondary-gray text-xs mt-0.5">Ver no Google Meu Negócio →</p>
            </div>
          </a>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleIndexes().map((idx, pos) => {
              const review = allReviews[idx];
              if (!review) return null;
              const initials = review.author
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              return (
                <div
                  key={`${idx}-${pos}`}
                  className="p-7 bg-charcoal-light border border-white/5 hover:border-gold/20 transition-all duration-500 relative flex flex-col"
                >
                  {/* Top row: avatar + name + google logo */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      {/* Initial avatar */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: review.avatar_color || '#4285F4' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-tight">
                          {review.author}
                        </p>
                        <p className="text-secondary-gray text-xs mt-0.5">{review.date_label}</p>
                      </div>
                    </div>
                    {/* Google icon */}
                    <div className="flex-shrink-0 opacity-70">
                      <GoogleIcon />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < (review.rating ?? 5) ? 'text-[#FBBC05] fill-[#FBBC05]' : 'text-white/20 fill-transparent'}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-white/80 text-sm leading-relaxed mt-4 flex-1 italic line-clamp-5">
                    "{review.text}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {allReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir para avaliação ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-6 h-2 bg-gold'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                aria-label="Avaliação anterior"
                className="w-11 h-11 border border-white/20 hover:border-gold hover:text-gold text-white/60 transition-all duration-300 flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Próxima avaliação"
                className="w-11 h-11 border border-white/20 hover:border-gold hover:text-gold text-white/60 transition-all duration-300 flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
