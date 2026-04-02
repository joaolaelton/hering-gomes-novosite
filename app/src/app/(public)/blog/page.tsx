import { supabase } from '@/lib/supabase';
import BlogClient from './BlogClient';
import { Metadata } from 'next';

export const revalidate = 60; // ISG: Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Blog - Hering Gomes',
  description: 'Atualizações jurídicas, análises de legislação e orientações do escritório Hering Gomes.',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_url, category, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  return <BlogClient initialPosts={posts || []} />;
}
