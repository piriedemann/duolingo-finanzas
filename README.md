# 🐷 Animalingo

**Duolingo × Animales Financieros**: un prototipo de app para aprender finanzas personales jugando,
basado en el contenido del podcast chileno [Animales Financieros](https://www.animalesfinancieros.com/).

## Qué incluye

- **Camino de aprendizaje** con 9 unidades, cada una guiada por un animal (🐜 ahorro, 🐝 presupuesto, 🐿️ fondo de emergencia,
  🦊 deudas, 🐢 interés compuesto, 🐂 inversión, 🦉 psicología del dinero, 🐘 jubilación, 🦅 ingresos) y 27 lecciones.
- **7 tipos de ejercicio**: tarjetas de concepto, alternativas, verdadero/falso, completar la frase, unir parejas,
  ordenar pasos y estimar números con un slider.
- **Gamificación**: XP, racha diaria, vidas ❤️, "Lucas" 🪙 como moneda, cofres, misiones diarias, logros,
  tienda (recargar vidas, protector de racha) y práctica de errores.
- **Liga semanal con gente real**: cada jugador publica su XP semanal en Supabase (sesión anónima guardada en el
  navegador, sin registro) y la liga muestra a quienes jugaron esta semana. Ver [Liga real](#liga-real-supabase).
- **Episodios**: catálogo buscable del podcast con ideas clave en tarjetas, link a Spotify y conexión con la unidad relacionada.
- **Herramientas**: simulador de interés compuesto, presupuesto 50/30/20, fondo de emergencia y la trampa del pago mínimo.
- Mascota **Chanchi** 🐷, sonidos, confeti, modo oscuro, responsive (móvil y escritorio). Progreso guardado en `localStorage`.
- **Modo demo** (Perfil → Ajustes) para desbloquear todas las lecciones al mostrarla.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

Stack: Vite + React + TypeScript. El único backend es Supabase para la liga (opcional). Deploy automático a GitHub Pages
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

Siguiente paso natural: **login para guardar el progreso**. Con Supabase Auth, la sesión anónima se vincula a un
email o cuenta de Google (`supabase.auth.updateUser` / `linkIdentity`) y el jugador conserva su mismo `id`, su fila
en `players` y su lugar en la liga. Falta solo guardar el estado completo de `src/state/store.ts` en una columna
`progress` y restaurarlo al iniciar sesión en otro dispositivo.

> Lo que se publica es el nombre elegido en el onboarding y el XP; cualquiera que abra la liga lo ve. Al ser
> un prototipo sin validación en servidor, un jugador con conocimientos técnicos podría inflar su XP.

## Transcripts → lecciones

`scripts/generate-from-transcripts.ts` lee `transcripts/index.json` + `transcripts/*.txt` y usa la API de Claude para generar
resumen, ideas clave y un quiz por episodio en `src/data/generated/`. `transcripts/` está en `.gitignore` (contenido privado).

```bash
ANTHROPIC_API_KEY=... node scripts/generate-from-transcripts.ts   # incremental; --only 70,92 --force
```

## Contenido

- `src/data/units/*.ts`: lecciones por unidad (tipos en `src/data/types.ts`, guía de estilo en `research/CONTENT_BRIEF.md`).
- `src/data/episodes.json`: catálogo de episodios (hoy armado desde fuentes públicas; se reemplazará con los transcripts).

> Prototipo educativo. No constituye asesoría financiera.
