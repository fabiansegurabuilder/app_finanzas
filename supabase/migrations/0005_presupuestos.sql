-- Presupuestos mensuales por categoría (límite de gasto).
-- Ejecuta este script en el editor SQL de Supabase después del 0004.

create table if not exists public.budgets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  categoria  text not null,
  monto      numeric(14, 2) not null check (monto > 0),
  created_at timestamptz not null default now(),
  unique (user_id, categoria)
);

comment on table public.budgets is 'Límite de gasto mensual por categoría.';

create index if not exists budgets_user_id_idx on public.budgets (user_id);

alter table public.budgets enable row level security;

drop policy if exists "Seleccionar propios presupuestos" on public.budgets;
create policy "Seleccionar propios presupuestos"
  on public.budgets for select
  using (auth.uid() = user_id);

drop policy if exists "Insertar propios presupuestos" on public.budgets;
create policy "Insertar propios presupuestos"
  on public.budgets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar propios presupuestos" on public.budgets;
create policy "Actualizar propios presupuestos"
  on public.budgets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar propios presupuestos" on public.budgets;
create policy "Eliminar propios presupuestos"
  on public.budgets for delete
  using (auth.uid() = user_id);
