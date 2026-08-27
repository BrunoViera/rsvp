# El cumple de

**https://elcumplede.com**

Sistema para crear eventos de cumpleaños, cargar invitados y llevar el control de confirmaciones (RSVP). Construido con Next.js (App Router) + Supabase, pensado para desplegarse en Vercel.

## Estado actual

Este PR trae el **scaffold base** del proyecto: configuración, esquema de base de datos, clientes de Supabase y una landing mínima. Las features (login, dashboard, RSVP, etc.) se van a ir agregando en PRs separados, cada uno referenciando su Issue correspondiente.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase**: Auth (magic link) + Postgres + Row Level Security
- **Vercel** para el deploy

## Setup local (100% local, recomendado para desarrollo)

Con este approach corrés Postgres + Auth + Storage de Supabase en Docker, en tu máquina. No dependés de internet ni de límites de envío de email: los magic links se capturan en un inbox local.

**Requisitos:** Docker Desktop corriendo, y la [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
# 1. Instalar la CLI (una sola vez)
brew install supabase/tap/supabase

# 2. Instalar dependencias del proyecto
pnpm install

# 3. Inicializar Supabase en el repo (crea supabase/config.toml)
#    Si ya existe supabase/config.toml, saltear este paso.
supabase init

# 4. Levantar el stack local (Postgres, Auth, Storage, Studio, Mailpit)
supabase start
```

El comando `supabase start` aplica automáticamente las migraciones de `supabase/migrations/` (ya incluidas en este repo) y al final imprime algo así:

```
API URL: http://127.0.0.1:54321
anon key: eyJ...
service_role key: eyJ...
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
```

Con esos valores, armá tu `.env.local`:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<el "anon key" que imprimió supabase start>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Después corré la app como siempre:

```bash
pnpm dev
```

### Cómo entrar al dashboard (login local)

1. Andá a `http://localhost:3000/login` y pedí el link mágico con cualquier email (ej: `dev@local.test`, no hace falta que sea real).
2. Abrí el inbox local en `http://127.0.0.1:54324` (Mailpit) — ahí vas a ver el email con el link mágico al instante, sin límites de envío.
3. Hacé clic en el link del mail: te va a redirigir a `/dashboard` ya logueado.

La sesión queda guardada en cookies del navegador, así que mientras no la borrés/cierres sesión, no te va a volver a pedir el login en cada visita.

### Comandos útiles del día a día

```bash
supabase start        # levantar el stack local (Docker)
supabase stop          # apagarlo
supabase db reset       # recrea la DB local desde cero y reaplica las migraciones
supabase status         # ver URLs/keys sin tener que arrancar de nuevo
```

Podés inspeccionar y editar los datos a mano en **Supabase Studio** local: `http://127.0.0.1:54323`.

## Setup con Supabase cloud (para producción / staging)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ir a **SQL Editor** y ejecutar el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y luego, en orden, `002_event_details.sql`, `003_dietary_restrictions.sql`, `004_collaborators.sql` y `005_grants.sql`.
3. En **Authentication → URL Configuration**, agregar la URL del sitio (localhost en dev, el dominio de Vercel en producción) para que los magic links redirijan bien.
4. Copiar la **Project URL** y la **Publishable key** (`sb_publishable_...`) desde **Project Settings → API Keys** hacia las variables de entorno. (Si tu proyecto todavía no tiene una publishable key, hacé click en "Create new API Keys" en esa misma pantalla.)

> Nota: en el plan free de Supabase cloud, el envío de magic links por el SMTP propio de Supabase está limitado (2 emails/hora), así que para desarrollo del día a día conviene el setup 100% local de arriba.

## Deploy en Vercel

1. Importar este repositorio en [vercel.com/new](https://vercel.com/new).
2. Agregar las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` con el dominio final) apuntando a tu proyecto Supabase cloud.
3. Deploy. Cada Pull Request genera automáticamente un preview.

## Estructura

```
app/                    # Rutas (App Router)
lib/supabase/           # Clientes de Supabase (browser y server)
lib/types.ts            # Tipos de la base de datos
supabase/schema.sql      # Esquema SQL base (para correr a mano en Supabase cloud)
supabase/00X_*.sql      # Migraciones incrementales (para correr a mano en Supabase cloud)
supabase/migrations/    # Las mismas migraciones, versionadas para la Supabase CLI (local)
```
