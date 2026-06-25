# OP Video Engine — Frontend

Plataforma de generación de video personalizado a escala para **Omnicom Production**.
Este repo es el **frontend** (Next.js 15). Consume una API REST de un backend **NestJS**
(`op-video-engine-backend`, repo separado).

> 🔴 **Lo primero que tenés que saber para montar el stage:**
> el frontend **NO funciona solo**. El login y casi todas las pantallas pegan contra el
> backend real. Un stage funcional = **frontend + backend + PostgreSQL + Redis**.
> La buena noticia: el render corre en modo **`mock`** por defecto, así que **no hace falta
> montar el pipeline de video** (Remotion). Es más simple de lo que parece.

---

## TL;DR — montaje en 5 pasos

```bash
# 1. Infraestructura (Postgres + Redis) — desde este repo
docker compose up -d

# 2. Backend
cd ../op-video-engine-backend
pnpm install
cp .env.example .env                 # editá JWT_SECRET y CORS_ORIGIN (ver tabla)
pnpm prisma migrate deploy           # crea las tablas
pnpm db:seed                         # crea 5 usuarios de prueba
pnpm start:dev                       # API en http://localhost:3001/api

# 3. Frontend (en otra terminal)
cd ../op-video-engine-frontend
pnpm install
cp .env.example .env.local           # NEXT_PUBLIC_API_URL=http://localhost:3001/api
pnpm dev                             # app en http://localhost:3000
```

Entrá a **http://localhost:3000** y logueate con `admin@opengine.com` / `password123`.

---

## Usuarios de prueba (creados por el seed)

Todos comparten la contraseña **`password123`**:

| Email | Rol |
|-------|-----|
| `admin@opengine.com` | Admin |
| `designer@opengine.com` | Designer |
| `producer@opengine.com` | Producer |
| `qc@opengine.com` | QC |
| `client@opengine.com` | Client |

---

## Arquitectura

```
┌─────────────────────────┐    REST + JWT (cookie httpOnly)    ┌──────────────────────────┐
│  FRONTEND (este repo)   │ ─────────────────────────────────▶ │  BACKEND (NestJS)         │
│  Next.js 15 · React 19  │                                     │  op-video-engine-backend  │
│  http://localhost:3000  │ ◀───────────────────────────────── │  http://localhost:3001/api│
└─────────────────────────┘                                     └─────────────┬─────────────┘
                                                                               │
                                                       ┌───────────────────────┴──────────────┐
                                                       │                                       │
                                               ┌───────▼────────┐                     ┌────────▼─────────┐
                                               │  PostgreSQL    │                     │  Redis           │
                                               │  :5432 (Prisma)│                     │  :6379 (BullMQ)  │
                                               └────────────────┘                     └──────────────────┘
```

| Pieza | Tecnología | Puerto | Cómo se levanta |
|-------|------------|--------|-----------------|
| Frontend | Next.js 15, React 19, Tailwind v4, shadcn/ui | `3000` | `pnpm dev` / `pnpm start` |
| Backend | NestJS 11 + Prisma + Passport JWT + BullMQ | `3001` | `pnpm start:dev` / `pnpm start:prod` |
| PostgreSQL | Base de datos (Prisma ORM) | `5432` | `docker compose up -d` |
| Redis | Cola de render (BullMQ) | `6379` | `docker compose up -d` |

> El backend expone **todo bajo el prefijo `/api`** y usa **cookies httpOnly** para el JWT
> (CORS con `credentials: true`). Por eso el frontend debe apuntar a `.../api` y el
> `CORS_ORIGIN` del backend debe ser **exactamente** la URL del frontend.

---

## Prerrequisitos

- **Node.js** `>= 20.11.0`
- **pnpm** `10.15.1` → `npm install -g pnpm@10.15.1` (lo usan ambos repos)
- **Docker** (para Postgres + Redis vía `docker-compose.yml`)
  _o_ PostgreSQL 14+ y Redis 6+ instalados a mano.

---

## Variables de entorno

### Frontend — `.env.local`

| Variable | Descripción | Valor local / stage |
|----------|-------------|---------------------|
| `NEXT_PUBLIC_API_URL` | URL base de la API. **Debe terminar en `/api`.** | local: `http://localhost:3001/api` · stage: `https://api-stage.tu-dominio.com/api` |
| `NEXT_PUBLIC_USE_MOCKS` | `true` = datos mock para módulos sin backend + saltea JWT. **`false` en stage real.** | `false` |
| `NEXT_PUBLIC_AUTH_BYPASS` | `true` = sin redirección al login (solo demos sin auth). **`false` en stage real.** | `false` |

### Backend — `.env`

| Variable | ¿Se usa? | Qué poner | Notas |
|----------|:--------:|-----------|-------|
| `DATABASE_URL` | ✅ | `postgresql://opve:opve@localhost:5432/op_video_engine?schema=public` | Coincide con el `docker-compose.yml` |
| `JWT_SECRET` | ✅ | ⚠️ **Cambiá** por uno random: `openssl rand -base64 32` | Crítico en stage |
| `JWT_EXPIRY` | ✅ | `15m` | |
| `REFRESH_TOKEN_EXPIRY` | ✅ | `7d` | |
| `CORS_ORIGIN` | ✅ | URL **exacta** del frontend (`http://localhost:3000` o la de stage) | Sin `/` final, sin wildcard |
| `PORT` | ✅ | `3001` | |
| `NODE_ENV` | ✅ | `development` local · `production` stage | |
| `BACKEND_URL` | ✅ | URL pública del backend (`http://localhost:3001` o la de stage) | Construye URLs de uploads/outputs |
| `RENDER_PROVIDER` | ✅ | **`mock`** | `mock` = sin render real. No tocar para la demo. |
| `REMOTION_BUNDLE_PATH` | solo si `local` | **vacío** | Solo si `RENDER_PROVIDER=local` |
| `RENDER_OUTPUT_DIR` | solo si `local` | **vacío** | Default `./uploads/renders` |
| `REDIS_HOST` / `REDIS_PORT` | ✅ (con default) | **omitir** si Redis está en `localhost:6379` | Solo declararlas si Redis es remoto |

> **Redis:** aunque no aparezca en `.env.example`, BullMQ se conecta sí o sí al arrancar
> (default `localhost:6379`). Si tu Redis está en otro host, agregá `REDIS_HOST`/`REDIS_PORT`.

---

## Comandos de base de datos (backend)

```bash
pnpm prisma migrate deploy   # aplica las migraciones existentes (crea/actualiza tablas)
pnpm db:seed                 # carga usuarios, brands y datos iniciales
pnpm prisma studio           # (opcional) inspector visual de la base
```

> El repo ya tiene migraciones versionadas en `prisma/migrations/`. Usá `migrate deploy`
> (no `db push`) para que el stage quede idéntico a desarrollo.

---

## Scripts del frontend

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Dev server (Turbopack) en `:3000` |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build (usar en stage) |
| `pnpm type-check` | Chequeo de tipos |
| `pnpm lint` | Linter |
| `pnpm test` | Tests (Vitest) |
| `pnpm remotion:studio` | Previsualiza templates de video en Remotion Studio |

---

## Modo demo (solo UI, sin backend)

Si solo querés mostrar pantallas sin levantar el backend:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_AUTH_BYPASS=true
```

Entrás sin login, pero **solo** los módulos `data-engine`, `components` y `assets` muestran
datos. El resto queda vacío (dependen del backend). **No es un stage funcional** — es para
enseñar la UI nada más.

---

## Data Engine — formato de carga

El módulo **Data Engine** importa catálogos de productos para generar variaciones de video.

- **Solo acepta `.csv` y `.tsv`** (no Excel). Máx. **10 MB** / **5.000 filas**.
- Archivo de ejemplo: `../op-video-engine-docs/samples/sample-products.csv`
- Columnas esperadas: `productName, productSubtitle, price, originalPrice, productImage, brand, ctaText, legalText, category, showDiscount`
- ¿Tu fuente es Excel? Exportala como **CSV UTF-8** antes de cargarla.

---

## Despliegue en producción — qué tener en cuenta

> **Agnóstico de plataforma.** Estos requisitos son inherentes a cómo está hecha la app, no a
> ningún proveedor. Aplican igual en AWS, un VPS, Railway, Render, Docker en un servidor propio,
> etc. Quien monte decide **dónde y cómo**; esta sección dice **qué necesita la app para funcionar**.

**1. HTTPS es obligatorio en producción.** Las cookies de auth usan `secure: true` cuando
`NODE_ENV=production` (`auth.controller.ts`). Sin TLS, la cookie del JWT **no se setea** y el
login no funciona. Serví ambos apps detrás de HTTPS.

**2. Frontend y backend deben compartir dominio padre.** Las cookies usan `sameSite: 'lax'`.
- ✅ OK: `app.midominio.com` (frontend) + `api.midominio.com` (backend) → mismo sitio, la cookie viaja.
- ❌ Rompe: dominios sin parentesco (`frontend-x.com` + `api-y.com`) → la cookie se bloquea en
  requests cross-site; el login parece andar pero luego todo da **401**.
- Si se necesitan dominios totalmente separados, hay que cambiar el backend a
  `sameSite:'none'` + `secure:true`.
- `CORS_ORIGIN` del backend debe ser **exactamente** la URL del frontend (con su `https://`).

**3. `NEXT_PUBLIC_API_URL` se hornea en el BUILD, no en runtime.** Next.js incrusta las vars
`NEXT_PUBLIC_*` durante `next build`. Si se construye una imagen/artefacto y luego se cambia la
URL por variable de entorno en runtime, **no toma**. Definí `NEXT_PUBLIC_API_URL` (apuntando a la
URL pública del backend) **antes** de `pnpm build` — como build arg o en el step de build de CI.

**4. Almacenamiento de archivos = filesystem local (efímero).** Uploads e outputs de render se
escriben en `./uploads` (`uploads.controller.ts`) y se sirven en `/uploads/`. En cualquier
cómputo efímero o con varias instancias (contenedores que se reinician, autoscaling, redeploys)
**se pierden al reiniciar** y no se comparten entre instancias. Solución portable: montar un
**volumen persistente** en `./uploads`, o usar una sola instancia para la demo. El provider de
almacenamiento en nube es evolución futura del port (`StorageProvider`).

**5. Health check:** `GET /api/health` → `{ "status": "ok" }` (endpoint público, sin auth).
Usalo como health check de cualquier balanceador o supervisor de procesos.

**6. Backend en producción:**
```bash
pnpm build && pnpm start:prod   # node dist/main
pnpm prisma migrate deploy      # aplicá migraciones en cada deploy (NO migrate dev)
```

**7. Render real (opcional, NO recomendado para la demo).** Con `RENDER_PROVIDER=mock` (default)
no hace falta nada de esto. Si algún día usan `RENDER_PROVIDER=local`, el host del backend necesita
**Chromium headless** (Remotion lo requiere) + el bundle de Remotion construido desde este repo
(`pnpm bundle:remotion`). Para la demo: dejalo en `mock`.

**Servicios externos requeridos:** PostgreSQL y Redis, donde sea que se monten (servicio
gestionado o contenedor). El `docker-compose.yml` de este repo es para **local**; en producción
apuntá `DATABASE_URL` y `REDIS_HOST`/`REDIS_PORT` a las instancias correspondientes.

---

## Troubleshooting

| Síntoma | Causa / solución |
|---------|------------------|
| `fatal: Unable to create '.git/index.lock'` | Lock huérfano de un git que crasheó. Si no hay `git commit` corriendo: `rm .git/index.lock`. |
| Login no funciona / pantallas vacías | Backend caído o `NEXT_PUBLIC_API_URL` mal. Verificá que el backend responda en `:3001/api`. |
| Error 401 en todo | Mezcla de mocks con backend real. En stage real: `NEXT_PUBLIC_USE_MOCKS=false`. |
| CORS bloqueado en el navegador | `CORS_ORIGIN` del backend no coincide **exactamente** con la URL del frontend. |
| Backend no arranca | Postgres/Redis no están arriba. Corré `docker compose up -d` y reintentá. |

---

## Documentación

- **Producto (SSOT):** `../op-video-engine-docs/PRODUCT.md`
- **Arquitectura técnica:** `../op-video-engine-docs/ARCHITECTURE.md`
- **Guía para agentes IA (Claude Code):** `CLAUDE.md`
