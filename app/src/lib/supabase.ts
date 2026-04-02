import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente Vite (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
// Fallback para strings vazias para não quebrar a compilação do front-end sem o .env configurado
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fake-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
