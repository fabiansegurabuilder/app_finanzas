-- Esquema inicial: tabla de transacciones con Row Level Security.
-- Ejecuta este script en el editor SQL de Supabase (o vía CLI de Supabase).

-- 1. Tabla de transacciones
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  descripcion text not null check (char_length(descripcion) between 1 and 200),
  valor       numeric(14, 2) not null check (valor >= 0),
  tipo        text not null check (tipo in ('ingreso', 'gasto')),
  categoria   text not null,
  fecha       date not null,
  created_at  timestamptz not null default now()
);

comment on table public.transactions is 'Ingresos y gastos de cada usuario.';

-- 2. Índices para filtros habituales (por usuario y por fecha)
create index if not exists transactions_user_id_fecha_idx
  on public.transactions (user_id, fecha desc);

-- 3. Row Level Security: cada usuario solo accede a sus propias filas
alter table public.transactions enable row level security;

drop policy if exists "Seleccionar propias transacciones" on public.transactions;
create policy "Seleccionar propias transacciones"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Insertar propias transacciones" on public.transactions;
create policy "Insertar propias transacciones"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar propias transacciones" on public.transactions;
create policy "Actualizar propias transacciones"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar propias transacciones" on public.transactions;
create policy "Eliminar propias transacciones"
  on public.transactions for delete
  using (auth.uid() = user_id);
