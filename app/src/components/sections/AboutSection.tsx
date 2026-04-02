"use client";
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Shield, Users, Award, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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

      // ENTRANCE (elementos deslizam para posição final)
      scrollTl.fromTo(
        leftPanelRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        rightPanelRef.current,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        statsRef.current?.children || [],
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        ctaRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.15
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Stats inline in render
  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned z-20"
    >
      {/* Left Image Panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 w-[52vw] h-full overflow-hidden"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/hero/escritorio-3.jpg"
          alt="Sala de reunião — Hering Gomes Advogados"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal/80" />
      </div>

      {/* Vertical Divider */}
      <div
        className="absolute top-0 w-px h-full bg-gold/35"
        style={{ left: '52vw' }}
      />

      {/* Right Content Panel */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 w-[48vw] h-full bg-charcoal flex items-center"
        style={{ opacity: 0 }}
      >
        <div className="px-[6vw] py-[10vh]">
          {/* Content Group */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            <span className="micro-label mb-4 block">SOBRE O ESCRITÓRIO</span>
            <h2
              className="heading-section text-white mb-8"
              style={{ fontSize: 'clamp(26px, 3vw, 48px)', maxWidth: '40vw' }}
            >
              Perguntas Certas.{' '}
              <span className="text-gold">Respostas Concretas.</span>
            </h2>
            <p className="text-secondary-gray text-base leading-relaxed max-w-[34vw] mb-4">
              A Hering Gomes Advogados nasceu da convicção de que advocacia de qualidade começa pela escuta. Não pela resposta imediata, não pelo jargão técnico que afasta o cliente — mas pela pergunta que abre o caminho certo.
            </p>
            <p className="text-secondary-gray text-sm leading-relaxed max-w-[34vw] mb-10">
              Com sede em Florianópolis/SC e mais de 15 anos dedicados ao direito privado e público, construímos uma prática baseada em diagnóstico preciso, estratégia personalizada e comunicação clara em cada etapa.
            </p>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="grid grid-cols-2 gap-6 mb-10">
            {[
              { icon: Award, value: '+15', label: 'Anos de experiência jurídica' },
              { icon: Users, value: '+500', label: 'Casos resolvidos' },
              { icon: Shield, value: 'OAB/SC', label: 'nº 33169' },
              { icon: Briefcase, value: '100%', label: 'Atendimento personalizado' },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col" style={{ opacity: 0 }}>
                <stat.icon className="text-gold mb-3" size={24} />
                <span
                  className="text-white font-bold text-2xl lg:text-3xl mb-1"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {stat.value}
                </span>
                <span className="text-secondary-gray text-xs">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            ref={ctaRef}
            href="https://wa.me/554830282422?text=Olá! Gostaria de mais informações sobre os serviços jurídicos."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary gap-2 inline-flex"
            style={{ opacity: 0 }}
          >
            <MessageSquare size={18} />
            Fale com um Especialista
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
