-- Almacenamiento de fotos de perfil (avatares).
-- Ejecuta este script en el editor SQL de Supabase después del 0001.

-- 1. Bucket público para avatares
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Políticas: lectura pública; cada usuario gestiona su propia carpeta.
--    La ruta del archivo debe empezar por el uid del usuario (ej. "<uid>/foto.png").

drop policy if exists "Avatares visibles públicamente" on storage.objects;
create policy "Avatares visibles públicamente"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Subir avatar propio" on storage.objects;
create policy "Subir avatar propio"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Actualizar avatar propio" on storage.objects;
create policy "Actualizar avatar propio"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Eliminar avatar propio" on storage.objects;
create policy "Eliminar avatar propio"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
