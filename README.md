# App Finanzas Personales

Web app para gestionar finanzas personales: registra **ingresos** y **gastos**, categorízalos y visualiza un **dashboard** con el resumen mensual (ingreso total, gasto total y saldo), gráfico por categoría, filtros y exportación a CSV.

> Proyecto de clase. Cada usuario autenticado ve y gestiona únicamente sus propias transacciones (Row Level Security en Supabase).

## Stack

- **Next.js** (App Router) + **TypeScript** (modo estricto)
- **Tailwind CSS v4** + **shadcn/ui**
- **Recharts** para gráficos
- **Supabase** (PostgreSQL + Auth + RLS) como backend
- **Vitest** + **Testing Library** para pruebas
- Despliegue en **Vercel**

## Requisitos previos

- **Node.js 18.18+** (recomendado 20+)
- **npm**
- Una cuenta de **Supabase** (para las fases de backend)

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con los datos de tu proyecto Supabase

# 3. Levantar el entorno de desarrollo
npm run dev
```

La app queda disponible en http://localhost:3000.

## Variables de entorno

Definidas en `.env.example`. Copia el archivo a `.env.local` y completa:

| Variable                        | Descripción                                         |
| ------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase (Project Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anónima de Supabase (anon public).    |

> Nunca subas `.env.local` ni claves reales al repositorio. `.gitignore` ya excluye los archivos `.env*` (salvo `.env.example`).

## Scripts disponibles

| Script                 | Descripción                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Entorno de desarrollo.                    |
| `npm run build`        | Compilación de producción.                |
| `npm run start`        | Sirve la compilación de producción.       |
| `npm run lint`         | Linter (ESLint).                          |
| `npm run typecheck`    | Verificación de tipos (`tsc --noEmit`).   |
| `npm run test`         | Pruebas (Vitest).                         |
| `npm run test:watch`   | Pruebas en modo watch.                    |
| `npm run format`       | Formatea el código con Prettier.          |
| `npm run format:check` | Verifica el formato sin escribir cambios. |

## Estructura del proyecto

```text
src/
├── app/          # Rutas (App Router) y layouts
├── components/   # UI reutilizable (incluye components/ui de shadcn)
├── features/     # Lógica por dominio (transacciones, dashboard, auth)
├── lib/          # Utilidades y clientes (Supabase, helpers)
└── types/        # Tipos compartidos
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En [Vercel](https://vercel.com), importa el repositorio.
3. Configura las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en **Project Settings → Environment Variables**.
4. Vercel detecta Next.js y despliega automáticamente en cada push.

## Estado del proyecto

- [x] **Fase 1** — Setup del repositorio, tooling y calidad.
- [x] **Fase 2** — Design system, layout, navegación y metadatos SEO.
- [ ] **Fase 3** — Supabase: esquema, RLS y autenticación.
- [ ] **Fase 4** — Dashboard, CRUD de transacciones, filtros y exportación CSV.
- [ ] **Fase 5** — Pruebas, verificación responsive/accesible y despliegue.
