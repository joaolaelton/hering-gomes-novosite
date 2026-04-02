import { useState, useEffect } from 'react';
import { Star, Trash2, Plus, Eye, EyeOff, Loader2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  author: string;
  role: string | null;
  rating: number;
  text: string;
  initials: string | null;
  avatar_color: string;
  visible: boolean;
  date_label: string;
  sort_order: number;
}

const AVATAR_COLORS = ['#4A90D9', '#E8844A', '#5C9E6B', '#8B67A8', '#D4AF37', '#C0392B', '#2980B9'];

const emptyForm = (): Omit<Review, 'id'> => ({
  author: '',
  role: '',
  rating: 5,
  text: '',
  initials: '',
  avatar_color: AVATAR_COLORS[0],
  visible: true,
  date_label: 'Recentemente',
  sort_order: 0,
});

export default function ManageReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleToggleVisible = async (review: Review) => {
    const { error } = await supabase
      .from('reviews')
      .update({ visible: !review.visible })
      .eq('id', review.id);
    if (!error) {
      setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, visible: !r.visible } : r));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover avaliação permanentemente?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('success', 'Avaliação removida.');
    } else {
      showToast('error', 'Erro ao remover.');
    }
  };

  const handleSave = async () => {
    if (!form.author.trim() || !form.text.trim()) {
      showToast('error', 'Nome e texto são obrigatórios.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      initials: form.initials || form.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    };
    const { error } = await supabase.from('reviews').insert([payload]);
    if (!error) {
      showToast('success', 'Avaliação adicionada com sucesso!');
      setShowForm(false);
      setForm(emptyForm());
      fetchReviews();
    } else {
      showToast('error', 'Erro ao salvar: ' + error.message);
    }
    setSaving(false);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-900/80 border-green-500/40 text-green-200'
            : 'bg-red-900/80 border-red-500/40 text-red-200'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Avaliações</h1>
          <p className="text-white/40 text-sm mt-1">{reviews.length} avaliações cadastradas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gold hover:bg-white text-charcoal font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancelar' : 'Nova Avaliação'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 mb-8 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Nova Avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Nome do Cliente *</label>
              <input
                className="w-full bg-charcoal border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Cargo / Detalhe</label>
              <input
                className="w-full bg-charcoal border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                value={form.role || ''}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Ex: Empresário"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Data</label>
              <input
                className="w-full bg-charcoal border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                value={form.date_label}
                onChange={(e) => setForm({ ...form, date_label: e.target.value })}
                placeholder="Ex: Há 2 semanas"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Nota (Estrelas)</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={star <= form.rating ? 'text-gold fill-gold' : 'text-white/20 fill-transparent'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-white/50 text-sm self-center">{form.rating}/5</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Cor do Avatar</label>
              <div className="flex gap-2 mt-1">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, avatar_color: c })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${form.avatar_color === c ? 'border-gold scale-110' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Texto do Depoimento *</label>
            <textarea
              rows={4}
              className="w-full bg-charcoal border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold resize-none"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Texto completo da avaliação..."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gold hover:bg-white text-charcoal font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Avaliação
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-charcoal-light border border-white/5 rounded-xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="text-gold animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-white/50 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium hidden md:table-cell">Data</th>
                  <th className="p-4 font-medium w-32">Nota</th>
                  <th className="p-4 font-medium">Texto</th>
                  <th className="p-4 font-medium text-right w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white/80">
                {reviews.map((r) => (
                  <tr key={r.id} className={`hover:bg-white/5 transition-colors ${!r.visible ? 'opacity-40' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: r.avatar_color }}
                        >
                          {r.initials || r.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{r.author}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-white/50 text-xs">{r.date_label}</td>
                    <td className="p-4">
                      <div className="flex text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className={i < r.rating ? 'fill-gold' : 'fill-transparent opacity-30'} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="line-clamp-2 max-w-sm text-white/60">{r.text}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleVisible(r)}
                          title={r.visible ? 'Ocultar' : 'Exibir'}
                          className="p-2 text-white/40 hover:text-gold hover:bg-white/5 rounded-lg transition-all"
                        >
                          {r.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="text-center py-12 text-white/40">Nenhuma avaliação cadastrada ainda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
