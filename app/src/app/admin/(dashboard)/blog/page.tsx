"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import {
  Bold, Italic, Link2, ImageIcon, List, ListOrdered,
  Quote, Save, Send, Loader2, ChevronDown, Heading2, Heading3,
  Upload, X, Plus, ArrowLeft, Trash2, Edit3, Eye, EyeOff,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  'Direito Tributário',
  'Direito Civil',
  'Direito Empresarial',
  'Direito Trabalhista',
  'Servidores Públicos',
  'Assessoria Jurídica',
  'Geral',
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  content?: string;
}

// ─── Sub-component: the Tiptap editor ──────────────────────────────────────
function PostEditor({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Post;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url || '');
  const [coverPreview, setCoverPreview] = useState(initial?.cover_url || '');
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
    ],
    immediatelyRender: false,
    content: initial?.content || '<p>Comece a escrever seu artigo...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-gold max-w-none min-h-[400px] outline-none p-4',
      },
    },
  });

  const uploadImage = async (file: File, folder = 'covers'): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) {
      showToast('error', 'Erro ao fazer upload: ' + error.message);
      return null;
    }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadImage(file, 'covers');
    setUploadingCover(false);
    if (url) { setCoverUrl(url); setCoverPreview(url); }
  };

  const handleInlineImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    showToast('success', 'Enviando imagem...');
    const url = await uploadImage(file, 'inline');
    if (url) editor.chain().focus().setImage({ src: url }).run();
    e.target.value = '';
  };

  const savePost = async (publish: boolean) => {
    if (!title.trim()) { showToast('error', 'O título é obrigatório.'); return; }
    if (!editor) return;
    setSaving(true);
    const content = editor.getHTML();

    let error;
    if (initial?.id) {
      // Editar post existente
      ({ error } = await supabase.from('posts').update({
        title,
        excerpt: excerpt || null,
        content,
        cover_url: coverUrl || null,
        category,
        published: publish,
        published_at: publish ? (initial.published_at || new Date().toISOString()) : null,
      }).eq('id', initial.id));
    } else {
      // Criar novo post
      const slug = slugify(title) + '-' + Date.now().toString(36);
      ({ error } = await supabase.from('posts').insert([{
        title, slug,
        excerpt: excerpt || null,
        content,
        cover_url: coverUrl || null,
        category,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      }]));
    }

    if (!error) {
      showToast('success', publish ? 'Artigo publicado com sucesso!' : 'Rascunho salvo.');
      setTimeout(() => onSaved(), 1200);
    } else {
      showToast('error', 'Erro ao salvar: ' + error.message);
    }
    setSaving(false);
  };

  if (!editor) return null;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-green-900/80 border-green-500/40 text-green-200'
            : 'bg-red-900/80 border-red-500/40 text-red-200'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Voltar para lista
          </button>
          <span className="text-white/20">|</span>
          <h1 className="text-2xl font-serif font-bold text-white">
            {initial?.id ? 'Editar Artigo' : 'Novo Artigo'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => savePost(false)}
            disabled={saving}
            className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Rascunho
          </button>
          <button
            onClick={() => savePost(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-white text-charcoal font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Publicar
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Resumo (Excerpt)</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-charcoal-light border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            placeholder="Breve descrição para a listagem do blog..."
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Categoria</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-charcoal-light border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold pr-8"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="mb-4">
        <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Imagem de Capa</label>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
        {coverPreview ? (
          <div className="relative w-full max-w-sm group">
            <img src={coverPreview} alt="Prévia da capa" className="w-full h-40 object-cover rounded-lg border border-white/10" />
            <button
              onClick={() => { setCoverUrl(''); setCoverPreview(''); }}
              className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black/70 hover:bg-gold text-white text-xs px-3 py-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              Trocar
            </button>
          </div>
        ) : (
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="flex items-center gap-3 px-5 py-3 border border-dashed border-white/20 hover:border-gold/60 text-white/50 hover:text-gold rounded-lg transition-all text-sm disabled:opacity-50"
          >
            {uploadingCover
              ? <><Loader2 size={18} className="animate-spin" /> Enviando...</>
              : <><Upload size={18} /> Clique para escolher uma imagem do seu computador</>
            }
          </button>
        )}
      </div>

      <div className="bg-charcoal-light border border-white/5 rounded-xl shadow-xl overflow-hidden">
        {/* Título */}
        <div className="p-6 border-b border-white/5 bg-black/20">
          <input
            type="text"
            placeholder="Título do Artigo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/20 focus:outline-none"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-3 border-b border-white/5 bg-charcoal">
          {([
            { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
            { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
          ] as const).map(({ icon: Icon, action, active }, i) => (
            <button key={i} onClick={action} className={`p-2 rounded hover:bg-white/10 ${active ? 'bg-gold/20 text-gold' : 'text-white/70'}`}>
              <Icon size={18} />
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 my-auto mx-1" />
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-gold/20 text-gold' : 'text-white/70'}`}><Heading2 size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'bg-gold/20 text-gold' : 'text-white/70'}`}><Heading3 size={18} /></button>
          <div className="w-px h-6 bg-white/10 my-auto mx-1" />
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-gold/20 text-gold' : 'text-white/70'}`}><List size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-gold/20 text-gold' : 'text-white/70'}`}><ListOrdered size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-gold/20 text-gold' : 'text-white/70'}`}><Quote size={18} /></button>
          <div className="w-px h-6 bg-white/10 my-auto mx-1" />
          <button
            onClick={() => { const url = window.prompt('URL do link:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'bg-gold/20 text-gold' : 'text-white/70'}`}
          ><Link2 size={18} /></button>
          <input ref={inlineImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleInlineImageFile} />
          <button onClick={() => inlineImageInputRef.current?.click()} className="p-2 rounded hover:bg-white/10 text-white/70" title="Inserir imagem no texto">
            <ImageIcon size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 bg-charcoal min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page: Lista de Posts ──────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, cover_url, category, published, published_at, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setPosts(data as Post[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.')) return;
    setDeletingId(id);
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      showToast('success', 'Artigo excluído.');
      fetchPosts();
    } else {
      showToast('error', 'Erro ao excluir: ' + error.message);
    }
    setDeletingId(null);
  };

  const handleTogglePublish = async (post: Post) => {
    const newPublished = !post.published;
    const { error } = await supabase.from('posts').update({
      published: newPublished,
      published_at: newPublished ? new Date().toISOString() : null,
    }).eq('id', post.id);
    if (!error) {
      showToast('success', newPublished ? 'Artigo publicado.' : 'Artigo despublicado.');
      fetchPosts();
    } else {
      showToast('error', 'Erro: ' + error.message);
    }
  };

  const handleEdit = async (post: Post) => {
    // Buscar conteúdo completo
    const { data } = await supabase.from('posts').select('*').eq('id', post.id).single();
    setEditingPost(data ?? post);
    setView('edit');
  };

  if (view === 'new') {
    return (
      <PostEditor
        onSaved={() => { setView('list'); fetchPosts(); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && editingPost) {
    return (
      <PostEditor
        initial={editingPost}
        onSaved={() => { setView('list'); fetchPosts(); }}
        onCancel={() => { setView('list'); setEditingPost(undefined); }}
      />
    );
  }

  // LIST VIEW
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-green-900/80 border-green-500/40 text-green-200'
            : 'bg-red-900/80 border-red-500/40 text-red-200'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Postagens</h1>
          <p className="text-white/40 text-sm mt-1">{posts.length} artigo{posts.length !== 1 ? 's' : ''} no total</p>
        </div>
        <button
          onClick={() => setView('new')}
          className="flex items-center gap-2 bg-gold hover:bg-white text-charcoal font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Novo Artigo
        </button>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-gold animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/30">
          <Edit3 size={48} />
          <p className="text-lg font-medium">Nenhum artigo criado ainda.</p>
          <button
            onClick={() => setView('new')}
            className="mt-2 flex items-center gap-2 bg-gold text-charcoal font-bold px-5 py-2.5 rounded-lg hover:bg-white transition-colors"
          >
            <Plus size={16} /> Criar primeiro artigo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              {/* Cover thumb */}
              {post.cover_url ? (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-white/10"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Edit3 size={18} className="text-white/20" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    post.published
                      ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="text-white/20 text-xs">{post.category}</span>
                </div>
                <h3 className="text-white font-semibold text-sm truncate">{post.title}</h3>
                <p className="text-white/30 text-xs mt-0.5">
                  {post.published ? `Publicado em ${formatDate(post.published_at)}` : `Criado em ${formatDate(post.created_at)}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleTogglePublish(post)}
                  title={post.published ? 'Despublicar' : 'Publicar'}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver no site"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <Eye size={16} />
                </a>
                <button
                  onClick={() => handleEdit(post)}
                  title="Editar"
                  className="p-2 rounded-lg hover:bg-gold/20 transition-colors text-white/50 hover:text-gold"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  title="Excluir"
                  className="p-2 rounded-lg hover:bg-red-900/40 transition-colors text-white/30 hover:text-red-400 disabled:opacity-50"
                >
                  {deletingId === post.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
