# Supabase · puesta en marcha

Todo está **preparado pero sin aplicar**. Cuando tengáis la organización y el proyecto, seguid estos pasos (unos 15 minutos).

## 1. Crear el proyecto

1. En [supabase.com](https://supabase.com) crea la organización de la cristalería y, dentro, un proyecto `cristaleriabv` en la región **eu-west-1 (Irlanda)** o **eu-central-1 (Fráncfort)**.
2. En **Settings → API Keys** copia la **Project URL**, la **publishable key** (`sb_publishable_…`) y deja localizada la **secret key** (no se copia en ningún sitio de la web).

## 2. Aplicar el esquema

Opción A (recomendada, con la CLI):

```bash
npx supabase login
npx supabase link --project-ref <REF_DEL_PROYECTO>
npx supabase db push
```

Opción B: abre **SQL Editor**, pega el contenido de `migrations/20261118120000_init.sql` y pulsa **Run**.

Crea las tablas `pricing`, `appointments`, `contact_messages`, `chat_sessions`, `chat_messages`, `admins` y `request_log`, todas con RLS:

| Tabla | Público (web) | Administradores |
| --- | --- | --- |
| `pricing` | Lectura | Lectura y edición |
| `appointments`, `contact_messages` | Sin acceso (se insertan vía edge functions) | Lectura, cambio de estado, borrado |
| `chat_sessions`, `chat_messages` | Sin acceso | Lectura |
| `request_log` | Sin acceso | Sin acceso (solo funciones) |

## 3. Edge functions

```bash
npx supabase functions deploy chat
npx supabase functions deploy book-appointment
npx supabase functions deploy contact
```

`config.toml` ya las marca con `verify_jwt = false` (necesario con las claves `sb_publishable_…`); cada función valida, sanea y limita por IP sus entradas.

Secretos (**Edge Functions → Secrets**, o `npx supabase secrets set NOMBRE=valor`):

| Secreto | Obligatorio | Valor |
| --- | --- | --- |
| `OPENAI_API_KEY` | Sí, para el asistente | Clave de la API de OpenAI |
| `OPENAI_MODEL` | No | Modelo a usar (por defecto `gpt-4o-mini`) |
| `ALLOWED_ORIGINS` | Recomendado | Dominios de la web separados por comas, p. ej. `https://cristaleriabaixvinalopo.es,https://cristaleriabv.vercel.app` |
| `RATE_LIMIT_SALT` | Recomendado | Cualquier texto aleatorio largo |

`SUPABASE_URL` y `SUPABASE_SECRET_KEYS` los inyecta Supabase automáticamente.

Si cambiáis textos de servicios, preguntas frecuentes o precios por defecto, regenerad el conocimiento del asistente y volved a desplegar `chat`:

```bash
npm run knowledge
npx supabase functions deploy chat
```

## 4. Usuarios del panel /admin

1. **Authentication → Sign In / Providers**: desactiva **Allow new users to sign up** (nadie puede registrarse solo).
2. **Authentication → Users → Invite user**: invita a `info@cristaleriabaixvinalopo.es` (y a quien haga falta).
3. Dale permisos de administrador en el **SQL Editor**:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'info@cristaleriabaixvinalopo.es';
```

4. En **Authentication → URL Configuration** añade la URL de la web (y `/admin`) a las URLs de redirección, para el enlace de «He olvidado mi contraseña».

## 5. Conectar la web

En Vercel (**Settings → Environment Variables**) y en `.env.local` para desarrollo:

```
NEXT_PUBLIC_SUPABASE_URL=https://<REF>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://cristaleriabaixvinalopo.es
```

Sin estas variables la web funciona igual, pero los formularios y la reserva envían por WhatsApp y el asistente responde con las preguntas frecuentes.

## 6. Limpieza automática (opcional)

Activa la extensión `pg_cron` y programa la limpieza diaria de registros antiguos (límite de peticiones > 1 día, chats > 12 meses):

```sql
select cron.schedule('cleanup-old-rows', '15 3 * * *', 'select public.cleanup_old_rows()');
```
