"use client";
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserCheck, Eye, Zap, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhyUsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.3,
          },
        }
      );

      if (featuresRef.current) {
        const features = featuresRef.current.children;
        gsap.fromTo(
          features,
          { y: '8vh', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.3,
            },
          }
        );
      }

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 0.3,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Eye,
      title: 'Explicamos Antes de Agir',
      description: 'Você entende o que está acontecendo, por que estamos tomando cada decisão e quais são os cenários possíveis. Sem surpresas, sem jargão desnecessário.',
    },
    {
      icon: UserCheck,
      title: 'Defendemos com Estratégia',
      description: 'Cada linha de atuação é construída a partir do diagnóstico do seu caso — não de modelos prontos. Rigor técnico e criatividade jurídica andam juntos.',
    },
    {
      icon: Zap,
      title: 'Resolvemos com Comprometimento Real',
      description: 'Mais de 15 anos de resultados concretos. Prazos respeitados, comunicação constante e presença ativa em cada fase do processo.',
    },
    {
      icon: MapPin,
      title: 'Nacional na Abrangência, Pessoal no Atendimento',
      description: 'Atendemos em todo o Brasil — sem perder a proximidade que só um escritório focado no cliente pode oferecer.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative bg-charcoal py-24 lg:py-32 z-50"
    >
      <div className="px-[4vw]">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="heading-section text-white text-center mb-16 lg:mb-20"
          style={{ fontSize: 'clamp(28px, 3.5vw, 56px)', opacity: 0 }}
        >
          Por Que <span className="text-gold">Nos Escolher</span>
        </h2>

        {/* Features Grid */}
        <div
          ref={featuresRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
              style={{ opacity: 0 }}
            >
              <div className="w-14 h-14 flex items-center justify-center border border-gold/30 mb-6">
                <feature.icon className="text-gold" size={28} />
              </div>
              <h3
                className="text-white font-semibold text-lg mb-3"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {feature.title}
              </h3>
              <p className="text-secondary-gray text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Gold Rule */}
        <div
          ref={lineRef}
          className="gold-rule mt-16 lg:mt-20"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
};

export default WhyUsSection;
