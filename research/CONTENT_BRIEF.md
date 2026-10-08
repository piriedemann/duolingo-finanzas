# Brief de contenido — "Duolingo de finanzas" × Animales Financieros

App tipo Duolingo para aprender finanzas personales, inspirada en el podcast chileno
**Animales Financieros**. Público: jóvenes adultos en Chile (20-40 años). Tono: cercano,
chileno neutro (tuteo, algo de humor, sin garabatos), claro, cero jerga sin explicar.
Contexto local cuando aplique: pesos chilenos (CLP, montos realistas, ej. sueldo $900.000),
UF, AFP y multifondos A–E, APV, CAE, tarjetas de crédito de retail, fondos mutuos, depósitos a plazo,
Cuenta RUT / CuentaRUT, crédito hipotecario, ETFs/fondos indexados, etc.

Cada unidad tiene un animal guía. Cada lección = 8 a 11 ejercicios, mezclando tipos:
- Empieza con 1-2 `concept` (explicación breve, 2-4 frases, puede usar **negritas**).
- Luego alterna `mc`, `tf`, `fill`, `match`. Intercala otro `concept` a la mitad si enseña algo nuevo.
- Cada lección debe tener al menos 1 `match`. No hay ejercicios de calcular/estimar números: nadie calcula desde el teléfono. Si un cálculo importa, conviértelo en `mc` con el resultado entre las opciones.
- No existe el tipo "ordena los pasos": en pruebas con usuarios confundía y el orden "correcto" solía ser debatible. Si importa una secuencia, pregunta por el primer paso o por el porqué de un paso en un `mc`.
- **Cada pregunta se entiende sola.** El repaso muestra las preguntas sin la tarjeta `concept` que las precede, así que nunca escribas "en el ejemplo", "como vimos", "según la tarjeta anterior" ni dependas de un personaje o cifra que solo aparece en el `concept`. Si la pregunta necesita datos, van en el enunciado.
- Prefiere preguntas **conceptuales** (qué significa, por qué, qué conviene y por qué) antes que preguntas sobre el detalle de una anécdota o de un ejemplo numérico. Un escenario corto con un personaje está bien si trae su propio contexto.
- `mc`: 3-4 opciones, distractores plausibles. Para escenarios ("Tu amiga Cata recibe un bono...") usa `feedback` por opción.
- `explain`: 1-2 frases que enseñen el POR QUÉ (no repitas la respuesta).
- Números dentro de un `mc` o `tf`: calcula bien y revisa el resultado.
- NO inventes citas textuales de personas reales ni atribuyas frases a los conductores/invitados.
  Sí puedes decir "En el episodio X se habla de..." solo si viene en episodeRefs verificados — por ahora deja `episodeRefs` vacío u omítelo.
- Contenido correcto y responsable: no es asesoría financiera; conceptos generales bien explicados.

Formato: archivo TypeScript que exporta `export const unit: Unit = {...}` importando el tipo
`import type { Unit } from '../types'`. Ver tipos en `src/data/types.ts`.
IDs de lección: `<unitId>-1`, `<unitId>-2`, ...
