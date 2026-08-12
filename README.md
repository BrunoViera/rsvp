# Cumple RSVP

Sistema para crear eventos de cumpleaños, cargar invitados y llevar el control de confirmaciones (RSVP). Construido con Next.js (App Router) + Supabase, pensado para desplegarse en Vercel.

## Estado actual

Este PR trae el **scaffold base** del proyecto: configuración, esquema de base de datos, clientes de Supabase y una landing mínima. Las features (login, dashboard, RSVP, etc.) se van a ir agregando en PRs separados, cada uno referenciando su Issue correspondiente.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase**: Auth (magic link) + Postgres + Row Level Security
- **Vercel** para el deploy

## Setup local

```bash
npm install
cp .env.local.example .env.local
# completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Setup de Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ir a **SQL Editor** y ejecutar el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. En **Authentication → URL Configuration**, agregar la URL del sitio (localhost en dev, el dominio de Vercel en producción) para que los magic links redirijan bien.
4. Copiar la **Project URL** y la **anon public key** desde **Project Settings → API** hacia las variables de entorno.

## Deploy en Vercel

1. Importar este repositorio en [vercel.com/new](https://vercel.com/new).
2. Agregar las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` con el dominio final).
3. Deploy. Cada Pull Request genera automáticamente un preview.

## Estructura

```
app/               # Rutas (App Router)
lib/supabase/      # Clientes de Supabase (browser y server)
lib/types.ts       # Tipos de la base de datos
supabase/schema.sql # Esquema SQL + políticas de RLS
```
