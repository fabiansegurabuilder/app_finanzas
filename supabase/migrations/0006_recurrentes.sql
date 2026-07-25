-- Transacciones recurrentes (ingresos/gastos fijos que se repiten).
-- Ejecuta este script en el editor SQL de Supabase después del 0005.

create table if not exists public.recurring_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  descripcion   text not null check (char_length(descripcion) between 1 and 200),
  valor         numeric(14, 2) not null check (valor > 0),
  tipo          text not null check (tipo in ('ingreso', 'gasto')),
  categoria     text not null,
  frecuencia    text not null check (frecuencia in ('semanal', 'quincenal', 'mensual')),
  proxima_fecha date not null,
  activa        boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table public.recurring_transactions is 'Movimientos recurrentes de cada usuario.';

create index if not exists recurring_user_id_idx
  on public.recurring_transactions (user_id);

alter table public.recurring_transactions enable row level security;

drop policy if exists "Seleccionar propias recurrentes" on public.recurring_transactions;
create policy "Seleccionar propias recurrentes"
  on public.recurring_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Insertar propias recurrentes" on public.recurring_transactions;
create policy "Insertar propias recurrentes"
  on public.recurring_transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar propias recurrentes" on public.recurring_transactions;
create policy "Actualizar propias recurrentes"
  on public.recurring_transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar propias recurrentes" on public.recurring_transactions;
create policy "Eliminar propias recurrentes"
  on public.recurring_transactions for delete
  using (auth.uid() = user_id);
