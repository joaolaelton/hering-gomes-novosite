"use client";
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, AtSign, Video } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AREAS = [
  'Direitos de Servidores Públicos',
  'Direito Tributário',
  'Direito Empresarial',
  'Direito Civil',
  'Processual Civil',
  'Direito Administrativo',
];

const FORMATION = [
  {
    year: '2008',
    title: 'Graduação em Direito',
    institution: 'Universidade Federal de Santa Catarina — UFSC',
  },
  {
    year: '2010',
    title: 'Especialização',
    institution: 'Escola do Ministério Público de SC / UNIVALI',
  },
  {
    year: 'Contínuo',
    title: 'Atualização Permanente',
    institution: 'Cursos de extensão, congressos e eventos jurídicos nacionais',
  },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/leandrohgomesadv/' },
  { icon: AtSign, label: 'Threads', href: 'https://www.threads.net/@leandrohgomesadv' },
  { icon: Video, label: 'TikTok', href: 'https://www.tiktok.com/@leandrohgomesadv' },
];

const AttorneySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 0.6,
        },
      });

      // ENTRANCE — elementos deslizam para a posição final
      scrollTl.fromTo(rightPanelRef.current, { x: '40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(leftPanelRef.current, { x: '-40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(contentRef.current, { y: '6vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      scrollTl.fromTo(bioRef.current?.children || [], { y: '4vh', opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, ease: 'none' }, 0.1);
      scrollTl.fromTo(socialsRef.current, { y: '3vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="attorney" className="section-pinned z-40">
      {/* Left Content Panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 w-[48vw] h-full bg-charcoal flex items-center"
        style={{ opacity: 0 }}
      >
        <div className="px-[6vw] py-[8vh]">
          {/* Heading */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            <span className="micro-label mb-4 block">O Advogado</span>
            <h2
              className="heading-section text-white mb-1"
              style={{ fontSize: 'clamp(24px, 3vw, 48px)', maxWidth: '38vw' }}
            >
              Dr. Leandro{' '}
              <span className="text-gold">Hering Gomes</span>
            </h2>
            <p className="text-gold/80 font-medium text-sm mb-6 tracking-wide">
              Sócio-Fundador · OAB/SC nº 33169
            </p>
          </div>

          {/* Bio + Áreas + Formação */}
          <div ref={bioRef} className="space-y-6">
            {/* Bio — 3 parágrafos */}
            <div className="space-y-4 max-w-[36vw]" style={{ opacity: 0 }}>
              <p className="text-secondary-gray text-sm lg:text-[15px] leading-relaxed">
                Com mais de 15 anos de experiência jurídica, Dr. Leandro Hering Gomes
                construiu uma trajetória pautada por estratégia, precisão técnica e
                comprometimento real com o cliente. Cada caso é conduzido com rigor
                analítico e atenção personalizada — da consulta à resolução final.
              </p>
              <p className="text-secondary-gray text-sm lg:text-[15px] leading-relaxed">
                Sua atuação integra as principais frentes do direito privado e público,
                com destaque para a defesa dos direitos de servidores públicos, área em que acumula
                sólida experiência contenciosa e consultiva. Transforma cenários jurídicos
                complexos em caminhos claros, seguros e bem definidos.
              </p>
              <p className="text-secondary-gray text-sm lg:text-[15px] leading-relaxed">
                Ética, consistência e proximidade no atendimento não são apenas valores
                declarados — são a base de cada relação construída ao longo de mais de
                uma década de prática.
              </p>
            </div>

            {/* Áreas de Atuação */}
            <div style={{ opacity: 0 }}>
              <p className="text-xs uppercase tracking-[0.15em] text-gold/80 font-semibold mb-3">
                Áreas de Atuação
              </p>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <span
                    key={area}
                    className="text-white/80 text-xs border border-white/10 px-3 py-1.5 rounded-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Formação */}
            <div style={{ opacity: 0 }}>
              <p className="text-xs uppercase tracking-[0.15em] text-gold/80 font-semibold mb-3">
                Formação & Desenvolvimento
              </p>
              <div className="space-y-3">
                {FORMATION.map((item) => (
                  <div key={item.year} className="flex gap-4 items-start">
                    <span className="text-gold font-bold text-xs w-14 flex-shrink-0 pt-0.5 font-mono tracking-tight">
                      {item.year}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium leading-tight">{item.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div ref={socialsRef} className="flex gap-3 mt-8" style={{ opacity: 0 }}>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 hover:border-gold hover:text-gold transition-all duration-300 text-sm"
              >
                <social.icon size={16} />
                <span className="hidden sm:inline">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="absolute top-0 w-px h-full bg-gold/35" style={{ left: '48vw' }} />

      {/* Right Portrait Panel */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 w-[52vw] h-full overflow-hidden flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/advogado.png"
          alt="Dr. Leandro Hering Gomes"
          className="w-full h-full object-cover object-center"
          style={{ transform: 'scale(0.67)', transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-charcoal/60" />
      </div>
    </section>
  );
};

export default AttorneySection;
