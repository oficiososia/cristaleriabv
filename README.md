# Cristalería Baix Vinalopó · web

Web corporativa con calculadora de presupuestos, reserva de visita técnica, asistente virtual y panel de administración.

- **Diseño:** estructura de la plantilla Formis (fondo crema, tipografía Cabinet Grotesk + Instrument Sans + Fraunces) con los colores del logo (marino `#0A2A48` y crema `#F2E8C8`) y un estilo *Liquid Glass* recomendado por UI UX Pro Max. Sistema de diseño en [`design-system/MASTER.md`](design-system/MASTER.md).
- **Tecnología:** Next.js 16 (App Router, Cache Components), Tailwind CSS 4, shadcn/ui (Base UI), Motion. Backend en Supabase (Postgres + edge functions). Alojamiento previsto en Vercel.

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # opcional: sin Supabase funciona en modo WhatsApp
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Compilación y servidor de producción |
| `npm run lint` / `npm run typecheck` | ESLint y TypeScript |
| `npm run knowledge` | Regenera el conocimiento del asistente (`supabase/functions/_shared/knowledge.ts`) |

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Teléfonos, WhatsApp, email, dirección, horario | `src/content/site.ts` |
| Servicios (textos y SEO) | `src/content/services.ts` |
| Preguntas frecuentes | `src/content/faq.ts` |
| Proceso de trabajo | `src/content/process.ts` |
| Equipo | `src/content/team.ts` |
| Fotos (ruta, autor, licencia, texto alternativo) | `public/images/credits.json` |
| Galería de trabajos | `src/content/works.ts` |
| Tarifas de la calculadora (por defecto) | `src/lib/pricing/config.ts` → con Supabase, desde `/admin` |
| Campos y fórmulas de la calculadora | `src/lib/pricing/categories.ts` |
| Desplazamiento (10 €/10 km, gratis en Crevillente) y poblaciones | `src/lib/travel.ts` |
| Textos legales | `src/app/(site)/aviso-legal`, `privacidad`, `cookies` |

## Funcionalidades

- **Calculadora** (`/presupuesto`), en 4 pasos: servicio → configuración (8 categorías, mampara a medida y modelos estándar) → visita y entrega → resumen. Envío por WhatsApp, reserva de visita e impresión/PDF. Precio en directo y desglose.
- **Desplazamiento:** distancias por carretera desde C/ Pío XII, 5 (OpenStreetMap), geolocalización opcional que no sale del navegador, o km a mano.
- **Reserva de visita técnica y contacto:** se guardan en Supabase mediante edge functions con validación, campo trampa anti-spam y límite por IP.
- **Asistente virtual:** edge function `chat` con OpenAI y el conocimiento de la web. Sin backend, responde en local con las preguntas frecuentes.
- **Panel `/admin`:** citas (cambio de estado), mensajes, editor de tarifas y conversaciones del asistente. Acceso solo para usuarios de la tabla `admins`.
- **SEO:** metadatos por página, `sitemap.xml`, `robots.txt` y datos estructurados `HomeAndConstructionBusiness`.

## Modo sin backend

Mientras no existan `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:

- los formularios y la reserva abren WhatsApp (650 06 63 23) con los datos ya escritos;
- el asistente responde con las preguntas frecuentes;
- la calculadora usa las tarifas de `config.ts`;
- `/admin` muestra cómo configurarlo.

## Supabase

Migración, edge functions y pasos de puesta en marcha en [`supabase/README.md`](supabase/README.md). **Nada está aplicado todavía.**
