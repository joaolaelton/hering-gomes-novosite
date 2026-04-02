import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LocationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const addressCardRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);

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
        },
      });

      // ENTRANCE
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.10, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        addressCardRef.current,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        mapCardRef.current,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      // EXIT
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1.05, y: '-3vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        addressCardRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        mapCardRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.74
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      className="section-pinned z-[70]"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/ponte.jpg"
          alt="Florianópolis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 cinematic-overlay-dark" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[4vw]">
        {/* Headline Group */}
        <div ref={headlineRef} className="mb-12" style={{ opacity: 0 }}>
          <span className="micro-label mb-4 block">Localização</span>
          <h2
            className="heading-section text-white"
            style={{ fontSize: 'clamp(26px, 3vw, 48px)', maxWidth: '46vw' }}
          >
            Florianópolis/SC —{' '}
            <span className="text-gold">e onde você estiver.</span>
          </h2>
          <p className="text-secondary-gray text-base leading-relaxed mt-4 max-w-lg">
            Nossa sede fica no bairro Estreito, com fácil acesso e estacionamento no condomínio.
            Para clientes fora de Florianópolis, o atendimento remoto mantém o mesmo
            padrão de proximidade e atenção.
          </p>
        </div>

        {/* Cards Row */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Address Card */}
          <div
            ref={addressCardRef}
            className="p-8 bg-charcoal/95 backdrop-blur-sm max-w-md"
            style={{ opacity: 0 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="text-gold flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-white font-medium mb-1">
                  Rua Souza Dutra, 145 — Sala 507
                </p>
                <p className="text-secondary-gray text-sm">
                  Estreito, Florianópolis/SC
                </p>
                <p className="text-secondary-gray text-sm">
                  CEP 88070-605
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Rua+Souza+Dutra+145+Florianópolis"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2 text-xs py-3 px-4"
              >
                <MapPin size={14} />
                Google Maps
              </a>
              <a
                href="https://waze.com/ul?q=Rua%20Souza%20Dutra%2C%20145%2C%20Florianópolis"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary gap-2 text-xs py-3 px-4"
              >
                <Navigation size={14} />
                Waze
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div
            ref={mapCardRef}
            className="w-full lg:w-[38vw] h-[250px] lg:h-auto bg-charcoal/95 backdrop-blur-sm overflow-hidden"
            style={{ opacity: 0 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.1234567890123!2d-48.52412345678901!3d-27.589123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzIwLjgiUyA0OMKwMzEnMjYuOCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Hering Gomes Advogados"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
