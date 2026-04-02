import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Settings {
  phone: string;
  email: string;
  address: string;
}

type Status = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors';

export default function SiteSettings() {
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
  });
  const [status, setStatus] = useState<Status>('loading');

  // Load from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(({ key, value }) => { map[key] = value; });
        setSettings({
          phone: map['phone'] ?? '',
          email: map['email'] ?? '',
          address: map['address'] ?? '',
        });
      }
      setStatus('idle');
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    const rows = [
      { key: 'phone',   value: settings.phone },
      { key: 'email',   value: settings.email },
      { key: 'address', value: settings.address },
    ];

    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' });

    if (!error) {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const isLoading = status === 'loading';
  const isSaving  = status === 'saving';

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-serif font-bold text-white mb-2">Informações do Escritório</h1>
      <p className="text-white/40 text-sm mb-8">
        Estas informações aparecem no rodapé, na seção de contato e nos links da landing page.
      </p>

      <div className="bg-charcoal-light border border-white/5 rounded-xl p-8 shadow-xl">
        {isLoading ? (
          <div className="flex items-center gap-3 text-white/40 py-8">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Carregando configurações…</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Telefone / WhatsApp Principal
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className={inputClass}
                placeholder="(48) 9 9119-9407"
              />
              <p className="text-xs text-white/25 mt-1">
                Formato aceito: <code className="text-white/40">(xx) x xxxx-xxxx</code>
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className={inputClass}
                placeholder="contato@heringgomes.adv.br"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Endereço Físico
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className={inputClass}
                placeholder="Av. Osmar Cunha, 183 — Centro, Florianópolis"
              />
            </div>
          </div>
        )}

        {/* Status & Save */}
        {!isLoading && (
          <div className="mt-10 flex items-center justify-between gap-4">
            {status === 'saved' && (
              <span className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 size={16} /> Salvo com sucesso!
              </span>
            )}
            {status === 'error' && (
              <span className="text-sm text-red-400">
                Erro ao salvar. Tente novamente.
              </span>
            )}
            {(status === 'idle' || status === 'saving') && <span />}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gold hover:bg-white text-charcoal font-bold px-6 py-3 rounded-lg transition-colors uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <><Loader2 size={18} className="animate-spin" /> Salvando…</>
              ) : (
                <><Save size={18} /> Salvar Alterações</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
