"use client";
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, AtSign, Video } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Gold line animation
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 0.3,
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { y: '2vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 0.3,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'O Escritório', href: '#about' },
    { label: 'Áreas de Atuação', href: '#services' },
    { label: 'Contato', href: '#contact' },
  ];

  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/leandrohgomesadv/' },
    { icon: AtSign, label: 'Threads', href: 'https://www.threads.net/@leandrohgomesadv' },
    { icon: Video, label: 'TikTok', href: 'https://www.tiktok.com/@leandrohgomesadv' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={sectionRef}
      className="relative bg-charcoal py-16 z-[90]"
    >
      {/* Top Gold Rule */}
      <div className="px-[4vw] mb-12">
        <div
          ref={lineRef}
          className="gold-rule"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-[4vw]" style={{ opacity: 0 }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Logo & Tagline */}
          <div className="lg:max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo-hd.png"
                alt="Hering Gomes Advogados"
                className="w-auto"
                style={{ height: '128px' }}
              />
            </div>
            <p className="text-secondary-gray text-sm leading-relaxed">
              Advocacia de excelência em todo o Brasil. Há mais de 15 anos
              oferecendo soluções jurídicas personalizadas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-secondary-gray hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-3">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/80 hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-secondary-gray text-xs">
            © 2026 Hering Gomes Advogados. Todos os direitos reservados.
          </p>
          <p className="text-secondary-gray text-xs">
            OAB/SC nº 33169
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
