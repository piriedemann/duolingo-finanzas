# 🐷 Fito Finanzas

**Duolingo × Animales Financieros**: un prototipo de app para aprender finanzas personales jugando,
basado en el contenido del podcast chileno [Animales Financieros](https://www.animalesfinancieros.com/).

## Qué incluye

- **Camino de aprendizaje** con 9 unidades, cada una guiada por un animal (🐜 ahorro, 🐝 presupuesto, 🐿️ fondo de emergencia,
  🦊 deudas, 🐢 interés compuesto, 🐂 inversión, 🦉 psicología del dinero, 🐘 jubilación, 🦅 ingresos) y 27 lecciones.
- **5 tipos de ejercicio**: tarjetas de concepto, alternativas, verdadero/falso, completar la frase y unir parejas.
  Sin cálculos ni "ordena los pasos": se juega desde el teléfono. Cada pregunta se entiende sola, porque el repaso
  las muestra sin la tarjeta de concepto que las precede.
- **Gamificación**: XP, racha diaria, vidas ❤️, "Lucas" 🪙 como moneda, cofres, misiones diarias, logros,
  tienda (recargar vidas, protector de racha) y práctica de errores.
- **Liga semanal con gente real**: cada jugador publica su XP semanal en Supabase (sesión anónima guardada en el
  navegador, sin registro) y la liga muestra a quienes jugaron esta semana. Ver [Liga real](#liga-real-supabase).
- **Cuenta opcional** (Google o código por correo) para guardar el progreso y recuperarlo en cualquier dispositivo.
  Ver [Cuentas](#cuentas-login-y-progreso-en-la-nube).
- **Episodios**: catálogo buscable del podcast con ideas clave en tarjetas, link a Spotify y conexión con la unidad relacionada.
- **Capítulos del mes**: arriba de Episodios, los capítulos publicados este mes y los puntos que llevas en sus quizzes
  (mejor resultado de cada uno: 8 por completarlo, 12 si es perfecto). Base para una competencia mensual que cuente
  solo esos capítulos; el mejor XP por quiz queda en `quizXp` y se calcula con `pointsFor` en `src/state/store.ts`.
- **Herramientas**: simulador de interés compuesto, presupuesto 50/30/20, fondo de emergencia y la trampa del pago mínimo.
- Mascota **Chanchi** 🐷, sonidos, confeti, modo oscuro, responsive (móvil y escritorio). Progreso guardado en `localStorage`.
- **Modo demo** (Perfil → Ajustes) para desbloquear todas las lecciones al mostrarla.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

Stack: Vite + React + TypeScript. El único backend es Supabase, opcional, para la liga y las cuentas. Deploy automático a GitHub Pages
(rama `gh-pages`) con `.github/workflows/deploy.yml`.

## Liga real (Supabase)

Sin configurar nada, la liga corre en "modo local" y solo muestra tu XP. Para que aparezcan jugadores reales:

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. **SQL Editor** → pega y ejecuta `supabase/schema.sql` (crea la tabla `players` con sus políticas de seguridad).
3. **Authentication → Sign In / Providers** → activa **Anonymous sign-ins**. Así cada visitante recibe un id
   sin registrarse; la sesión queda guardada en su navegador.
4. **Project Settings → API** → copia la *Project URL* y la *anon public key*.
   - Local: crea `.env.local` a partir de `.env.example`.
   - Producción: en GitHub, *Settings → Secrets and variables → Actions*, agrega `VITE_SUPABASE_URL` y
     `VITE_SUPABASE_ANON_KEY`. El workflow de deploy las inyecta al build.

Cómo funciona: `src/lib/leaderboard.ts` crea la sesión anónima, publica `name`, `xp`, `week_xp` y `week_start` cada
vez que cambia el estado (con debounce) y lee la tabla cada 30 s mientras la liga está abierta. Las políticas RLS
permiten leer a todos y escribir solo la fila propia (`auth.uid() = id`). La anon key es pública por diseño.

## Dominio

La app vive en `https://fito.animalesfinancieros.com/`, un subdominio del sitio del podcast (Squarespace) apuntado a
GitHub Pages: un registro `CNAME` con host `fito` y valor `piriedemann.github.io`, más el archivo `public/CNAME` que
Vite copia al build y que GitHub Pages usa para asociar el dominio. HTTPS se activa en *Settings → Pages → Enforce
HTTPS* una vez emitido el certificado. La dirección antigua (`piriedemann.github.io/duolingo-finanzas`) redirige sola.

Al cambiar de dominio, el progreso guardado solo en el navegador (sin cuenta) no se traslada: localStorage es por
dominio. Lo que está en una cuenta (Google) se recupera iniciando sesión en el dominio nuevo.

## Cuentas (login) y progreso en la nube

Con Supabase configurado, cualquier persona puede iniciar sesión desde **Perfil → Cuenta** (o desde "¿Ya tienes
cuenta?" en la bienvenida) y su progreso queda guardado en la tabla `progress`, asociado a su cuenta. Al entrar
desde otro teléfono o computador, se baja ese progreso y se mezcla con el local: se conserva el que tenga más XP y se
unen lecciones completadas, logros, episodios escuchados y quizzes. Desde ahí, cada cambio se sube con debounce.

Dos formas de entrar, sin contraseñas:

- **Google**: en Supabase, *Authentication → Sign In / Providers → Google*, con un Client ID/Secret creado en
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (tipo "Web application", con la URL de
  callback que muestra Supabase como *Authorized redirect URI*).
- **Código por correo** (opcional, apagado por defecto): requiere SMTP propio en Supabase, porque el correo
  integrado permite solo 2 envíos por hora y, en proyectos gratuitos creados desde junio de 2026, no deja editar
  las plantillas. Pasos: configurar SMTP (*Project Settings → Authentication → SMTP Settings*; Resend o Brevo
  tienen planes gratis), subir el límite en *Authentication → Rate Limits*, en *Authentication → Emails → Magic
  Link* poner `{{ .Token }}` en el cuerpo para que llegue un código de 6 dígitos, y activar la opción en la app con
  `VITE_AUTH_EMAIL=1` (en GitHub: *Settings → Secrets and variables → Actions → Variables*).

En ambos casos:

1. Vuelve a ejecutar `supabase/schema.sql` (crea `progress` y la política para borrar la fila anónima de la liga).
2. En *Authentication → URL Configuration*, pon la URL de la app como *Site URL* y agrégala a *Redirect URLs*
   (producción: `https://fito.animalesfinancieros.com/`; local: `http://localhost:5173/`).

Al iniciar sesión, la sesión anónima del navegador se reemplaza por la de la cuenta: la fila anónima se borra de
`players` y el XP se publica con el id de la cuenta. "Cerrar sesión" deja el dispositivo en cero (el progreso sigue
en la cuenta). Sin iniciar sesión, todo funciona igual que antes: progreso en el navegador y liga con sesión anónima.

> Lo que se publica es el nombre elegido en el onboarding y el XP; cualquiera que abra la liga lo ve. Al ser
> un prototipo sin validación en servidor, un jugador con conocimientos técnicos podría inflar su XP.

## Talleres: módulo especial (`#/taller`)

Para talleres en vivo hay un link separado, con su propia entrada por apodo y sin el resto de la app:
`https://fito.animalesfinancieros.com/#/taller`. Hoy está configurado para el taller con
Fundación Educación 2020 (1 de octubre 2026): contenido y fechas en `src/data/workshop/e2020.ts`.

- Cada participante entra con un apodo (queda en la misma sesión anónima de Supabase) y responde los módulos
  cuando el facilitador lo indica. Los enunciados no nombran el concepto: se revela en la última pregunta.
- **Panel del facilitador** en `#/taller/panel`: cuántos entraron, cuántos terminaron cada módulo y el % de
  acierto por pregunta (solo primer intento), actualizado cada 5 s. Las preguntas con menos de 60% se marcan.
  El link no tiene clave: no lo compartas con el grupo.
- **Desafío de una semana**: ranking de los participantes del taller por XP ganado entre las fechas del desafío
  (columna `challenge_xp`). Cuenta todo lo que hagan en Fito Finanzas, no solo el taller.
- Requiere volver a ejecutar `supabase/schema.sql` (agrega `cohort`, `challenge_xp` y la tabla
  `workshop_answers`; es idempotente). Sin eso, la app base sigue funcionando pero el panel y el ranking no.

## Transcripts → lecciones

`scripts/generate-from-transcripts.ts` lee `transcripts/index.json` + `transcripts/*.txt` y usa la API de Claude para generar
resumen, ideas clave y un quiz por episodio en `src/data/generated/`. `transcripts/` está en `.gitignore` (contenido privado).

```bash
ANTHROPIC_API_KEY=... node scripts/generate-from-transcripts.ts   # incremental; --only 70,92 --force
```

### Actualización automática

`.github/workflows/content.yml` baja solo las transcripciones de episodios que aún no tienen quiz
(`fetch_transcripts.mjs --skip-generated`), genera el contenido nuevo, verifica que la app compile, hace commit en
`main` y lanza el deploy. Si no hay capítulos nuevos, termina sin cambios. Se ejecuta de tres formas:

- **Aviso desde Mundo** (la vía normal): cuando la automatización de mundo.animalesfinancieros.com termina de guardar
  una transcripción, llama a GitHub y el workflow parte al instante.
- **Todos los jueves**, como respaldo por si un aviso se pierde.
- **A mano**, desde la pestaña *Actions*.

Necesita tres secretos en *Settings → Secrets and variables → Actions*: `AF_EMAIL` y `AF_PASSWORD` (cuenta del
Estudio con la que el script entra a leer las transcripciones) y `ANTHROPIC_API_KEY`.

**Configurar el aviso en Mundo.** Crear un token de grano fino en GitHub (*Settings → Developer settings → Personal
access tokens → Fine-grained*), con acceso solo al repo `piriedemann/duolingo-finanzas` y permiso *Contents: Read and
write* (es lo que GitHub exige para `repository_dispatch`). Guardarlo como secreto en Mundo y, al final del job que
descarga una transcripción, hacer:

```bash
curl -sS -X POST https://api.github.com/repos/piriedemann/duolingo-finanzas/dispatches \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{"event_type":"transcript-ready","client_payload":{"numbers":[216]}}'
```

GitHub responde `204` sin cuerpo. El `event_type` tiene que ser exactamente `transcript-ready`; el `client_payload` es
informativo (queda en el log del workflow) y puede ir vacío: el workflow siempre baja todo lo que falte, no solo lo
avisado. Varios avisos seguidos se encolan y no se pisan.

## Contenido

- `src/data/units/*.ts`: lecciones por unidad (tipos en `src/data/types.ts`, guía de estilo en `research/CONTENT_BRIEF.md`).
- `src/data/episodes.json`: catálogo de episodios (hoy armado desde fuentes públicas; se reemplazará con los transcripts).

> Prototipo educativo. No constituye asesoría financiera.
