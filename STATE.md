# Estado Atual (State)

## Status Ativo: UI/UX REFINADO + LOGIN FUNCIONAL
O site do escritório Hering Gomes agora possui scroll fluido, navegação compacta e conexão real com o Supabase configurada via `.env.local`.

## Últimos Ocorridos
- `.env.local` preenchido com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Logo da navegação reduzido de 173px → 80px (e 130px → 54px ao rolar).
- `section-pinned` alterado de `h-screen overflow-hidden` → `min-h-screen`.
- Pinning GSAP (`pin: true`) removido de `AttorneySection` e `AboutSection` — scroll agora é livre e contínuo.
- Animações de entrada mantidas via scrub, animações de EXIT removidas.
- TypeScript compilando sem erros. Dev server rodando estável.

## Próximo Foco
- Testar o login do admin em `/admin/login` de ponta a ponta.
- Verificar HeroSection e LocationSection (ainda possuem `pin: true` — avaliar se precisam do mesmo tratamento).
- Polimento responsivo mobile.
- Deploy de produção.
