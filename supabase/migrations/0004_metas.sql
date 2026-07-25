-- Metas de ahorro por usuario.
-- Ejecuta este script en el editor SQL de Supabase después del 0003.

create table if not exists public.goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  nombre         text not null check (char_length(nombre) between 1 and 60),
  monto_objetivo numeric(14, 2) not null check (monto_objetivo > 0),
  monto_actual   numeric(14, 2) not null default 0 check (monto_actual >= 0),
  fecha_limite   date,
  created_at     timestamptz not null default now()
);

comment on table public.goals is 'Metas de ahorro de cada usuario.';

create index if not exists goals_user_id_idx on public.goals (user_id);

alter table public.goals enable row level security;

drop policy if exists "Seleccionar propias metas" on public.goals;
create policy "Seleccionar propias metas"
  on public.goals for select
  using (auth.uid() = user_id);

drop policy if exists "Insertar propias metas" on public.goals;
create policy "Insertar propias metas"
  on public.goals for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar propias metas" on public.goals;
create policy "Actualizar propias metas"
  on public.goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar propias metas" on public.goals;
create policy "Eliminar propias metas"
  on public.goals for delete
  using (auth.uid() = user_id);
