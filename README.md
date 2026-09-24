# 🐷 Animalingo

**Duolingo × Animales Financieros**: un prototipo de app para aprender finanzas personales jugando,
basado en el contenido del podcast chileno [Animales Financieros](https://www.animalesfinancieros.com/).

## Qué incluye

- **Camino de aprendizaje** con 9 unidades, cada una guiada por un animal (🐜 ahorro, 🐝 presupuesto, 🐿️ fondo de emergencia,
  🦊 deudas, 🐢 interés compuesto, 🐂 inversión, 🦉 psicología del dinero, 🐘 jubilación, 🦅 ingresos) y 27 lecciones.
- **7 tipos de ejercicio**: tarjetas de concepto, alternativas, verdadero/falso, completar la frase, unir parejas,
  ordenar pasos y estimar números con un slider.
- **Gamificación**: XP, racha diaria, vidas ❤️, "Lucas" 🪙 como moneda, cofres, misiones diarias, liga semanal,
  logros, tienda (recargar vidas, protector de racha) y práctica de errores.
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

Stack: Vite + React + TypeScript, sin backend. Deploy automático a GitHub Pages (rama `gh-pages`) con `.github/workflows/deploy.yml`.

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
