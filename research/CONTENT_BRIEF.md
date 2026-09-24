# Brief de contenido — "Duolingo de finanzas" × Animales Financieros

App tipo Duolingo para aprender finanzas personales, inspirada en el podcast chileno
**Animales Financieros**. Público: jóvenes adultos en Chile (20-40 años). Tono: cercano,
chileno neutro (tuteo, algo de humor, sin garabatos), claro, cero jerga sin explicar.
Contexto local cuando aplique: pesos chilenos (CLP, montos realistas, ej. sueldo $900.000),
UF, AFP y multifondos A–E, APV, CAE, tarjetas de crédito de retail, fondos mutuos, depósitos a plazo,
Cuenta RUT / CuentaRUT, crédito hipotecario, ETFs/fondos indexados, etc.

Cada unidad tiene un animal guía. Cada lección = 8 a 11 ejercicios, mezclando tipos:
- Empieza con 1-2 `concept` (explicación breve, 2-4 frases, puede usar **negritas**).
- Luego alterna `mc`, `tf`, `fill`, `match`, `order`, `number`. Intercala otro `concept` a la mitad si enseña algo nuevo.
- Cada lección debe tener al menos 1 `match` o `order`, y las lecciones con números deben tener un `number`.
- `mc`: 3-4 opciones, distractores plausibles. Para escenarios ("Tu amiga Cata recibe un bono...") usa `feedback` por opción.
- `explain`: 1-2 frases que enseñen el POR QUÉ (no repitas la respuesta).
- Números: calcula bien. `tolerance` razonable (ej. 5-10% del valor).
- `number.unit`: '$', '%', 'años', 'meses', 'veces'. Montos grandes en pesos: usa step acorde.
- NO inventes citas textuales de personas reales ni atribuyas frases a los conductores/invitados.
  Sí puedes decir "En el episodio X se habla de..." solo si viene en episodeRefs verificados — por ahora deja `episodeRefs` vacío u omítelo.
- Contenido correcto y responsable: no es asesoría financiera; conceptos generales bien explicados.

Formato: archivo TypeScript que exporta `export const unit: Unit = {...}` importando el tipo
`import type { Unit } from '../types'`. Ver tipos en `src/data/types.ts`.
IDs de lección: `<unitId>-1`, `<unitId>-2`, ...
