-- Categorías personalizadas por usuario (además de las predefinidas en la app).
-- Ejecuta este script en el editor SQL de Supabase después del 0002.

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  nombre     text not null check (char_length(nombre) between 1 and 40),
  tipo       text not null check (tipo in ('ingreso', 'gasto', 'ambos')),
  color      text not null default 'var(--muted-foreground)',
  created_at timestamptz not null default now(),
  unique (user_id, nombre)
);

comment on table public.categories is 'Categorías personalizadas de cada usuario.';

create index if not exists categories_user_id_idx
  on public.categories (user_id);

alter table public.categories enable row level security;

drop policy if exists "Seleccionar propias categorías" on public.categories;
create policy "Seleccionar propias categorías"
  on public.categories for select
  using (auth.uid() = user_id);

drop policy if exists "Insertar propias categorías" on public.categories;
create policy "Insertar propias categorías"
  on public.categories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar propias categorías" on public.categories;
create policy "Actualizar propias categorías"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar propias categorías" on public.categories;
create policy "Eliminar propias categorías"
  on public.categories for delete
  using (auth.uid() = user_id);
