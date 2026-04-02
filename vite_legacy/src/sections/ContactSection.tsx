import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Left title/contacts animation
      gsap.fromTo(
        leftRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: leftRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.3,
          },
        }
      );

      // Form card animation
      gsap.fromTo(
        formRef.current,
        { x: '8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 70%',
            end: 'top 45%',
            scrub: 0.3,
          },
        }
      );

      // Form fields stagger
      if (fieldsRef.current) {
        const fields = fieldsRef.current.querySelectorAll('.form-field');
        gsap.fromTo(
          fields,
          { y: '3vh', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            scrollTrigger: {
              trigger: fieldsRef.current,
              start: 'top 65%',
              end: 'top 40%',
              scrub: 0.3,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitError(null);

    const { error } = await supabase.from('contact_submissions').insert([{
      name: formData.nome,
      email: formData.email || null,
      phone: formData.telefone || null,
      subject: formData.assunto || null,
      message: formData.mensagem,
    }]);

    if (!error) {
      setIsSubmitted(true);
      setFormData({ nome: '', telefone: '', email: '', assunto: '', mensagem: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      setSubmitError('Não foi possível enviar a mensagem. Tente pelo WhatsApp ou e-mail diretamente.');
    }
    setIsSending(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefone & WhatsApp',
      value: '(48) 9 9119-9407',
      href: 'https://wa.me/5548991199407',
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: 'contato@heringgomes.adv.br',
      href: 'mailto:contato@heringgomes.adv.br',
    },
    {
      icon: Clock,
      label: 'Horário de Atendimento',
      value: 'Seg–Sex: 8h às 18h',
      href: null,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-charcoal-light py-24 lg:py-32 z-[80]"
    >
      <div className="px-[4vw]">
        <div className="flex flex-col lg:flex-row lg:gap-16">
          {/* Left Column - Title & Contacts */}
          <div ref={leftRef} className="lg:w-[40vw] mb-12 lg:mb-0" style={{ opacity: 0 }}>
            <span className="micro-label mb-4 block">Contato</span>
            <h2
              className="heading-section text-white mb-6"
              style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
            >
              Entre em <span className="text-gold">Contato</span>
            </h2>
            <p className="text-secondary-gray text-base leading-relaxed mb-10">
              Agende uma consulta ou tire suas dúvidas. Estamos prontos para
              atendê-lo.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-gold/30 flex-shrink-0">
                    <info.icon className="text-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-secondary-gray text-xs uppercase tracking-wider mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-white font-medium hover:text-gold transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            ref={formRef}
            className="lg:w-[44vw] p-8 bg-charcoal border border-white/5"
            style={{ opacity: 0 }}
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="text-gold mb-4" size={48} />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-secondary-gray">
                  Entraremos em contato em breve.
                </p>
              </div>
            ) : (
              <form ref={fieldsRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="form-field" style={{ opacity: 0 }}>
                  <label className="text-secondary-gray text-xs uppercase tracking-wider mb-2 block">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-field" style={{ opacity: 0 }}>
                    <label className="text-secondary-gray text-xs uppercase tracking-wider mb-2 block">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="form-field" style={{ opacity: 0 }}>
                    <label className="text-secondary-gray text-xs uppercase tracking-wider mb-2 block">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="form-field" style={{ opacity: 0 }}>
                  <label className="text-secondary-gray text-xs uppercase tracking-wider mb-2 block">
                    Assunto
                  </label>
                  <select
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-charcoal">
                      Selecione uma área
                    </option>
                    <option value="tributario" className="bg-charcoal">
                      Direito Tributário
                    </option>
                    <option value="empresarial" className="bg-charcoal">
                      Direito Empresarial
                    </option>
                    <option value="civil" className="bg-charcoal">
                      Direito Civil
                    </option>
                    <option value="consumidor" className="bg-charcoal">
                      Direito do Consumidor
                    </option>
                    <option value="penal" className="bg-charcoal">
                      Direito Penal
                    </option>
                    <option value="previdenciario" className="bg-charcoal">
                      Direito Previdenciário
                    </option>
                    <option value="publico" className="bg-charcoal">
                      Direito Público
                    </option>
                    <option value="outro" className="bg-charcoal">
                      Outro Assunto
                    </option>
                  </select>
                </div>

                <div className="form-field" style={{ opacity: 0 }}>
                  <label className="text-secondary-gray text-xs uppercase tracking-wider mb-2 block">
                    Mensagem
                  </label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-primary gap-2 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                  ) : (
                    <><Send size={18} /> Enviar Mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
