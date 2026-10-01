-- Animalingo · liga semanal con jugadores reales
-- Ejecutar en Supabase → SQL Editor. Además, habilitar "Anonymous sign-ins" en
-- Authentication → Sign In / Providers.

create table if not exists public.players (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default 'Anónimo' check (char_length(name) between 1 and 20),
  xp          integer not null default 0 check (xp >= 0),
  week_start  date not null,
  week_xp     integer not null default 0 check (week_xp >= 0),
  streak      integer not null default 0 check (streak >= 0),
  updated_at  timestamptz not null default now()
);

create index if not exists players_week_idx on public.players (week_start, week_xp desc);

alter table public.players enable row level security;

-- Cualquiera (incluso sin sesión) puede leer la liga.
drop policy if exists "players_read" on public.players;
create policy "players_read" on public.players
  for select using (true);

-- Cada jugador (sesión anónima o con login) solo puede crear y editar su propia fila.
drop policy if exists "players_insert_own" on public.players;
create policy "players_insert_own" on public.players
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "players_update_own" on public.players;
create policy "players_update_own" on public.players
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Mantenimiento (opcional): cada navegador nuevo crea un usuario anónimo. Para no acumular
-- filas abandonadas, ejecutar de vez en cuando (o programar con pg_cron):
--   delete from auth.users
--   where is_anonymous and last_sign_in_at < now() - interval '60 days';
-- La fila en public.players se borra sola (on delete cascade).

-- ---------- Talleres (módulo especial, p. ej. Educación 2020) ----------
-- Idempotente: se puede volver a ejecutar el archivo completo sobre un proyecto existente.

alter table public.players add column if not exists cohort text;
alter table public.players add column if not exists challenge_xp integer not null default 0;
create index if not exists players_cohort_idx on public.players (cohort, challenge_xp desc);

-- Primer intento de cada pregunta de cada participante; el panel del facilitador lo agrega en vivo.
create table if not exists public.workshop_answers (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  workshop    text not null,
  module      text not null,
  question    integer not null,
  correct     boolean not null,
  created_at  timestamptz not null default now(),
  unique (user_id, workshop, module, question)
);

create index if not exists workshop_answers_ws_idx on public.workshop_answers (workshop, module, question);

alter table public.workshop_answers enable row level security;

drop policy if exists "workshop_answers_read" on public.workshop_answers;
create policy "workshop_answers_read" on public.workshop_answers
  for select using (true);

drop policy if exists "workshop_answers_insert_own" on public.workshop_answers;
create policy "workshop_answers_insert_own" on public.workshop_answers
  for insert to authenticated with check (auth.uid() = user_id);

-- ---------- Cuentas y progreso en la nube ----------
-- Idempotente. Además, en el panel de Supabase:
--   · Authentication → Sign In / Providers: habilitar Google (Client ID/Secret de Google Cloud)
--     y/o Email. Para recibir un código en vez de un link, en Authentication → Email Templates →
--     Magic Link usar {{ .Token }} en el cuerpo del correo.
--   · Authentication → URL Configuration: Site URL y Redirect URLs con la URL de la app
--     (p. ej. https://piriedemann.github.io/duolingo-finanzas/).

create table if not exists public.progress (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  state       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Solo cuentas reales (no anónimas) y solo su propia fila: nadie más puede leerla ni escribirla.
drop policy if exists "progress_own" on public.progress;
create policy "progress_own" on public.progress
  for all to authenticated
  using (auth.uid() = user_id and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  with check (auth.uid() = user_id and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- Al iniciar sesión, el jugador borra su fila anónima de la liga para no aparecer dos veces.
drop policy if exists "players_delete_own" on public.players;
create policy "players_delete_own" on public.players
  for delete to authenticated using (auth.uid() = id);
