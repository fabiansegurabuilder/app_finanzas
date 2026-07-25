# Seguridad

## Manejo de secretos

- **Nada de secretos en el repositorio.** Las credenciales viven en `.env.local`
  (ignorado por git). Solo se versiona `.env.example` con valores de ejemplo.
- Las variables `NEXT_PUBLIC_*` se incrustan en el bundle del navegador y son
  **públicas por diseño**. La clave _anon/publishable_ de Supabase es pública a
  propósito.
- **Nunca** incluyas la clave `service_role` (o _secret key_) de Supabase en el
  cliente ni con prefijo `NEXT_PUBLIC_`: otorga acceso total saltándose RLS.

## Controles aplicados

- **Row Level Security (RLS)** en todas las tablas (`transactions`, `categories`,
  `goals`, `budgets`, `recurring_transactions`): cada usuario solo accede a sus
  propias filas. También en el bucket de Storage `avatars`.
- **Autenticación** con Supabase Auth (email/contraseña) y protección de rutas
  vía `proxy.ts` + verificación de sesión en el layout autenticado.
- **Cabeceras de seguridad** en `next.config.ts` (frame, nosniff, referrer,
  permissions-policy, HSTS y CSP en producción).

## Reporte de vulnerabilidades

Si encuentras un problema de seguridad, no abras un issue público: contacta al
responsable del proyecto de forma privada.

## Si se filtra una clave

1. Rota la clave en **Supabase → Project Settings → API**.
2. Actualiza `.env.local` y las variables de entorno en Vercel.
3. Si se subió por error, elimínala del historial de git (`git filter-repo`) y
   rota igualmente (asume que quedó expuesta).
