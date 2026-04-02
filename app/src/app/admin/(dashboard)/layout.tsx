"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { LayoutDashboard, FileText, Star, Settings, LogOut, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);

  // Aguarda o Supabase resolver a sessão antes de qualquer redirect
  useEffect(() => {
    // Chama init e aguarda o primeiro disparo do onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
      setInitialized(true);
    });
    // Busca sessão ativa imediatamente (caso já exista cookie)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
      setInitialized(true);
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // redirect em andamento
  }


  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumo', path: '/admin' },
    { icon: FileText, label: 'Postagens (Blog)', path: '/admin/blog' },
    { icon: Star, label: 'Avaliações', path: '/admin/reviews' },
    { icon: Settings, label: 'Ajustes', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-charcoal flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal-light border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src="/images/logo-hd.png" alt="Logo" className="h-36 w-auto" />
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path !== '/admin' && pathname.startsWith(item.path));

            return (
              <Link
                href={item.path}
                key={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold font-medium'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-auto bg-[#07090C]">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
