import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calculator,
  Building2,
  Scale,
  FileText,
  Landmark,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.3,
          },
        }
      );

      gsap.fromTo(
        introRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.3,
          },
        }
      );

      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(
          cards,
          { x: '10vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.3,
            },
          }
        );
      }

      gsap.fromTo(
        ctaRef.current,
        { y: '4vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 0.3,
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { y: 0 },
        {
          y: '-4vh',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: Landmark,
      title: 'Direitos de Servidores Públicos',
      description: 'Reconhecimento de direitos funcionais, cobrança de benefícios, processos administrativos e contencioso — área de atuação prioritária do escritório, com sólida experiência consultiva e litigiosa.',
    },
    {
      icon: Calculator,
      title: 'Direito Tributário',
      description: 'Planejamento tributário, defesas administrativas e judiciais, recuperação de tributos pagos indevidamente e consultoria para redução de carga fiscal.',
    },
    {
      icon: Building2,
      title: 'Direito Empresarial',
      description: 'Estruturação societária, contratos empresariais, fusões e aquisições (M&A) e recuperação judicial — suporte jurídico em todas as fases da vida da empresa.',
    },
    {
      icon: FileText,
      title: 'Direito Civil',
      description: 'Contratos, responsabilidade civil, direito de família e sucessões — com abordagem que prioriza resolução eficiente e proteção real dos seus interesses.',
    },
    {
      icon: Scale,
      title: 'Processual Civil',
      description: 'Atuação em todas as fases do processo, instâncias e recursos nos tribunais superiores, com estratégia construída desde o início do litígio.',
    },
    {
      icon: ShieldCheck,
      title: 'Direito Administrativo',
      description: 'Assessoria e representação em relações com o poder público, licitações, contratos administrativos, improbidade e processos disciplinares.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-charcoal py-24 lg:py-32 z-30"
    >
      {/* Decorative gold line */}
      <div
        ref={lineRef}
        className="absolute top-20 right-0 w-[30vw] h-px bg-gold/20"
      />

      <div className="px-[4vw]">
        <div className="flex flex-col lg:flex-row lg:gap-16">
          {/* Left Column - Title & Intro */}
          <div className="lg:w-[42vw] mb-12 lg:mb-0">
            <div ref={titleRef} style={{ opacity: 0 }}>
              <span className="micro-label mb-4 block">Nossos Serviços — Áreas de Atuação</span>
              <h2
                className="heading-section text-white"
                style={{ fontSize: 'clamp(26px, 3vw, 48px)' }}
              >
                Atuação Completa.{' '}
                <span className="text-gold">Para Quem Precisa de Resultado.</span>
              </h2>
            </div>
            <p
              ref={introRef}
              className="text-secondary-gray text-base lg:text-lg leading-relaxed mt-6 max-w-md"
              style={{ opacity: 0 }}
            >
              Do planejamento preventivo ao contencioso — atendemos pessoas físicas, empresas
              e servidores públicos com a mesma profundidade técnica e atenção personalizada.
            </p>

            {/* CTA */}
            <a
              ref={ctaRef}
              href="https://wa.me/554830282422?text=Olá! Gostaria de solicitar uma proposta."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2 inline-flex mt-10"
              style={{ opacity: 0 }}
            >
              Solicitar uma Proposta
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Right Column - Services Grid */}
          <div
            ref={gridRef}
            className="lg:w-[44vw] grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-charcoal-light border border-white/5 hover:border-gold/30 transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <service.icon
                  className="text-gold mb-4 group-hover:scale-110 transition-transform duration-300"
                  size={28}
                />
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {service.title}
                </h3>
                <p className="text-secondary-gray text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
