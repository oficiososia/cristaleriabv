-- =====================================================================
-- Cristalería Baix Vinalopó · esquema inicial
-- Preparado, NO aplicado. Aplicar con: supabase db push (o pegar en el
-- SQL Editor del proyecto). Ver supabase/README.md.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);
comment on table public.admins is 'Usuarios con acceso a /admin. Se añaden a mano (ver README).';

-- Función usada por las políticas RLS. SECURITY DEFINER para poder leer
-- public.admins sin depender de las políticas de esa misma tabla.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admins enable row level security;
create policy "admins: cada admin ve la lista"
  on public.admins for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Tarifas de la calculadora (una sola fila, id = 1)
-- ---------------------------------------------------------------------
create table public.pricing (
  id         smallint primary key default 1 check (id = 1),
  config     jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
comment on table public.pricing is 'Tarifas de la calculadora. Lectura pública; solo admins editan. Nunca guardar aquí precios de compra ni márgenes.';

alter table public.pricing enable row level security;
create policy "pricing: lectura pública"
  on public.pricing for select to anon, authenticated
  using (true);
create policy "pricing: admins actualizan"
  on public.pricing for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create or replace function public.touch_pricing()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.updated_by := (select auth.uid());
  return new;
end;
$$;
create trigger pricing_touch before update on public.pricing
  for each row execute function public.touch_pricing();

-- Valores iniciales = src/lib/pricing/config.ts (DEFAULT_PRICING)
insert into public.pricing (id, config) values (1, '{"version":1,"priceNote":"Precio orientativo, sujeto a confirmación tras la visita técnica.","mamparas":{"base":200,"perCmWidth":3,"tallOverCm":200,"tallSurcharge":50,"cristal":{"templado-6mm":0,"templado-8mm":0,"templado-10mm":100},"extraclaro":80,"perfileria":{"sin-perfil":0,"minima":0,"completa":60},"acabadoPerfil":{"cromo":0,"blanco":0,"negro":40,"oro-cepillado":40},"acabadoCristal":{"serigrafia":0,"acido":0,"antical":30}},"domino":{"basePerM2":85,"factors":{"espesor":{"6":1.2,"8":1.4,"10":1.6,"12":1.8},"tipoCristal":{"templado":1.5,"laminado":1.7,"extraclaro":1.5},"acabado":{"transparente":1,"satinado":1,"serigrafado":1}},"extras":{"extraclaro":80,"antical":30,"tirador":0,"freno":0,"caset":0,"varillaMl":0}},"espejos":{"basePerM2":65,"factors":{"espesor":{"4":1,"5":1.1,"6":1.2},"canto":{"pulido":1.15,"biselado":1.25},"forma":{"rectangular":1,"redondo":1,"ovalado":1,"irregular":1}},"extras":{"iluminacion":0,"antivaho":0}},"cerramientos":{"basePerM2":150,"factors":{"tipoVidrio":{"simple":1,"doble":1.33,"bajo-emisivo":1.47},"material":{"aluminio":1,"pvc":1,"madera":1},"tipoCerramiento":{"terraza":1,"balcon":1,"porche":1,"cortina-cristal":1},"acabado":{"lacado-blanco":1,"lacado-gris":1,"lacado-negro":1,"anodizado":1,"imitacion-madera":1}},"extras":{}},"aluminio":{"basePerM2":180,"factors":{"vidrio":{"simple":1,"doble":1.33,"bajo-emisivo":1.47},"tipoApertura":{"corredera":1,"abatible":1,"oscilobatiente":1,"fija":1},"tipoTrabajo":{"ventana":1,"puerta":1,"mosquitera":1,"persiana":1},"acabado":{"lacado-blanco":1,"lacado-gris":1,"lacado-negro":1,"anodizado":1,"imitacion-madera":1}},"extras":{}},"barandillas":{"basePerM2":200,"factors":{"material":{"acero-inoxidable":1,"aluminio":1,"hierro":1},"relleno":{"cristal":1,"barrotes":1,"cable":1,"chapa":1},"tipoBarandilla":{"escalera":1,"balcon":1,"terraza":1,"piscina":1},"acabado":{"pulido":1,"satinado":1,"lacado":1,"negro-mate":1}},"extras":{}},"otros":{"basePerM2":75,"factors":{"grosor":{"4":1,"6":1.2,"8":1.4,"10":1.6,"12":1.8},"tipoCristal":{"float":1,"templado":1.5,"laminado":1.7,"climalit":2,"acustico":2.2},"cantos":{"recto":1,"pulido":1.15,"bisel":1.25}},"extras":{"taladro":12},"hardware":{"none":0,"basic":80,"premium":150}},"armarios":{"casacaMl":5.2,"tubo4040Ml":6,"tubo6040Ml":7.5,"guiaSuperiorMl":4,"guiaInferiorMl":4,"tapeta":1.2,"rueda":2.5,"tirador":5,"cristalM2":{"transparente-6":40,"mate-6":45,"bronce-6":48,"transparente-8":50,"mate-8":55},"maderaM2":{"melamina":55,"mdf":48,"contrachapado":65,"pino":70,"roble":95},"acabadoM2":{"normal":0,"pintado":25,"vinilado":20}},"entrega":{"envio":50,"montajeMin":100,"montajeMax":300}}'::jsonb);

-- ---------------------------------------------------------------------
-- Citas de visita técnica
-- (se insertan solo desde la edge function book-appointment)
-- ---------------------------------------------------------------------
create table public.appointments (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  created_at       timestamptz not null default now(),
  customer_name    text not null check (char_length(customer_name) between 2 and 120),
  customer_phone   text not null check (char_length(customer_phone) between 6 and 30),
  customer_email   text check (customer_email is null or char_length(customer_email) <= 200),
  service_type     text,
  town             text,
  customer_address text,
  preferred_date   date,
  preferred_time   text check (preferred_time in ('manana', 'tarde', '')),
  distance_km      numeric(6, 1),
  visit_cost       numeric(8, 2),
  quote_total      numeric(10, 2),
  quote_summary    text,
  notes            text check (notes is null or char_length(notes) <= 1000),
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  consent_at       timestamptz not null default now()
);
create index appointments_created_at_idx on public.appointments (created_at desc);
create index appointments_status_idx on public.appointments (status);

alter table public.appointments enable row level security;
create policy "appointments: admins leen"
  on public.appointments for select to authenticated using ((select public.is_admin()));
create policy "appointments: admins actualizan"
  on public.appointments for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "appointments: admins borran"
  on public.appointments for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Mensajes del formulario de contacto
-- ---------------------------------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 2 and 120),
  phone      text not null check (char_length(phone) between 6 and 30),
  email      text not null check (char_length(email) <= 200),
  service    text,
  message    text not null check (char_length(message) between 10 and 1500),
  status     text not null default 'new' check (status in ('new', 'read', 'archived')),
  consent_at timestamptz not null default now()
);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;
create policy "contact: admins leen"
  on public.contact_messages for select to authenticated using ((select public.is_admin()));
create policy "contact: admins actualizan"
  on public.contact_messages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "contact: admins borran"
  on public.contact_messages for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Asistente virtual: conversaciones
-- ---------------------------------------------------------------------
create table public.chat_sessions (
  id              uuid primary key,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  page            text,
  message_count   integer not null default 0
);
create table public.chat_messages (
  id         bigint generated always as identity primary key,
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index chat_messages_session_idx on public.chat_messages (session_id, created_at);
create index chat_sessions_last_idx on public.chat_sessions (last_message_at desc);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
create policy "chat_sessions: admins leen" on public.chat_sessions for select to authenticated using ((select public.is_admin()));
create policy "chat_sessions: admins borran" on public.chat_sessions for delete to authenticated using ((select public.is_admin()));
create policy "chat_messages: admins leen" on public.chat_messages for select to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Límite de peticiones de las edge functions (anti-abuso)
-- Sin políticas: solo accesible con la clave secreta.
-- ---------------------------------------------------------------------
create table public.request_log (
  id         bigint generated always as identity primary key,
  fn         text not null,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);
create index request_log_lookup_idx on public.request_log (fn, ip_hash, created_at desc);
alter table public.request_log enable row level security;

-- Limpieza: borra registros de límite (> 1 día) y chats antiguos (> 12 meses).
create or replace function public.cleanup_old_rows()
returns void language sql security definer set search_path = '' as $$
  delete from public.request_log where created_at < now() - interval '1 day';
  delete from public.chat_sessions where last_message_at < now() - interval '12 months';
$$;
revoke all on function public.cleanup_old_rows() from public, anon, authenticated;
-- Programarla (opcional, requiere la extensión pg_cron):
-- select cron.schedule('cleanup-old-rows', '15 3 * * *', 'select public.cleanup_old_rows()');
