import { useEffect, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Only the 5 real office photos
const HERO_IMAGES = [
  { src: '/images/hero/escritorio-1.jpg', alt: 'Gabinete principal' },
  { src: '/images/hero/escritorio-2.jpg', alt: 'Recepção e sala de espera' },
  { src: '/images/hero/escritorio-3.jpg', alt: 'Sala de reunião' },
  { src: '/images/hero/escritorio-4.jpg', alt: 'Estante de livros e jardim vertical' },
  { src: '/images/hero/escritorio-5.jpg', alt: 'Entrada e recepção' },
];

const SLIDE_DURATION = 5000; // ms per slide

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    setPrev(current);
    setCurrent(index);
  }, [current]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % HERO_IMAGES.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }, [current, goToSlide]);

  // Auto-advance carousel
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  // Clear prev after transition
  useEffect(() => {
    if (prev === null) return;
    const timer = setTimeout(() => setPrev(null), 1000);
    return () => clearTimeout(timer);
  }, [current, prev]);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2 }
      );

      tl.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, transformOrigin: 'left' },
        '-=0.8'
      );

      tl.fromTo(
        labelRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      );

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          '-=0.3'
        );
      }

      tl.fromTo(
        bodyRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      );

      tl.fromTo(
        ctaRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([labelRef.current, headlineRef.current, bodyRef.current, ctaRef.current, ruleRef.current], {
              opacity: 1, x: 0, y: 0, scaleX: 1,
            });
            gsap.set(bgRef.current, { scale: 1, y: 0 });
          },
        },
      });

      scrollTl.fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(labelRef.current, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(bodyRef.current, { x: 0, opacity: 1 }, { x: '12vw', opacity: 0, ease: 'power2.in' }, 0.72);
      scrollTl.fromTo(ctaRef.current, { x: 0, opacity: 1 }, { x: '12vw', opacity: 0, ease: 'power2.in' }, 0.74);
      scrollTl.fromTo(ruleRef.current, { scaleX: 1, opacity: 1 }, { scaleX: 0, opacity: 0.3, transformOrigin: 'left', ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(bgRef.current, { scale: 1, y: 0 }, { scale: 1.06, y: '-3vh', ease: 'none' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="section-pinned z-10">
      {/* Carousel Background */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0 }}>
        {/* Slides */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: i === current ? 1 : i === prev ? 0 : 0,
              transition: i === current
                ? 'opacity 1s ease-in-out'
                : i === prev
                ? 'opacity 1s ease-in-out'
                : 'none',
              zIndex: i === current ? 2 : i === prev ? 1 : 0,
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Cinematic overlay */}
        <div className="absolute inset-0 cinematic-overlay" style={{ zIndex: 3 }} />

        {/* Extra dark gradient at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 4,
            background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.1) 100%)',
          }}
        />

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Imagem anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(212,175,55,0.3)',
            color: 'rgba(255,255,255,0.7)',
            zIndex: 5,
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Próxima imagem"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(212,175,55,0.3)',
            color: 'rgba(255,255,255,0.7)',
            zIndex: 5,
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
          style={{ zIndex: 5 }}
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Ir para imagem ${i + 1}`}
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{
            zIndex: 5,
            background: 'rgba(212,175,55,0.4)',
            width: '100%',
          }}
        >
          <div
            key={current}
            style={{
              height: '100%',
              background: '#D4AF37',
              animation: `progressBar ${SLIDE_DURATION}ms linear`,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>

      {/* Content overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end pb-[14vh] px-[4vw]"
        style={{ zIndex: 6 }}
      >
        {/* Gold Rule */}
        <div
          ref={ruleRef}
          className="gold-rule mb-6"
          style={{ width: '34vw', transform: 'scaleX(0)' }}
        />

        {/* Micro Label */}
        <span ref={labelRef} className="micro-label mb-4" style={{ opacity: 0 }}>
          Hering Gomes Advocacia
        </span>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="heading-display text-white mb-8"
          style={{ fontSize: 'clamp(30px, 5vw, 72px)', maxWidth: '50vw', opacity: 0 }}
        >
          <span className="word inline-block">Segurança</span>{' '}
          <span className="word inline-block">Jurídica</span>{' '}
          <span className="word inline-block text-gold">para</span>{' '}
          <span className="word inline-block text-gold">Quem</span>{' '}
          <span className="word inline-block text-gold">Não</span>{' '}
          <span className="word inline-block text-gold">Pode</span>{' '}
          <span className="word inline-block text-gold">Errar</span>
        </h1>

        {/* Body + CTAs Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div ref={bodyRef} style={{ opacity: 0 }}>
            <p className="text-secondary-gray text-base lg:text-lg leading-relaxed max-w-lg mb-3">
              Atuamos na defesa de Servidores Públicos, Direito Tributário, Empresarial,
              Civil, Processual Civil e Administrativo — com estratégia, precisão técnica
              e comprometimento real. Você acompanha cada etapa. Nós cuidamos dos resultados.
            </p>
            <p className="text-white/50 text-sm">
              Atendimento presencial em Florianópolis/SC · Online em todo o Brasil.
            </p>
          </div>

          <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
            <a
              href="https://wa.me/554830282422?text=Olá! Gostaria de agendar uma consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              <Phone size={18} />
              Agendar Consulta
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary gap-2"
            >
              Conhecer Serviços
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
