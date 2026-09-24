import type { Exercise } from './types'

/**
 * Mini-quiz por episodio (5-6 ejercicios). Basado solo en el resumen y los
 * aprendizajes de episodes.json + conocimiento financiero general.
 * Las claves son los `id` de EPISODES (número o slug del título).
 */
export const EPISODE_QUIZZES: Record<string, Exercise[]> = {
  'el-hombre-de-las-cavernas-tambien-invierte': [
    {
      type: 'concept',
      title: 'Cerebro de cavernícola, mundo moderno',
      emoji: '🦴',
      body: 'Vivimos rodeados de tarjetas, apps y mercados, pero con el **mismo cerebro de hace 200.000 años**. Por eso el éxito financiero depende poco de la inteligencia y mucho del **comportamiento**: empezar temprano, ser disciplinado y dejar que el tiempo trabaje.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que el éxito financiero depende sobre todo de ser muy inteligente.',
      answer: false,
      explain: 'La idea central es la contraria: pesa mucho más el comportamiento (hábitos, disciplina, no dejarse llevar por impulsos) que el coeficiente intelectual.',
    },
    {
      type: 'mc',
      prompt: '¿Por qué el tiempo es el mejor aliado del interés compuesto?',
      options: [
        'Porque las ganancias generan nuevas ganancias, y eso crece más mientras más años pasan',
        'Porque los bancos pagan más a clientes antiguos',
        'Porque la inflación desaparece en el largo plazo',
        'Porque con los años el riesgo se vuelve cero',
      ],
      answer: 0,
      explain: 'El interés compuesto es exponencial: cada año se gana sobre lo ganado antes. Mientras más tiempo, más fuerte el efecto; por eso conviene empezar temprano.',
    },
    {
      type: 'fill',
      sentence: 'En vez de intentar ganarle al mercado, conviene ___ y pagar comisiones bajas.',
      options: ['diversificar', 'concentrar todo en una acción', 'comprar y vender a diario'],
      answer: 0,
      explain: 'Diversificar reparte el riesgo entre muchas inversiones, y las comisiones bajas evitan que los costos se coman tu rentabilidad año tras año.',
    },
    {
      type: 'match',
      prompt: 'Une cada principio con su porqué',
      pairs: [
        ['Empezar temprano', 'Más años de interés compuesto'],
        ['Diversificar', 'No depender de una sola apuesta'],
        ['Comisiones bajas', 'Más rentabilidad queda para ti'],
        ['Aceptar la volatilidad', 'Evita vender asustado en las caídas'],
      ],
    },
  ],

  '2': [
    {
      type: 'concept',
      title: 'Llegó fin de mes: hora de ordenar',
      emoji: '📅',
      body: 'El fin de mes es un buen momento para **revisar tus finanzas** y decidir qué hacer con lo que sobra. Si tienes deudas caras o no tienes colchón, la clave es seguir **un orden claro**: primero lo urgente, después lo que te hace crecer.',
    },
    {
      type: 'order',
      prompt: 'Ordena qué hacer con la plata que sobra (de lo primero a lo último)',
      items: [
        'Revisar en qué se fue la plata del mes',
        'Pagar las deudas caras',
        'Armar el fondo de emergencia',
        'Invertir para el largo plazo',
      ],
      explain: 'Ordenar primero te muestra la foto real. Luego las deudas caras (que cobran más de lo que cualquier inversión rinde) y un colchón que te evite endeudarte de nuevo; recién ahí invertir tiene sentido.',
    },
    {
      type: 'mc',
      prompt: '¿Cómo se suele calcular un fondo de emergencia?',
      options: [
        'Como un múltiplo de tus gastos mensuales (ej. 3 a 6 meses)',
        'Como un porcentaje fijo de tu sueldo bruto anual',
        'Lo que te sobre después de las vacaciones',
        'El mismo monto para todas las personas',
      ],
      answer: 0,
      explain: 'Lo que el fondo debe cubrir son tus gastos si dejas de tener ingresos; por eso se mide en meses de gastos, no en porcentaje del sueldo.',
    },
    {
      type: 'tf',
      statement: 'Si tienes una deuda de tarjeta con interés alto, suele convenir pagarla antes de ponerte a invertir.',
      answer: true,
      explain: 'Pagar una deuda que te cobra, por ejemplo, 30% al año equivale a "ganar" ese 30% sin riesgo, algo que es muy difícil de conseguir invirtiendo.',
    },
    {
      type: 'fill',
      sentence: 'El fin de mes es un buen momento para ___ tus finanzas.',
      options: ['revisar y ordenar', 'olvidar', 'gastar todo lo que queda de'],
      answer: 0,
      explain: 'Una revisión periódica te permite corregir a tiempo y convertir la plata que sobra en progreso, en vez de que desaparezca en gastos sin rumbo.',
    },
  ],

  'los-yos-y-como-te-podrian-ayudar-a-ti': [
    {
      type: 'concept',
      title: 'Tus cinco "yos"',
      emoji: '🧑‍🤝‍🧑',
      body: 'En este episodio se propone dividir la plata entre cinco "yos" internos: **Gastón** (gastos básicos), **Agustín** (darse gustos), **Alicia** (vacaciones), **Ángeles** (protección ante imprevistos) y **Sofía** (el futuro). Darle un propósito a cada peso ayuda a que ninguno se coma a los demás.',
    },
    {
      type: 'match',
      prompt: 'Une cada "yo" con su propósito',
      pairs: [
        ['Gastón', 'Gastos básicos'],
        ['Agustín', 'Darse gustos'],
        ['Alicia', 'Vacaciones'],
        ['Ángeles', 'Protección ante imprevistos'],
        ['Sofía', 'El futuro'],
      ],
    },
    {
      type: 'mc',
      prompt: 'Se te rompe el celular y necesitas reemplazarlo sí o sí. ¿De qué "yo" debería salir esa plata?',
      options: ['Ángeles', 'Alicia', 'Sofía', 'Agustín'],
      answer: 0,
      explain: 'Ángeles cuida los imprevistos. Tener ese bolsillo separado evita que una emergencia te obligue a usar el ahorro de largo plazo o a endeudarte.',
    },
    {
      type: 'tf',
      statement: 'Separar el dinero por propósitos es útil porque el comportamiento pesa más que la inteligencia en las finanzas.',
      answer: true,
      explain: 'Poner la plata en "cajones" con nombre es un truco de comportamiento: cuesta más gastar lo que ya tiene destino, aunque sepas perfectamente sumar y restar.',
    },
    {
      type: 'fill',
      sentence: 'Sofía representa a tu yo ___.',
      options: ['futuro', 'de fin de semana', 'de vacaciones'],
      answer: 0,
      explain: 'Pensar en tu yo futuro como una persona real hace más fácil ahorrar e invertir hoy para ella, por ejemplo para la jubilación.',
    },
  ],

  'invierte-para-ser-libre-libre-libre-como-el-viento': [
    {
      type: 'concept',
      title: 'Invertir para ser libre',
      emoji: '🕊️',
      body: 'Invertir no es solo "hacer crecer la plata": es un camino hacia la **libertad financiera**. La receta básica: **empezar temprano**, ser disciplinado, diversificar con **comisiones bajas** y, después de asignar lo de cada "yo", invertir el resto para tu **yo futuro**.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál de estas es una práctica básica de inversión que se recomienda en el episodio?',
      options: [
        'Diversificar y pagar comisiones bajas',
        'Buscar la acción que se va a multiplicar por 10',
        'Entrar y salir del mercado según las noticias',
        'Esperar a tener mucha plata para empezar',
      ],
      answer: 0,
      explain: 'Diversificar reduce el riesgo de que una mala inversión te hunda, y las comisiones bajas son una de las pocas cosas que sí controlas.',
    },
    {
      type: 'tf',
      statement: 'Intentar ganarle al mercado de forma constante es fácil si lees muchas noticias.',
      answer: false,
      explain: 'La mayoría de los profesionales no logra ganarle al mercado de forma sostenida. Ser disciplinado con una estrategia simple suele dar mejores resultados.',
    },
    {
      type: 'order',
      prompt: 'Ordena el flujo que se propone para tu plata',
      items: [
        'Recibes tu ingreso',
        'Asignas el gasto a tus distintos "yos"',
        'Inviertes el resto para tu yo futuro',
        'Dejas que el interés compuesto trabaje con los años',
      ],
      explain: 'Primero se cubren los propósitos del presente; lo que queda va a tu yo futuro, y el tiempo hace el trabajo pesado.',
    },
    {
      type: 'fill',
      sentence: 'Mientras antes empiezas a invertir, más tiempo tiene el ___ para trabajar a tu favor.',
      options: ['interés compuesto', 'pago mínimo', 'IVA'],
      answer: 0,
      explain: 'El interés compuesto crece de forma exponencial, así que los primeros años de ventaja pesan muchísimo al final.',
    },
  ],

  'aprendiendo-a-invertir': [
    {
      type: 'concept',
      title: 'Primero orden, después inversión',
      emoji: '📚',
      body: 'Antes de preguntarte en qué invertir, conviene tener la casa en orden (presupuesto, deudas, colchón). Recién ahí toca **entender los instrumentos** disponibles y construir un **hábito de inversión**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que primero hay que ordenar tus finanzas y después invertir.',
      answer: true,
      explain: 'Invertir con deudas caras o sin colchón es frágil: cualquier imprevisto te obliga a vender en mal momento o a endeudarte.',
    },
    {
      type: 'match',
      prompt: 'Une cada instrumento con su descripción',
      pairs: [
        ['Depósito a plazo', 'Prestas al banco por un plazo fijo a una tasa conocida'],
        ['Acción', 'Eres dueño de un pedacito de una empresa'],
        ['Bono', 'Le prestas a una empresa o gobierno a cambio de intereses'],
        ['Fondo mutuo', 'Juntas tu plata con otros y la administra un gestor'],
      ],
    },
    {
      type: 'mc',
      prompt: '¿Qué es lo más importante para construir un hábito de inversión?',
      options: [
        'Invertir de forma periódica, idealmente automática',
        'Invertir solo cuando el mercado "está barato"',
        'Revisar la inversión todos los días',
        'Cambiar de fondo cada mes',
      ],
      answer: 0,
      explain: 'Automatizar quita la decisión del día a día y evita que las emociones o la flojera interrumpan el hábito.',
    },
    {
      type: 'fill',
      sentence: 'Antes de invertir en algo, es clave ___ cómo funciona.',
      options: ['entender', 'ignorar', 'adivinar'],
      answer: 0,
      explain: 'Si no entiendes un instrumento, no sabrás qué riesgos corres ni cómo reaccionar cuando baje.',
    },
  ],

  'el-interes-compuesto-va-a-cambiar-tu-vida-conocelo': [
    {
      type: 'concept',
      title: 'Intereses que generan intereses',
      emoji: '❄️',
      body: 'El **interés compuesto** hace que los intereses generen nuevos intereses, como una bola de nieve. Su crecimiento es **exponencial**: al principio parece que no pasa nada y después se acelera. El ingrediente clave es el **tiempo**.',
    },
    {
      type: 'mc',
      prompt: 'Inviertes $1.000.000 al 10% anual y reinviertes todo. ¿Cuánto tienes después de 2 años?',
      options: ['$1.210.000', '$1.200.000', '$1.100.000', '$1.020.000'],
      answer: 0,
      explain: 'El primer año ganas $100.000; el segundo ganas 10% sobre $1.100.000, o sea $110.000. Ese extra de $10.000 es el interés sobre el interés.',
    },
    {
      type: 'tf',
      statement: 'Con el interés compuesto, los primeros años suelen parecer lentos.',
      answer: true,
      explain: 'En una curva exponencial la mayor parte del crecimiento llega al final. Por eso mucha gente se desanima temprano y abandona justo antes de lo bueno.',
    },
    {
      type: 'fill',
      sentence: 'El ingrediente clave del interés compuesto es el ___.',
      options: ['tiempo', 'azar', 'sueldo alto'],
      answer: 0,
      explain: 'Una tasa modesta sostenida muchos años puede superar a una tasa alta por pocos años: el tiempo multiplica.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su definición',
      pairs: [
        ['Interés simple', 'Solo se gana sobre el capital inicial'],
        ['Interés compuesto', 'Se gana sobre el capital y los intereses acumulados'],
        ['Crecimiento exponencial', 'Lento al inicio, muy rápido después'],
      ],
    },
  ],

  'ser-constante-le-gana-a-ser-mejor': [
    {
      type: 'concept',
      title: 'La constancia le gana al talento',
      emoji: '🐢',
      body: 'Aunque seas el mejor inversionista del mundo, si tienes un mal año y **no lo aguantas**, puedes perder todo lo ganado. La clave es **sobrevivir a los malos años**, evitar decisiones que te saquen del juego y darle tiempo al interés compuesto.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la constancia vale más que la excelencia ocasional.',
      answer: true,
      explain: 'Un rendimiento decente mantenido por décadas suele ganarle a uno espectacular que se interrumpe por un error grave.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál de estas decisiones te puede "sacar del juego"?',
      options: [
        'Invertir con plata prestada una apuesta muy arriesgada',
        'Invertir un monto fijo todos los meses',
        'Tener un fondo de emergencia',
        'Diversificar en muchas empresas',
      ],
      answer: 0,
      explain: 'Endeudarse para apostar puede dejarte sin nada (y debiendo) si sale mal. Las otras opciones justamente te ayudan a seguir en carrera.',
    },
    {
      type: 'mc',
      prompt: 'Si una inversión cae 50%, ¿cuánto tiene que subir después para volver al punto de partida?',
      options: ['100%', '50%', '75%', '25%'],
      answer: 0,
      explain: 'Si $100 caen a $50, necesitas duplicar esos $50 para volver a $100. Las pérdidas grandes cuestan mucho más de recuperar: por eso sobrevivir importa tanto.',
    },
    {
      type: 'fill',
      sentence: 'Para que el interés compuesto funcione, hay que darle ___.',
      options: ['tiempo', 'noticias', 'suerte'],
      answer: 0,
      explain: 'El compuesto necesita años sin interrupciones; cada vez que sales del mercado "reinicias" el reloj.',
    },
    {
      type: 'match',
      prompt: 'Une cada hábito con su efecto',
      pairs: [
        ['Aguantar un mal año sin vender', 'Sigues en el juego para la recuperación'],
        ['Invertir todos los meses', 'El compuesto trabaja sin pausas'],
        ['Apostar todo con deuda', 'Un mal año te puede sacar del juego'],
      ],
    },
  ],

  'invertir-en-las-mejores-empresas-del-mundo': [
    {
      type: 'concept',
      title: 'Las mejores empresas, en un solo paquete',
      emoji: '🌍',
      body: 'Hay varias formas de invertir en las grandes empresas del mundo: comprar acciones sueltas o usar **fondos** (fondos mutuos, ETFs, fondos indexados). Los fondos permiten **diversificar** y **automatizar** con poco tiempo, reduciendo el riesgo de depender de una sola empresa.',
    },
    {
      type: 'mc',
      prompt: '¿Qué ventaja tiene invertir mediante un fondo diversificado versus comprar una sola acción?',
      options: [
        'Si a una empresa le va mal, no arrastra toda tu inversión',
        'Garantiza que nunca vas a perder plata',
        'Siempre rinde más que cualquier acción individual',
        'No cobra ninguna comisión',
      ],
      answer: 0,
      explain: 'La diversificación reparte el riesgo. No elimina las caídas del mercado, pero sí el riesgo de que un solo fracaso te hunda.',
    },
    {
      type: 'tf',
      statement: 'Un fondo que invierte en cientos de empresas globales requiere que revises cada empresa todos los días.',
      answer: false,
      explain: 'Justamente una de las ventajas de los fondos es que alguien más administra la canasta; tú puedes automatizar aportes y dedicarle poco tiempo.',
    },
    {
      type: 'match',
      prompt: 'Une cada forma de invertir con su característica',
      pairs: [
        ['Acción individual', 'Todo depende de una empresa'],
        ['ETF / fondo indexado', 'Copia un índice con costos bajos'],
        ['Fondo mutuo', 'Un gestor administra una cartera por ti'],
      ],
    },
    {
      type: 'fill',
      sentence: 'La ___ reduce el riesgo de que una sola mala inversión te afecte demasiado.',
      options: ['diversificación', 'concentración', 'especulación'],
      answer: 0,
      explain: 'Al repartir entre muchas empresas, sectores y países, los malos resultados de algunas se compensan con los buenos de otras.',
    },
  ],

  'invertir-en-la-digitalizacion-del-mundo-el-metaver': [
    {
      type: 'concept',
      title: 'Invertir en una tendencia',
      emoji: '💾',
      body: 'La digitalización cambió cómo vivimos. En vez de adivinar qué empresa ganará, una alternativa es invertir en **la tendencia completa** mediante un **fondo temático**; en este episodio se conversa sobre uno enfocado en **semiconductores**, los chips que sostienen la IA y lo digital.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea invertir en tendencias en vez de apostar por ganadores individuales.',
      answer: true,
      explain: 'Es difícil saber qué empresa específica ganará, pero es más fácil identificar una tendencia de fondo y tener exposición a varias empresas dentro de ella.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es un fondo temático?',
      options: [
        'Un fondo que invierte en empresas ligadas a una misma tendencia o sector',
        'Un fondo que invierte en todo el mercado mundial por igual',
        'Un depósito a plazo con tasa fija',
        'Un seguro de vida con ahorro',
      ],
      answer: 0,
      explain: 'Se concentra en un tema (por ejemplo, semiconductores). Diversifica dentro del tema, pero sigue siendo más concentrado que un fondo de todo el mercado.',
    },
    {
      type: 'fill',
      sentence: 'Los ___ son los chips que sostienen la IA y la digitalización.',
      options: ['semiconductores', 'bonos', 'commodities agrícolas'],
      answer: 0,
      explain: 'Todo dispositivo digital y cada modelo de IA necesita chips; por eso ese sector se ve como una pieza central de la tendencia.',
    },
    {
      type: 'match',
      prompt: 'Une cada estrategia con su nivel de concentración',
      pairs: [
        ['Una sola acción tecnológica', 'Muy concentrada'],
        ['Fondo temático de semiconductores', 'Diversificada dentro de un tema'],
        ['Fondo indexado global', 'Muy diversificada'],
      ],
    },
  ],

  'fintual-focus-racional-clever-y-dva': [
    {
      type: 'concept',
      title: 'Elegir tu plataforma de inversión',
      emoji: '📱',
      body: 'En Chile hay varias fintech para invertir en fondos. En este episodio se comparan: en qué se parecen, en qué se diferencian y cómo elegir. Claves: **comisiones**, cómo **miden la rentabilidad** y que se ajusten a **tus necesidades**, no a la moda.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es uno de los criterios más importantes al comparar plataformas de inversión?',
      options: ['Las comisiones que cobran', 'Cuál tiene la app más bonita', 'Cuál usan más tus amigos', 'Cuál tiene más publicidad'],
      answer: 0,
      explain: 'Las comisiones se cobran todos los años sobre tu plata; una diferencia de 1% anual, compuesta por décadas, es enorme.',
    },
    {
      type: 'tf',
      statement: 'Los robo-advisors suelen bajar costos y automatizar la inversión.',
      answer: true,
      explain: 'Usan reglas y tecnología para armar y rebalancear carteras sin un asesor humano por cliente, lo que abarata el servicio.',
    },
    {
      type: 'fill',
      sentence: 'Al comparar rentabilidades, revisa cómo cada plataforma la ___.',
      options: ['mide', 'esconde', 'garantiza'],
      answer: 0,
      explain: 'Rentabilidades medidas en distintos plazos, antes o después de comisiones, o en distintas monedas no son comparables directamente.',
    },
    {
      type: 'order',
      prompt: 'Ordena un proceso razonable para elegir plataforma',
      items: [
        'Definir tu objetivo y plazo',
        'Revisar qué fondos y riesgos ofrece cada una',
        'Comparar comisiones y cómo miden la rentabilidad',
        'Elegir y automatizar tus aportes',
      ],
      explain: 'Partir por tus necesidades evita elegir por moda; luego comparas lo que ofrecen y lo que cuesta.',
    },
  ],

  '11': [
    {
      type: 'concept',
      title: 'Ahorrar por ahorrar',
      emoji: '🐜',
      body: 'Muchas personas subestiman la **incertidumbre del futuro** y se ponen metas poco realistas. En este episodio se plantea que la mejor forma de ahorrar e invertir es que sea **parte de tu vida**: hacerlo por hacerlo, no solo para cosas predefinidas.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que el ahorro debería ser un hábito y no solo un medio para una meta.',
      answer: true,
      explain: 'Si solo ahorras para metas puntuales, al cumplirlas (o fallarlas) el hábito se corta. Como estilo de vida, sigue funcionando pase lo que pase.',
    },
    {
      type: 'mc',
      prompt: '¿Qué ventaja tiene ahorrar sin un fin específico?',
      options: [
        'Te da flexibilidad para enfrentar lo que el futuro traiga',
        'Te asegura una rentabilidad más alta',
        'Evita pagar impuestos',
        'Hace innecesario tener un presupuesto',
      ],
      answer: 0,
      explain: 'El futuro es incierto: una plata sin etiqueta rígida puede servir para una oportunidad, una emergencia o un cambio de planes.',
    },
    {
      type: 'fill',
      sentence: 'Una forma de que el ahorro sea estilo de vida es ___ el ahorro y la inversión.',
      options: ['automatizar', 'postergar', 'improvisar'],
      answer: 0,
      explain: 'Una transferencia automática el día de pago hace que ahorrar no dependa de tu fuerza de voluntad cada mes.',
    },
    {
      type: 'match',
      prompt: 'Une cada enfoque con su riesgo o ventaja',
      pairs: [
        ['Metas muy rígidas', 'Pueden fallar si el futuro cambia'],
        ['Ahorro automático', 'No depende de la fuerza de voluntad'],
        ['Ahorrar como hábito', 'Sigue funcionando después de cada meta'],
      ],
    },
  ],

  'buscando-departamentos-con-francisco-ackermann': [
    {
      type: 'concept',
      title: 'Invertir en departamentos',
      emoji: '🏢',
      body: 'Episodio bonus sobre **inversión inmobiliaria**: cómo empezar a invertir en departamentos, cómo afectan las **contingencias** (el contexto económico) y qué detalles revisar antes de comprar para arrendar.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que conviene evaluar el contexto y las contingencias antes de invertir en un departamento.',
      answer: true,
      explain: 'Tasas de interés, precios y demanda de arriendo cambian con el contexto, y afectan tanto el dividendo como la rentabilidad.',
    },
    {
      type: 'mc',
      prompt: 'Si compras un departamento con crédito hipotecario para arrendarlo, ¿qué conviene comparar primero?',
      options: [
        'El arriendo esperado versus el dividendo y los gastos',
        'Solo el color de las terminaciones',
        'Solo el precio de lista del departamento',
        'Cuántos pisos tiene el edificio',
      ],
      answer: 0,
      explain: 'Si el arriendo no cubre dividendo, contribuciones, gastos comunes vacíos y mantenciones, tendrás que poner plata de tu bolsillo cada mes.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto inmobiliario con su significado',
      pairs: [
        ['Dividendo', 'Cuota mensual del crédito hipotecario'],
        ['Pie', 'Parte del precio que pagas al contado'],
        ['Vacancia', 'Meses en que el depto está sin arrendatario'],
        ['Contribuciones', 'Impuesto territorial a la propiedad'],
      ],
    },
    {
      type: 'fill',
      sentence: 'Un departamento para invertir tiene menos ___ que un fondo: no puedes vender un pedazo en un día.',
      options: ['liquidez', 'rentabilidad posible', 'historia'],
      answer: 0,
      explain: 'Vender una propiedad toma semanas o meses y tiene costos altos; por eso no debería ser tu fondo de emergencia.',
    },
  ],

  'tips-para-el-emprendedor-que-no-sale-en-la-tele': [
    {
      type: 'concept',
      title: 'El emprendedor real',
      emoji: '🧰',
      body: 'No todos quieren crear un unicornio. Este episodio va para el **emprendedor real**: quien quiere un negocio para **vivir de él** sin trabajar para un tercero. Clave: **ordenar las finanzas del negocio** y tener buenos hábitos financieros.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que emprender para vivir de tu negocio es distinto a buscar un unicornio.',
      answer: true,
      explain: 'Un negocio de vida busca ser rentable y sostenible; una startup de alto crecimiento busca escalar rápido con inversionistas, asumiendo mucho más riesgo.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es un buen hábito financiero básico para un emprendedor?',
      options: [
        'Separar las cuentas del negocio de las personales',
        'Pagar todo con la tarjeta personal y ver después',
        'No llevar registro de gastos pequeños',
        'Sacar plata del negocio cada vez que falte en la casa',
      ],
      answer: 0,
      explain: 'Si mezclas las cuentas no sabes si el negocio realmente gana plata, y se hace muy difícil ordenar impuestos y flujo de caja.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su significado',
      pairs: [
        ['Ingresos', 'Lo que entra por ventas'],
        ['Utilidad', 'Lo que queda después de costos y gastos'],
        ['Flujo de caja', 'Cuándo entra y sale efectivamente la plata'],
        ['Sueldo del dueño', 'Lo que te pagas a ti de forma fija'],
      ],
    },
    {
      type: 'fill',
      sentence: 'Un negocio puede tener utilidades y aun así quedarse sin plata si descuida su ___.',
      options: ['flujo de caja', 'logo', 'página web'],
      answer: 0,
      explain: 'Si los clientes pagan a 60 días pero tus proveedores cobran a 30, puedes ser rentable en papel y no tener caja para pagar.',
    },
  ],

  '40': [
    {
      type: 'concept',
      title: 'Venture capital: pocos grandes ganadores',
      emoji: '🦄',
      body: 'El **venture capital** invierte en startups con alto riesgo y alto potencial. En este episodio se explica que, en un portafolio de unas 25 inversiones, **2 o 3 entregan todo el retorno**. Por eso se piensa en **portafolio** y en el **largo plazo**.',
    },
    {
      type: 'mc',
      prompt: 'Según lo planteado, en un portafolio de ~25 inversiones de venture capital, ¿cuántas suelen entregar todo el retorno?',
      options: ['2 o 3', 'Casi todas', 'La mitad', 'Ninguna'],
      answer: 0,
      explain: 'Muchas startups fracasan o apenas devuelven lo invertido; unas pocas que crecen muchísimo compensan todo lo demás.',
    },
    {
      type: 'tf',
      statement: 'En venture capital conviene pensar en cada inversión por separado en vez de en el portafolio completo.',
      answer: false,
      explain: 'Como la mayoría falla, lo que importa es el resultado del conjunto: con suficientes apuestas, los pocos grandes ganadores pagan las pérdidas.',
    },
    {
      type: 'fill',
      sentence: 'El venture capital es un activo de ___ plazo.',
      options: ['largo', 'muy corto', 'un mes de'],
      answer: 0,
      explain: 'Las startups tardan años en crecer, y la plata suele quedar comprometida hasta una venta o salida a bolsa.',
    },
    {
      type: 'match',
      prompt: 'Une cada tipo de inversión con su perfil',
      pairs: [
        ['Venture capital', 'Alto riesgo, alto potencial, poca liquidez'],
        ['Depósito a plazo', 'Bajo riesgo y retorno conocido'],
        ['Fondo indexado de acciones', 'Riesgo medio-alto, muy diversificado y líquido'],
      ],
    },
  ],

  '43': [
    {
      type: 'concept',
      title: 'Educación financiera de verdad',
      emoji: '🎓',
      body: 'La educación financiera **práctica** importa más que la teoría. En este episodio se conversa sobre cómo **equivocarse temprano con montos pequeños** enseña, y sobre la **planificación financiera** como base.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que equivocarse temprano con montos pequeños puede ser una buena forma de aprender.',
      answer: true,
      explain: 'Un error con poca plata y mucha vida por delante es una lección barata; el mismo error con tus ahorros de 20 años sale carísimo.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es un ejemplo de educación financiera práctica?',
      options: [
        'Invertir un monto chico que puedas perder y seguir cómo se comporta',
        'Memorizar definiciones sin aplicarlas nunca',
        'Esperar a saberlo todo antes de hacer algo',
        'Copiar las inversiones de un influencer sin entenderlas',
      ],
      answer: 0,
      explain: 'Experimentar con poco te enseña cosas que la teoría no transmite, como qué sientes cuando tu inversión cae.',
    },
    {
      type: 'order',
      prompt: 'Ordena una forma sensata de aprender a invertir',
      items: [
        'Ordenar tu presupuesto y tener un colchón',
        'Aprender lo básico de los instrumentos',
        'Probar con un monto pequeño',
        'Revisar qué aprendiste y ajustar tu plan',
      ],
      explain: 'La planificación es la base: con las finanzas en orden, una pérdida pequeña de aprendizaje no pone en riesgo tu estabilidad.',
    },
    {
      type: 'fill',
      sentence: 'La ___ financiera es la base sobre la que se construyen las inversiones.',
      options: ['planificación', 'improvisación', 'especulación'],
      answer: 0,
      explain: 'Saber tus ingresos, gastos, deudas y metas te dice cuánto y con qué horizonte puedes invertir.',
    },
  ],

  '46': [
    {
      type: 'concept',
      title: 'Buscar valor en las empresas',
      emoji: '🔎',
      body: 'El **value investing** busca empresas que valen más de lo que dice su precio. Para eso hay que **entender el modelo de negocio**, leer la información financiera y fijarse en el **flujo de caja**: cuánta plata genera la empresa de verdad.',
    },
    {
      type: 'mc',
      prompt: '¿Por qué el flujo de caja es clave para valorar una empresa?',
      options: [
        'Muestra cuánta plata genera realmente el negocio',
        'Es lo mismo que el precio de la acción',
        'Indica cuántos seguidores tiene la empresa',
        'Solo importa para empresas que no cotizan',
      ],
      answer: 0,
      explain: 'Una empresa vale, en el fondo, por la caja que puede generar en el futuro. Las utilidades contables pueden no reflejarla del todo.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se aconseja no darle demasiada importancia a las noticias negativas.',
      answer: true,
      explain: 'Las noticias mueven los precios en el corto plazo, pero no necesariamente cambian el valor del negocio en el largo plazo.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su definición',
      pairs: [
        ['Dividendo (de una acción)', 'Parte de las utilidades que se reparte a los accionistas'],
        ['Flujo de caja', 'Plata que efectivamente entra y sale del negocio'],
        ['Modelo de negocio', 'Cómo la empresa gana plata'],
        ['Value investing', 'Comprar bajo lo que crees que vale la empresa'],
      ],
    },
    {
      type: 'fill',
      sentence: 'Antes de comprar una acción, conviene entender el ___ de la empresa.',
      options: ['modelo de negocio', 'color del logo', 'horario de oficina'],
      answer: 0,
      explain: 'Si no sabes cómo gana plata la empresa, no puedes juzgar si su precio es razonable ni si un problema es pasajero o grave.',
    },
  ],

  '70': [
    {
      type: 'concept',
      title: 'Las Reglas del Juego del Dinero',
      emoji: '🎲',
      body: '¿Qué hago con mi próxima luca? Este episodio responde con una **guía paso a paso**: tener un **orden de prioridades**, aprovechar la **"plata gratis"**, pagar **deudas caras** y armar el **fondo de emergencia** antes de invertir, y **preparar el futuro**.',
    },
    {
      type: 'order',
      prompt: 'Ordena estas prioridades según la lógica del episodio',
      items: [
        'Aprovechar la "plata gratis" disponible',
        'Pagar las deudas caras',
        'Armar el fondo de emergencia',
        'Invertir y preparar la jubilación',
      ],
      explain: 'Primero lo que te da retorno inmediato sin riesgo (beneficios gratis y eliminar intereses altos), luego la protección, y recién ahí el crecimiento de largo plazo.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál de estas es un ejemplo de "plata gratis" en Chile?',
      options: [
        'La bonificación estatal del APV régimen A',
        'Un avance en efectivo de la tarjeta',
        'Un crédito de consumo preaprobado',
        'Una cuota "sin interés" que igual cobra comisión',
      ],
      answer: 0,
      explain: 'En el régimen A del APV el Estado agrega un porcentaje de lo que ahorras (con tope). Es rentabilidad que no depende del mercado.',
    },
    {
      type: 'tf',
      statement: 'Según esta guía, conviene invertir antes de pagar una deuda cara.',
      answer: false,
      explain: 'Una deuda cara te cobra más de lo que razonablemente puedes ganar invirtiendo; pagarla es una "inversión" segura con alto retorno.',
    },
    {
      type: 'fill',
      sentence: 'La idea es tener un orden de ___ para cada peso extra.',
      options: ['prioridades', 'caprichos', 'apuestas'],
      answer: 0,
      explain: 'Con un orden claro no tienes que decidir desde cero cada vez, y evitas errores comunes como invertir sin colchón.',
    },
  ],

  '77': [
    {
      type: 'concept',
      title: 'Elegir el futuro',
      emoji: '🧭',
      body: 'Primer episodio del segmento **Mentores**. La idea: en vez de intentar **predecir** el futuro, **elegirlo**, sabiendo que **elegir implica renunciar**. También aparecen ideas de liderazgo como la regla **10-80-10** para delegar.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que elegir siempre implica renunciar a algo.',
      answer: true,
      explain: 'Es el costo de oportunidad: todo sí a una opción es un no a otras. Aceptarlo ayuda a decidir con más claridad.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa "elegir el futuro en vez de predecirlo"?',
      options: [
        'Decidir hacia dónde quieres ir y actuar para llegar, en vez de adivinar qué pasará',
        'Hacer pronósticos muy precisos del mercado',
        'Esperar a que el futuro se aclare antes de actuar',
        'No planificar nada',
      ],
      answer: 0,
      explain: 'Nadie predice bien el futuro, pero sí puedes elegir una dirección y tomar decisiones coherentes con ella.',
    },
    {
      type: 'fill',
      sentence: 'Lo que dejas de ganar por elegir una opción en vez de otra se llama costo de ___.',
      options: ['oportunidad', 'transacción', 'mantención'],
      answer: 0,
      explain: 'Es un concepto clave en finanzas y en la vida: el verdadero costo de algo incluye la mejor alternativa a la que renuncias.',
    },
    {
      type: 'match',
      prompt: 'Une cada idea del episodio con su tema',
      pairs: [
        ['Regla 10-80-10', 'Delegar y empoderar'],
        ['Elegir implica renunciar', 'Tomar decisiones'],
        ['Querer a tu gente', 'Liderazgo'],
      ],
    },
  ],

  '84': [
    {
      type: 'concept',
      title: 'El entrevistador, entrevistado',
      emoji: '🎙️',
      body: 'Fernando Gómez, co-host del segmento Mentores, cuenta su historia. Temas: **aprendizajes de carrera** de un gestor de inversiones, el valor de **aprender de mentores** y trayectorias reales, y la **visión de largo plazo** al invertir.',
    },
    {
      type: 'tf',
      statement: 'Aprender de las trayectorias de otras personas puede ahorrarte errores propios.',
      answer: true,
      explain: 'Los mentores ya pasaron por decisiones que tú vas a enfrentar; escuchar qué les funcionó y qué no acorta tu curva de aprendizaje.',
    },
    {
      type: 'mc',
      prompt: '¿Qué implica una visión de largo plazo al invertir?',
      options: [
        'Tolerar caídas temporales para capturar el crecimiento en años',
        'Vender en cuanto la inversión baja un poco',
        'Cambiar de estrategia cada mes',
        'Invertir solo plata que necesitas la próxima semana',
      ],
      answer: 0,
      explain: 'En plazos largos las caídas del camino se diluyen; en plazos cortos pueden obligarte a vender con pérdida.',
    },
    {
      type: 'fill',
      sentence: 'Un gestor de inversiones administra ___ de otras personas.',
      options: ['el dinero', 'los sueldos', 'las deudas'],
      answer: 0,
      explain: 'Invierte recursos de clientes según una estrategia, normalmente cobrando una comisión por ello.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su significado',
      pairs: [
        ['Mentor', 'Alguien con experiencia que te orienta'],
        ['Gestor de inversiones', 'Profesional que administra carteras'],
        ['Largo plazo', 'Horizonte de muchos años'],
      ],
    },
  ],

  '112': [
    {
      type: 'concept',
      title: 'Las reglas del juego, versión crossover',
      emoji: '🍐',
      body: 'Francisco Verdugo presenta **Las Reglas del Juego del Dinero** en otro podcast. Los pilares: **págate a ti mismo primero**, evita el exceso de gasto, arma un **fondo de emergencia**, paga las **deudas de alto interés** antes de invertir, y **diversifica** y protégete con **seguros**.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa "págate a ti mismo primero"?',
      options: [
        'Apartar el ahorro apenas recibes el sueldo, antes de gastar',
        'Darte un gusto cada vez que recibes plata',
        'Pagar primero tus cuentas y ahorrar lo que sobre',
        'Pedir un aumento de sueldo',
      ],
      answer: 0,
      explain: 'Si ahorras "lo que sobra", casi nunca sobra. Apartarlo primero lo convierte en un gasto fijo más para tu yo futuro.',
    },
    {
      type: 'tf',
      statement: 'Los seguros son parte de una buena estrategia financiera porque te protegen de golpes que no podrías pagar.',
      answer: true,
      explain: 'Un seguro traslada un riesgo grande (enfermedad, accidente) a cambio de un costo pequeño y conocido.',
    },
    {
      type: 'match',
      prompt: 'Une cada regla con lo que evita',
      pairs: [
        ['Págate primero', 'Que el ahorro dependa de lo que sobre'],
        ['Fondo de emergencia', 'Endeudarte ante un imprevisto'],
        ['Pagar deudas caras', 'Que los intereses se coman tu progreso'],
        ['Diversificar', 'Depender de una sola inversión'],
      ],
    },
    {
      type: 'fill',
      sentence: 'Antes de invertir, conviene pagar las deudas de ___ interés.',
      options: ['alto', 'cero', 'bajo'],
      answer: 0,
      explain: 'Es difícil que una inversión rinda más de lo que te cobra una deuda cara, así que eliminarla es la jugada más segura.',
    },
  ],

  '117': [
    {
      type: 'concept',
      title: 'Las ideas de Charlie Munger',
      emoji: '🧠',
      body: 'Repaso de las ideas de Charlie Munger (socio de Warren Buffett) a partir de "Poor Charlie\'s Almanack": usar **modelos mentales** para decidir mejor, **aprender de los errores** propios y ajenos, y tener **paciencia** y pensamiento de largo plazo.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es un modelo mental?',
      options: [
        'Una idea o herramienta de alguna disciplina que te ayuda a entender y decidir',
        'Una fórmula que predice el precio de las acciones',
        'Un tipo de fondo de inversión',
        'Un test de personalidad',
      ],
      answer: 0,
      explain: 'Por ejemplo, el costo de oportunidad o el interés compuesto: tener varios de distintas áreas te permite ver un problema desde más ángulos.',
    },
    {
      type: 'tf',
      statement: 'Aprender de los errores ajenos es una forma barata de aprender.',
      answer: true,
      explain: 'Si otro ya pagó el costo de un error, puedes llevarte la lección sin pagarlo tú.',
    },
    {
      type: 'fill',
      sentence: 'En inversiones, la ___ suele ser más valiosa que la actividad frenética.',
      options: ['paciencia', 'prisa', 'rotación'],
      answer: 0,
      explain: 'Comprar y vender mucho genera costos y errores emocionales; mantener buenas inversiones en el tiempo deja trabajar al compuesto.',
    },
    {
      type: 'match',
      prompt: 'Une cada modelo mental con su idea',
      pairs: [
        ['Costo de oportunidad', 'Lo que dejas al elegir otra opción'],
        ['Interés compuesto', 'Crecimiento que se alimenta de sí mismo'],
        ['Incentivos', 'Las personas responden a cómo se les premia'],
        ['Inversión (pensar al revés)', 'Preguntarse qué haría fracasar el plan'],
      ],
    },
  ],

  '121': [
    {
      type: 'concept',
      title: 'Escuchar a los animales',
      emoji: '📊',
      body: 'Los conductores comentan los resultados de la **primera gran encuesta** a su audiencia (los "animales") y hablan del **rumbo y formato** del podcast. Una lección que aplica también a tus finanzas: **medir y escuchar** antes de decidir.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se comentan los resultados de una encuesta a la audiencia del podcast.',
      answer: true,
      explain: 'Usar datos de quienes te escuchan ayuda a decidir qué contenidos priorizar, en vez de adivinar.',
    },
    {
      type: 'mc',
      prompt: '¿Cómo se aplica "medir antes de decidir" a tus finanzas personales?',
      options: [
        'Registrar tus gastos antes de armar tu presupuesto',
        'Armar un presupuesto sin mirar en qué gastas',
        'Invertir según lo que diga el primer video que veas',
        'Decidir por intuición todos los meses',
      ],
      answer: 0,
      explain: 'Sin datos reales de tus gastos, un presupuesto es solo un deseo; medir te muestra dónde está el margen para mejorar.',
    },
    {
      type: 'fill',
      sentence: 'A la audiencia del podcast se le dice "___".',
      options: ['animales', 'inversionistas', 'alumnos'],
      answer: 0,
      explain: 'Es un guiño a la idea central del podcast: manejar tu "animal interior" para tomar mejores decisiones con la plata.',
    },
    {
      type: 'order',
      prompt: 'Ordena un ciclo de mejora (vale para un podcast o para tu presupuesto)',
      items: ['Medir', 'Analizar los resultados', 'Decidir cambios', 'Aplicar y volver a medir'],
      explain: 'Es un ciclo: sin volver a medir no sabes si el cambio funcionó.',
    },
  ],

  '122': [
    {
      type: 'concept',
      title: 'Tranquilidad financiera: generar y ahorrar',
      emoji: '🧘',
      body: 'Fernando Gómez desmenuza su charla de Finanfest sobre **tranquilidad financiera**, que tiene 5 puntos y se construye **por etapas**. Esta primera parte cubre los dos primeros: **generar** ingresos y **ahorrar** de forma sistemática.',
    },
    {
      type: 'order',
      prompt: 'Ordena las dos primeras etapas del marco que cubre este episodio',
      items: ['Generar ingresos', 'Ahorrar de forma sistemática'],
      explain: 'No se puede ahorrar lo que no se genera: primero ingresos, después un sistema para guardar parte de ellos.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la tranquilidad financiera se construye por etapas.',
      answer: true,
      explain: 'Pensar en etapas ayuda a enfocarte en lo que corresponde ahora, en vez de intentar resolver todo a la vez.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa ahorrar "de forma sistemática"?',
      options: [
        'Ahorrar con una regla fija y repetida, como un % automático de cada sueldo',
        'Ahorrar solo cuando te acuerdas',
        'Ahorrar solo lo que sobra a fin de mes',
        'Ahorrar una vez al año con el bono',
      ],
      answer: 0,
      explain: 'Un sistema no depende del ánimo del mes: se repite solo y el hábito se construye sin esfuerzo constante.',
    },
    {
      type: 'fill',
      sentence: 'Si ahorras el 10% de un sueldo líquido de $900.000, apartas $___ al mes.',
      options: ['90.000', '9.000', '900.000'],
      answer: 0,
      explain: '10% de 900.000 es 90.000. Definir el ahorro como porcentaje hace que crezca solo cuando sube tu sueldo.',
    },
  ],

  '123': [
    {
      type: 'concept',
      title: 'Tranquilidad financiera, segunda parte',
      emoji: '🌱',
      body: 'Tras **generar y ahorrar**, esta segunda parte revisa el resto del marco de tranquilidad financiera y trae historias de los orígenes de Fernando. Una idea que aparece: cómo tu **historia personal** influye en tu **relación con el dinero**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la historia personal influye en la relación con el dinero.',
      answer: true,
      explain: 'Lo que viviste en tu familia (escasez, deudas, abundancia) moldea tus hábitos y miedos con la plata, a menudo sin que lo notes.',
    },
    {
      type: 'mc',
      prompt: '¿Por qué sirve reconocer cómo te marcó tu historia con el dinero?',
      options: [
        'Para entender tus reacciones automáticas y decidir de forma más consciente',
        'Para culpar a tu familia de tus deudas',
        'Porque determina tu rentabilidad futura',
        'No sirve de nada',
      ],
      answer: 0,
      explain: 'Si sabes que tiendes a gastar por ansiedad o a no invertir por miedo, puedes diseñar reglas que compensen ese sesgo.',
    },
    {
      type: 'fill',
      sentence: 'El marco de tranquilidad financiera continúa más allá de generar y ___.',
      options: ['ahorrar', 'gastar', 'endeudarse'],
      answer: 0,
      explain: 'Generar y ahorrar son la base (parte 1); con esa base se construyen las etapas siguientes.',
    },
    {
      type: 'match',
      prompt: 'Une cada experiencia con un hábito que podría generar',
      pairs: [
        ['Crecer con escasez', 'Miedo a gastar o a invertir'],
        ['Ver deudas en casa', 'Rechazo a pedir crédito'],
        ['Ver gasto para aparentar', 'Tentación de gastar por estatus'],
      ],
    },
  ],

  '124': [
    {
      type: 'concept',
      title: 'Primero el estilo de vida',
      emoji: '🏝️',
      body: 'En este episodio se plantea **definir primero el estilo de vida** que quieres y **después elegir la estrategia de inversión** que te lleva ahí. También se habla de prioridades al empezar y de la **independencia financiera** como objetivo (incluyendo dividendos).',
    },
    {
      type: 'order',
      prompt: 'Ordena el enfoque que propone el episodio',
      items: [
        'Definir el estilo de vida que quieres',
        'Estimar cuánto cuesta ese estilo de vida',
        'Elegir la estrategia de inversión según eso',
        'Avanzar hacia la independencia financiera',
      ],
      explain: 'La estrategia es un medio: si no sabes para qué vida inviertes, es fácil elegir riesgos o plazos que no te calzan.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa independencia financiera?',
      options: [
        'Que tus inversiones cubran tus gastos sin depender de un sueldo',
        'Tener una tarjeta de crédito sin cupo máximo',
        'No tener cuenta bancaria',
        'Ganar un sueldo muy alto',
      ],
      answer: 0,
      explain: 'Un sueldo alto no garantiza libertad si gastas todo; lo que importa es que tus activos generen lo suficiente para vivir.',
    },
    {
      type: 'tf',
      statement: 'Los dividendos son pagos que algunas empresas reparten a sus accionistas.',
      answer: true,
      explain: 'Algunas personas buscan independencia financiera construyendo una cartera cuyos dividendos cubran parte de sus gastos.',
    },
    {
      type: 'fill',
      sentence: 'Un estilo de vida más caro requiere un patrimonio ___ para ser independiente.',
      options: ['mayor', 'menor', 'igual'],
      answer: 0,
      explain: 'Mientras más gastas al año, más capital necesitas para cubrirlo; por eso el estilo de vida define la meta.',
    },
  ],

  '133': [
    {
      type: 'concept',
      title: 'Todo sobre el APV',
      emoji: '🐘',
      body: 'El **Ahorro Previsional Voluntario (APV)** complementa tu ahorro obligatorio de la AFP. Hay que elegir **régimen**: el **A** entrega una **bonificación estatal**; el **B** **rebaja tu base imponible** (pagas menos impuesto). Luego defines cuánto ahorrar y comparas proveedores y comisiones.',
    },
    {
      type: 'match',
      prompt: 'Une cada régimen de APV con su beneficio',
      pairs: [
        ['Régimen A', 'Bonificación estatal sobre lo ahorrado'],
        ['Régimen B', 'Rebaja de la base imponible del impuesto'],
      ],
    },
    {
      type: 'mc',
      prompt: 'Alguien con ingresos bajos o medios que casi no paga impuesto a la renta, ¿qué régimen suele aprovechar más?',
      options: ['Régimen A', 'Régimen B', 'Da exactamente lo mismo', 'Ninguno, el APV es solo para altos ingresos'],
      answer: 0,
      explain: 'Si pagas poco o nada de impuesto, rebajar la base imponible (B) no te ahorra casi nada; la bonificación del A sí es un beneficio directo.',
    },
    {
      type: 'tf',
      statement: 'El APV reemplaza la cotización obligatoria en la AFP.',
      answer: false,
      explain: 'La complementa: es un ahorro adicional y voluntario para mejorar tu pensión futura.',
    },
    {
      type: 'fill',
      sentence: 'Al elegir con quién contratar el APV, conviene comparar las ___.',
      options: ['comisiones', 'oficinas', 'tarjetas de regalo'],
      answer: 0,
      explain: 'En un ahorro de décadas, una comisión más alta se compone en contra tuyo y puede restar una parte grande de tu pensión.',
    },
    {
      type: 'order',
      prompt: 'Ordena los pasos para partir con tu APV',
      items: [
        'Elegir régimen (A o B) según tu ingreso',
        'Definir cuánto ahorrar',
        'Comparar proveedores y comisiones',
        'Contratar y automatizar el aporte',
      ],
      explain: 'El régimen depende de tu situación tributaria; con eso claro, el monto y el proveedor definen cuánto termina en tu bolsillo.',
    },
  ],

  '135': [
    {
      type: 'concept',
      title: 'Leyendo a Buffett',
      emoji: '✉️',
      body: 'Cada año Warren Buffett escribe una carta a los accionistas de Berkshire Hathaway. En este episodio se lee y comenta la carta 2024: **pensamiento de largo plazo** y **lecciones de vida** además de inversión.',
    },
    {
      type: 'tf',
      statement: 'Las cartas anuales de grandes inversionistas pueden ser una fuente de aprendizaje gratuita.',
      answer: true,
      explain: 'Son públicas y explican cómo piensan inversionistas con décadas de experiencia, incluyendo sus errores.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es Berkshire Hathaway?',
      options: [
        'La empresa que dirige Warren Buffett, dueña de muchos negocios y acciones',
        'Un banco central',
        'Una AFP chilena',
        'Una criptomoneda',
      ],
      answer: 0,
      explain: 'Es un conglomerado; sus accionistas reciben cada año la carta de Buffett explicando resultados y filosofía.',
    },
    {
      type: 'fill',
      sentence: 'Buffett es conocido por su pensamiento de ___ plazo.',
      options: ['largo', 'cortísimo', 'mediano'],
      answer: 0,
      explain: 'Comprar buenos negocios y mantenerlos por años deja que el interés compuesto haga su trabajo.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su definición',
      pairs: [
        ['Accionista', 'Dueño de una parte de la empresa'],
        ['Carta anual', 'Comunicación del CEO a los dueños'],
        ['Largo plazo', 'Horizonte de años o décadas'],
      ],
    },
  ],

  '138': [
    {
      type: 'concept',
      title: 'Reforma de pensiones sin mitos',
      emoji: '🏛️',
      body: 'Qué significan para las personas los cambios a las reglas de pensiones en Chile tras la reforma. Tres objetivos: **entender cómo funciona** el sistema, **separar mitos de realidades** y ver **cómo te afecta** a ti.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se busca separar mitos de realidades sobre la reforma de pensiones.',
      answer: true,
      explain: 'Con temas tan discutidos circula mucha información a medias; conviene ir a fuentes confiables antes de sacar conclusiones.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto previsional con su significado',
      pairs: [
        ['AFP', 'Administra tus fondos de pensión obligatorios'],
        ['Cotización', 'Parte del sueldo que va a tu ahorro previsional'],
        ['Multifondos A–E', 'Opciones de más a menos riesgo'],
        ['APV', 'Ahorro voluntario adicional para la jubilación'],
      ],
    },
    {
      type: 'mc',
      prompt: '¿Cuál es una buena forma de saber cómo te afecta un cambio en las pensiones?',
      options: [
        'Revisar fuentes oficiales y tu propia cartola/simulación',
        'Creer el primer mensaje que llega por WhatsApp',
        'Ignorarlo porque falta mucho para jubilar',
        'Cambiarte de fondo cada vez que sale una noticia',
      ],
      answer: 0,
      explain: 'Tu situación depende de tu edad, sueldo y saldo; las fuentes oficiales y tus datos te dan la foto real.',
    },
    {
      type: 'fill',
      sentence: 'En Chile, el multifondo ___ es el de mayor riesgo (más acciones).',
      options: ['A', 'E', 'C'],
      answer: 0,
      explain: 'El A tiene más renta variable y el E casi solo renta fija; en general, más riesgo tiene más sentido cuando falta mucho para jubilar.',
    },
  ],

  '140': [
    {
      type: 'concept',
      title: 'Inmobiliario más allá del depto',
      emoji: '🏗️',
      body: 'Invertir en inmobiliario **no tiene por qué ser comprar y arrendar un departamento**. Existen formatos como **desarrollo**, **leaseback** y **renta**, cada uno con beneficios y riesgos distintos. También importa cómo se gestionan los riesgos y que el gestor **invierta junto a ti**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que invertir junto al gestor ayuda a alinear incentivos.',
      answer: true,
      explain: 'Si el gestor arriesga su propia plata en el mismo proyecto, gana y pierde contigo, lo que reduce conflictos de interés.',
    },
    {
      type: 'match',
      prompt: 'Une cada formato inmobiliario con su descripción',
      pairs: [
        ['Comprar para arrendar', 'Eres dueño y cobras arriendo mes a mes'],
        ['Renta', 'Inviertes en activos que ya generan arriendos'],
        ['Desarrollo', 'Financias la construcción de un proyecto nuevo'],
        ['Leaseback', 'Compras un inmueble y se lo arriendas al vendedor'],
      ],
    },
    {
      type: 'mc',
      prompt: 'En general, ¿qué formato suele tener más riesgo?',
      options: [
        'Desarrollo, porque el proyecto aún no existe',
        'Renta, porque ya tiene arrendatarios',
        'Todos tienen exactamente el mismo riesgo',
        'Ninguno tiene riesgo',
      ],
      answer: 0,
      explain: 'En desarrollo hay riesgos de permisos, costos de construcción, plazos y ventas; a cambio, suele buscar un retorno mayor.',
    },
    {
      type: 'fill',
      sentence: 'Que el gestor invierta su propia plata en el proyecto se conoce como alinear ___.',
      options: ['incentivos', 'tasas', 'impuestos'],
      answer: 0,
      explain: 'Cuando las dos partes ganan con lo mismo, es más probable que el gestor cuide el proyecto como si fuera suyo.',
    },
  ],

  '149': [
    {
      type: 'concept',
      title: 'Hora de jubilar',
      emoji: '🌅',
      body: '**Cuándo y cómo jubilar** es una de las decisiones financieras más importantes. Hay que conocer el sistema de pensiones, las **modalidades de pensión**, el rol de un **asesor** y, sobre todo, **planificar con anticipación**.',
    },
    {
      type: 'match',
      prompt: 'Une cada modalidad de pensión con su característica',
      pairs: [
        ['Retiro programado', 'Tus fondos siguen en la AFP y la pensión se recalcula cada año'],
        ['Renta vitalicia', 'Una aseguradora te paga un monto fijo en UF de por vida'],
      ],
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que conviene planificar la jubilación con anticipación.',
      answer: true,
      explain: 'Mientras antes lo pienses, más opciones tienes: aumentar el ahorro, ajustar tu fondo o decidir cuándo retirarte.',
    },
    {
      type: 'mc',
      prompt: '¿Qué ventaja principal tiene la renta vitalicia?',
      options: [
        'Te protege del riesgo de vivir más años de lo esperado',
        'Permite dejar todo el saldo como herencia siempre',
        'Su monto sube cuando la bolsa sube',
        'Se puede cambiar cada año',
      ],
      answer: 0,
      explain: 'Asegura un pago de por vida; a cambio, la decisión es irreversible y el saldo pasa a la aseguradora.',
    },
    {
      type: 'fill',
      sentence: 'Un ___ previsional puede ayudarte a comparar modalidades antes de jubilar.',
      options: ['asesor', 'influencer', 'vendedor de autos'],
      answer: 0,
      explain: 'Es una decisión compleja y a veces irreversible; una asesoría informada ayuda a entender las ofertas y sus letras chicas.',
    },
  ],

  '150': [
    {
      type: 'concept',
      title: 'El camino simple a la riqueza',
      emoji: '🛤️',
      body: 'Primera parte de una serie sobre el libro de **JL Collins**. Ideas clave: un plan **simple** suele ser mejor que uno complejo, la **deuda** es el principal freno a la libertad financiera, hay que **ahorrar una parte importante** del ingreso e invertir de forma **simple y de bajo costo**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la deuda es el principal freno a la libertad financiera.',
      answer: true,
      explain: 'Cada peso que va a intereses es un peso que no se invierte, y la deuda te amarra a seguir trabajando para pagarla.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es un ejemplo de invertir "simple y de bajo costo"?',
      options: [
        'Un fondo indexado amplio con comisión baja',
        'Una cartera con 30 fondos distintos que se cambian cada mes',
        'Un producto estructurado que no entiendes',
        'Seguir los datos de un grupo de Telegram',
      ],
      answer: 0,
      explain: 'Un fondo indexado te da diversificación amplia con poco costo y casi sin decisiones, que es donde se cometen la mayoría de los errores.',
    },
    {
      type: 'fill',
      sentence: 'Para avanzar rápido a la libertad financiera hay que ahorrar una parte ___ del ingreso.',
      options: ['importante', 'mínima', 'simbólica'],
      answer: 0,
      explain: 'La tasa de ahorro es de las palancas más poderosas: acelera el capital invertido y a la vez muestra que puedes vivir con menos.',
    },
    {
      type: 'match',
      prompt: 'Une cada idea con su beneficio',
      pairs: [
        ['Plan simple', 'Más fácil de mantener en el tiempo'],
        ['Bajo costo', 'Más rentabilidad queda para ti'],
        ['Sin deudas', 'Más libertad para decidir'],
      ],
    },
  ],

  '153': [
    {
      type: 'concept',
      title: 'Simple le gana a complejo',
      emoji: '🧩',
      body: 'Segunda parte sobre el libro de JL Collins: su **filosofía de inversión**, los **tipos de activos** y los **errores típicos**. Una idea fuerte: **si el plan es complejo, beneficia más al asesor que a ti**. Y lo clave es **mantener el rumbo** en el largo plazo.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que un plan de inversión complejo suele beneficiar más al asesor que a ti.',
      answer: true,
      explain: 'La complejidad justifica comisiones más altas y hace difícil comparar; lo simple es más barato y transparente.',
    },
    {
      type: 'match',
      prompt: 'Une cada tipo de activo con su descripción',
      pairs: [
        ['Acciones', 'Propiedad de empresas, más crecimiento y más volatilidad'],
        ['Bonos', 'Préstamos que pagan interés, más estables'],
        ['Efectivo', 'Disponible al tiro, pero la inflación lo erosiona'],
      ],
    },
    {
      type: 'mc',
      prompt: '¿Cuál es un error típico al invertir?',
      options: [
        'Vender todo en pánico cuando el mercado cae',
        'Invertir de forma periódica en un fondo diversificado',
        'Mantener comisiones bajas',
        'Tener un fondo de emergencia aparte',
      ],
      answer: 0,
      explain: 'Vender en la caída convierte una baja temporal en una pérdida permanente y te hace perder la recuperación.',
    },
    {
      type: 'fill',
      sentence: 'En el largo plazo, lo más importante es ___ el rumbo.',
      options: ['mantener', 'cambiar cada mes', 'adivinar'],
      answer: 0,
      explain: 'Las estrategias simples funcionan si las sostienes; abandonarlas en los malos momentos es lo que las arruina.',
    },
  ],

  '155': [
    {
      type: 'concept',
      title: 'La escalera de la riqueza',
      emoji: '🪜',
      body: 'Entrevista a Nick Maggiulli, autor de "La escalera de la riqueza". Su tesis: **la estrategia financiera cambia según tu nivel de patrimonio**. Gastos, ingresos e inversiones se manejan distinto en cada peldaño, así que conviene **enfocarse en lo que más mueve la aguja** donde estás hoy.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la misma estrategia financiera sirve igual para cualquier nivel de patrimonio.',
      answer: false,
      explain: 'La tesis es la contraria: lo que más importa cambia a medida que subes en la escalera.',
    },
    {
      type: 'mc',
      prompt: 'Si tu patrimonio es pequeño, ¿qué suele mover más la aguja?',
      options: [
        'Aumentar tus ingresos y tu capacidad de ahorro',
        'Buscar un 0,5% más de rentabilidad',
        'Optimizar tus impuestos sobre herencias',
        'Diversificar en arte y vinos',
      ],
      answer: 0,
      explain: 'Con poco capital, ganar un 1% más rinde poco en pesos; subir tu ingreso o tu ahorro mensual pesa mucho más. Con un patrimonio grande, la relación se invierte.',
    },
    {
      type: 'fill',
      sentence: 'Mientras más grande es tu patrimonio, más pesa la ___ de tus inversiones versus tu sueldo.',
      options: ['rentabilidad', 'cantidad de tarjetas', 'marca del banco'],
      answer: 0,
      explain: 'Un 5% sobre un patrimonio grande puede superar tu sueldo anual; sobre uno pequeño, casi no se nota.',
    },
    {
      type: 'match',
      prompt: 'Une cada etapa con su foco más útil',
      pairs: [
        ['Patrimonio inicial', 'Subir ingresos y ahorrar'],
        ['Patrimonio medio', 'Invertir de forma constante y diversificada'],
        ['Patrimonio alto', 'Proteger lo construido y cuidar costos'],
      ],
    },
  ],

  '158': [
    {
      type: 'concept',
      title: 'Cinco tipos de riqueza',
      emoji: '💎',
      body: 'Basado en el libro de Sahil Bloom: medir el éxito **solo por el dinero** es problemático. La riqueza incluye **tiempo, relaciones, salud mental, salud física y dinero**. Herramientas como la "navaja de vida" y "el compás" ayudan a priorizar lo importante.',
    },
    {
      type: 'match',
      prompt: 'Une cada tipo de riqueza con un ejemplo',
      pairs: [
        ['Tiempo', 'Poder decidir en qué usas tus días'],
        ['Relaciones', 'Personas con quienes contar'],
        ['Salud mental', 'Propósito y tranquilidad'],
        ['Salud física', 'Energía y cuerpo sano'],
        ['Dinero', 'Recursos para cubrir tus necesidades'],
      ],
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que medir el éxito solo con dinero es un error.',
      answer: true,
      explain: 'Puedes tener mucha plata y poco tiempo, salud o relaciones; el dinero es una herramienta para las otras riquezas, no la única.',
    },
    {
      type: 'mc',
      prompt: 'Te ofrecen un ascenso con 20% más de sueldo pero 20 horas más de trabajo semanal. Según este enfoque, ¿qué deberías considerar?',
      options: [
        'Qué pasa con tu tiempo, salud y relaciones, además del dinero',
        'Solo el aumento de sueldo',
        'Solo lo que opinan tus colegas',
        'Nada, siempre hay que aceptar',
      ],
      answer: 0,
      explain: 'Ganar en una riqueza a costa de otras puede dejarte más pobre en total; la idea es decidir mirando el conjunto.',
    },
    {
      type: 'fill',
      sentence: 'El dinero es solo uno de los ___ tipos de riqueza.',
      options: ['cinco', 'dos', 'diez'],
      answer: 0,
      explain: 'Tiempo, relaciones, salud mental, salud física y dinero forman un balance; descuidar uno termina afectando a los otros.',
    },
  ],

  '159': [
    {
      type: 'concept',
      title: 'IA en Latinoamérica',
      emoji: '🤖',
      body: 'Entrevista a quien lidera el ecosistema de inteligencia artificial en Río de Janeiro y creó **AI Salon**, un evento que reúne a **gobierno, empresas y líderes** de IA de Brasil. Temas: el estado del ecosistema de IA en la región y sus **oportunidades**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se habla del rol de reunir a gobierno, empresas y talento en torno a la IA.',
      answer: true,
      explain: 'Los ecosistemas tecnológicos crecen cuando quienes regulan, invierten y construyen conversan entre sí.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es un "ecosistema" tecnológico?',
      options: [
        'La red de empresas, talento, inversionistas y gobierno que hacen crecer una industria',
        'Un tipo de fondo de inversión',
        'Un software específico de IA',
        'Una reserva natural',
      ],
      answer: 0,
      explain: 'Ningún actor lo logra solo: se necesitan personas capacitadas, capital, clientes y reglas claras.',
    },
    {
      type: 'fill',
      sentence: 'Para aprovechar las oportunidades de la IA en tu carrera, una buena estrategia es el ___ continuo.',
      options: ['aprendizaje', 'endeudamiento', 'descanso'],
      answer: 0,
      explain: 'Las herramientas cambian rápido; tu capacidad de aprender es un activo que aumenta tu ingreso futuro.',
    },
    {
      type: 'match',
      prompt: 'Une cada actor con su rol en un ecosistema de IA',
      pairs: [
        ['Gobierno', 'Define reglas y políticas públicas'],
        ['Empresas', 'Adoptan y desarrollan la tecnología'],
        ['Talento', 'Personas que construyen y usan la IA'],
      ],
    },
  ],

  '163': [
    {
      type: 'concept',
      title: 'La robótica es ahora',
      emoji: '🦾',
      body: 'Qué tan cerca estamos del futuro con la **robótica y la IA**, su impacto en el bienestar humano y cómo **prepararse para el mercado laboral** que viene. También se habla de los **límites y desafíos** actuales de la tecnología.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se habla de la sinergia entre IA y robótica.',
      answer: true,
      explain: 'La IA le da a los robots capacidad de percibir y decidir; los robots le dan a la IA un "cuerpo" para actuar en el mundo físico.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es una forma financieramente sensata de prepararse para un mercado laboral cambiante?',
      options: [
        'Invertir en aprender habilidades nuevas y tener un fondo de emergencia',
        'Asumir que tu trabajo nunca va a cambiar',
        'Endeudarte para comprar el último gadget',
        'Dejar de ahorrar porque "igual viene la automatización"',
      ],
      answer: 0,
      explain: 'Las habilidades aumentan tu capacidad de generar ingresos, y el colchón te da tiempo para adaptarte si tu trabajo cambia.',
    },
    {
      type: 'fill',
      sentence: 'Tu capacidad de generar ingresos en el futuro también se conoce como capital ___.',
      options: ['humano', 'de trabajo', 'social'],
      answer: 0,
      explain: 'Para la mayoría de las personas jóvenes, su capital humano es su activo más valioso; cuidarlo y mejorarlo es una inversión.',
    },
    {
      type: 'order',
      prompt: 'Ordena un plan para adaptarte a cambios tecnológicos en tu trabajo',
      items: [
        'Identificar qué tareas de tu trabajo podrían automatizarse',
        'Elegir habilidades complementarias para aprender',
        'Dedicar tiempo o plata a formarte',
        'Aplicarlas en tu trabajo o buscar nuevas oportunidades',
      ],
      explain: 'Anticiparse te permite moverte hacia tareas donde la tecnología te potencia en vez de reemplazarte.',
    },
  ],

  '179': [
    {
      type: 'concept',
      title: 'El arte de gastar dinero',
      emoji: '🛍️',
      body: 'Primera parte, grabada en vivo, sobre el libro de Morgan Housel. **Gastar bien es tan importante como ahorrar**: entender qué te da **valor y felicidad** y tener cuidado con gastar por **estatus o envidia**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que gastar bien es tan importante como ahorrar.',
      answer: true,
      explain: 'El objetivo del dinero no es acumularlo sin fin, sino usarlo en lo que realmente mejora tu vida.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál de estos es un ejemplo de gastar por estatus?',
      options: [
        'Cambiar el auto porque tu vecino se compró uno nuevo',
        'Pagar una clase de algo que te apasiona',
        'Viajar a ver a tu familia',
        'Comprar zapatillas porque las tuyas se rompieron',
      ],
      answer: 0,
      explain: 'El gasto por comparación rara vez da satisfacción duradera: siempre habrá alguien con algo mejor.',
    },
    {
      type: 'fill',
      sentence: 'Un buen gasto es el que está alineado con lo que te da ___.',
      options: ['valor y felicidad', 'likes', 'estatus'],
      answer: 0,
      explain: 'Saber qué te importa de verdad te permite gastar sin culpa en eso y recortar sin dolor en lo demás.',
    },
    {
      type: 'match',
      prompt: 'Clasifica cada gasto',
      pairs: [
        ['Comprar algo para que otros lo vean', 'Gasto por estatus'],
        ['Comprar porque un amigo lo tiene', 'Gasto por envidia'],
        ['Invertir en una experiencia que valoras', 'Gasto con valor personal'],
      ],
    },
  ],

  '182': [
    {
      type: 'concept',
      title: 'Que la plata deje de ser tema',
      emoji: '🕊️',
      body: 'Segunda parte del libro de Morgan Housel: la independencia financiera **va más allá de la regla del 4%**. La meta de fondo es que el dinero **deje de ser una preocupación** y **gastar alineado con tus valores**.',
    },
    {
      type: 'mc',
      prompt: 'Según la regla del 4%, si gastas $12.000.000 al año, ¿qué patrimonio necesitarías aproximadamente?',
      options: ['$300.000.000', '$48.000.000', '$120.000.000', '$1.200.000.000'],
      answer: 0,
      explain: 'La regla sugiere retirar ~4% al año, o sea tener unas 25 veces tu gasto anual: 12 millones × 25 = 300 millones. Es una guía aproximada, no una garantía.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que la independencia financiera es solo un cálculo con la regla del 4%.',
      answer: false,
      explain: 'La regla es una referencia útil, pero la idea es más amplia: sentir que la plata ya no domina tus decisiones.',
    },
    {
      type: 'fill',
      sentence: 'La regla del 4% equivale a necesitar unas ___ veces tu gasto anual.',
      options: ['25', '4', '100'],
      answer: 0,
      explain: '1 ÷ 0,04 = 25. Si retiras 4% por año, tu patrimonio tiene que ser 25 veces lo que gastas.',
    },
    {
      type: 'match',
      prompt: 'Une cada idea con su significado',
      pairs: [
        ['Regla del 4%', 'Retiro anual sostenible de referencia'],
        ['Independencia financiera', 'Tus activos cubren tus gastos'],
        ['Gastar con valores', 'Usar la plata en lo que te importa'],
      ],
    },
  ],

  '187': [
    {
      type: 'concept',
      title: 'La IA y el futuro del trabajo',
      emoji: '💼',
      body: 'Comentan un memo de Howard Marks sobre la IA, el texto "Something Big is Happening" y un reporte de Citrini, con una pregunta de fondo: **¿seguiremos teniendo trabajo en un par de años?** Temas: el impacto de la IA en el empleo y cómo **prepararse** ante cambios laborales.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea leer a inversionistas de referencia para entender tendencias.',
      answer: true,
      explain: 'Personas que analizan mercados por décadas suelen ofrecer una mirada más pausada que los titulares del día.',
    },
    {
      type: 'mc',
      prompt: 'Si te preocupa que la IA afecte tu empleo, ¿qué medida financiera ayuda más a corto plazo?',
      options: [
        'Tener un fondo de emergencia de varios meses de gastos',
        'Tomar un crédito para vivir mejor mientras dure el trabajo',
        'Invertir todo en una sola empresa de IA',
        'No hacer nada y esperar',
      ],
      answer: 0,
      explain: 'Un colchón te da tiempo para reconvertirte o buscar trabajo sin endeudarte ni vender inversiones en mal momento.',
    },
    {
      type: 'order',
      prompt: 'Ordena un plan para prepararte ante cambios en el mercado laboral',
      items: [
        'Asegurar un fondo de emergencia',
        'Informarte con fuentes serias sobre tu industria',
        'Aprender habilidades que la IA potencie',
        'Diversificar tus fuentes de ingreso si es posible',
      ],
      explain: 'Primero la protección; luego información y habilidades para adaptarte, y finalmente depender menos de una sola fuente de ingresos.',
    },
    {
      type: 'fill',
      sentence: 'Howard Marks es conocido por escribir ___ para inversionistas.',
      options: ['memos', 'novelas', 'canciones'],
      answer: 0,
      explain: 'Sus memos, publicados hace décadas, se leen mucho por su análisis de ciclos, riesgo y psicología del mercado.',
    },
  ],

  'titulo-no-confirmado-construir-una-plataforma-de-i': [
    {
      type: 'concept',
      title: 'Democratizar la inversión',
      emoji: '🚀',
      body: 'La historia de construir una plataforma para **democratizar la inversión en Colombia**: desafíos regulatorios, casi tres años de retrasos tecnológicos y una **comunidad** clave para avanzar. Lecciones: **perseverancia** y **escuchar a los usuarios**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se destaca la perseverancia al emprender frente a retrasos y desafíos regulatorios.',
      answer: true,
      explain: 'En negocios financieros los permisos y la tecnología toman tiempo; muchos proyectos fallan por rendirse antes de llegar.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa "democratizar la inversión"?',
      options: [
        'Que más personas, incluso con montos pequeños, puedan acceder a invertir',
        'Que el gobierno decida en qué invierte cada persona',
        'Que todas las inversiones rindan lo mismo',
        'Eliminar el riesgo de invertir',
      ],
      answer: 0,
      explain: 'Bajar montos mínimos, costos y barreras permite que invertir no sea solo para quienes tienen mucho capital.',
    },
    {
      type: 'fill',
      sentence: 'Escuchar a los ___ ayuda a construir un producto que realmente sirva.',
      options: ['usuarios', 'competidores', 'rumores'],
      answer: 0,
      explain: 'Los usuarios te muestran qué problemas tienen de verdad; una comunidad activa puede además impulsar el crecimiento.',
    },
    {
      type: 'match',
      prompt: 'Une cada desafío de emprender con una respuesta',
      pairs: [
        ['Regulación exigente', 'Paciencia y cumplir las reglas'],
        ['Retrasos tecnológicos', 'Perseverancia'],
        ['Dudas sobre el producto', 'Escuchar a los usuarios'],
      ],
    },
  ],

  'titulo-no-confirmado-episodio-con-gert-findel-acid': [
    {
      type: 'concept',
      title: 'Prioridades por etapa',
      emoji: '⏳',
      body: 'Qué priorizar en cada etapa de la vida: desde **semanas de más de 100 horas de trabajo** hasta las **relaciones** que hoy mueven al invitado. El valor de **planificar** y de distinguir **lo importante del ruido**.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que las prioridades cambian con las etapas de la vida.',
      answer: true,
      explain: 'Lo que tiene sentido a los 25 (trabajar mucho, arriesgar) puede no tenerlo a los 45; revisar tus prioridades evita vivir en piloto automático.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es un costo de trabajar en exceso por mucho tiempo?',
      options: [
        'Descuidar la salud y las relaciones',
        'Ninguno, más horas siempre es mejor',
        'Pagar menos impuestos',
        'Tener demasiado tiempo libre',
      ],
      answer: 0,
      explain: 'Más horas pueden traer más ingresos, pero a costa de otras riquezas que después cuesta mucho recuperar.',
    },
    {
      type: 'fill',
      sentence: 'Planificar te ayuda a distinguir lo importante del ___.',
      options: ['ruido', 'ahorro', 'presupuesto'],
      answer: 0,
      explain: 'Sin un plan, lo urgente y lo llamativo se comen el tiempo que querías dar a lo que de verdad importa.',
    },
    {
      type: 'match',
      prompt: 'Une cada etapa típica con una prioridad posible',
      pairs: [
        ['Inicio de carrera', 'Aprender y construir habilidades'],
        ['Familia joven', 'Tiempo con los tuyos y estabilidad'],
        ['Madurez', 'Relaciones, salud y legado'],
      ],
    },
  ],

  'titulo-no-confirmado-episodio-con-tere-razmilic': [
    {
      type: 'concept',
      title: 'Diseñar tu estilo de vida',
      emoji: '🌍',
      body: 'Cómo tener carrera, criar tres hijos y vivir seis meses en Sudáfrica cada cuatro años. Ideas: **diseñar tu estilo de vida intencionalmente**, **sesgo a la acción**, a veces **crecer hacia el lado** en vez de subir, y **aprender continuamente** en la era de la IA.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que a veces conviene crecer hacia el lado en vez de subir.',
      answer: true,
      explain: 'Un movimiento lateral puede darte nuevas habilidades, flexibilidad o calidad de vida que un ascenso tradicional no daría.',
    },
    {
      type: 'mc',
      prompt: '¿Qué significa tener "sesgo a la acción"?',
      options: [
        'Preferir probar y ajustar en vez de esperar el plan perfecto',
        'Actuar sin pensar en ningún riesgo',
        'Cambiar de trabajo cada mes',
        'Invertir todo apenas recibes el sueldo sin fondo de emergencia',
      ],
      answer: 0,
      explain: 'Dar pasos pequeños te da información real; esperar la certeza total muchas veces significa no hacer nada.',
    },
    {
      type: 'fill',
      sentence: 'Si quieres un estilo de vida con viajes largos, necesitas ___ esos planes con anticipación.',
      options: ['financiar', 'ignorar', 'improvisar'],
      answer: 0,
      explain: 'Un estilo de vida intencional tiene un costo; ahorrar con tiempo y organizar tus ingresos lo hace posible.',
    },
    {
      type: 'order',
      prompt: 'Ordena los pasos para diseñar tu estilo de vida',
      items: [
        'Definir cómo quieres vivir',
        'Estimar cuánto cuesta',
        'Ajustar trabajo e ingresos para lograrlo',
        'Probar, aprender y ajustar',
      ],
      explain: 'Partir por la vida que quieres le da sentido al plan financiero, y el sesgo a la acción te permite ir corrigiendo.',
    },
  ],

  'titulo-no-confirmado-que-pasa-si-sigues-los-consej': [
    {
      type: 'concept',
      title: 'Consejos financieros de la IA: revisa la letra chica',
      emoji: '🧾',
      body: 'Analizan un estudio que simuló seguir los consejos financieros de la IA toda la vida, y dónde todavía falla: **gastos no ajustados por inflación**, **datos de comisiones sacados de un blog** y **recomendaciones distintas a hombres y mujeres**. Lección: **revisar los detalles**.',
    },
    {
      type: 'match',
      prompt: 'Une cada falla detectada con cómo corregirla',
      pairs: [
        ['Gastos no ajustados por inflación', 'Proyectar gastos en términos reales'],
        ['Comisiones sacadas de un blog', 'Verificar en fuentes oficiales'],
        ['Consejos distintos por género', 'Pedir que se base en tus datos reales'],
      ],
    },
    {
      type: 'tf',
      statement: 'Si no ajustas tus gastos futuros por inflación, probablemente vas a subestimar cuánto necesitas.',
      answer: true,
      explain: 'Con inflación, lo que hoy cuesta $1.000.000 costará más en 20 años; un plan sin ese ajuste queda corto.',
    },
    {
      type: 'mc',
      prompt: 'Según lo que se plantea en el episodio, ante la pérdida del empleo, ¿qué conviene usar primero?',
      options: ['El fondo de emergencia', 'El avance en efectivo de la tarjeta', 'Tus ahorros para la jubilación', 'Un crédito de consumo'],
      answer: 0,
      explain: 'El fondo de emergencia existe justamente para eso; usar crédito o jubilación te sale mucho más caro.',
    },
    {
      type: 'fill',
      sentence: 'Antes de seguir un plan hecho con IA, conviene verificar sus ___ de datos.',
      options: ['fuentes', 'colores', 'emojis'],
      answer: 0,
      explain: 'Una IA puede sonar segura aunque use datos desactualizados o poco confiables; la responsabilidad de revisar es tuya.',
    },
  ],

  'titulo-no-confirmado-vender-un-departamento-sin-co': [
    {
      type: 'concept',
      title: 'Vender sin corredor',
      emoji: '🔑',
      body: 'El paso a paso para vender un departamento directamente, **sin pagar comisión** a un corredor: usar **IA para estimar el precio** y contrastarlo con el mercado, calcular la **rentabilidad real** y tener listo el **checklist de documentos** para el estudio de títulos.',
    },
    {
      type: 'order',
      prompt: 'Ordena un proceso razonable para vender sin corredor',
      items: [
        'Estimar el precio (con IA) y contrastarlo con el mercado',
        'Reunir los documentos para el estudio de títulos',
        'Publicar y mostrar el departamento',
        'Negociar y cerrar la venta con el banco del comprador',
      ],
      explain: 'Un precio bien calibrado atrae compradores; tener los papeles listos evita que la venta se caiga en la etapa del banco.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea contrastar el precio estimado con IA contra el mercado.',
      answer: true,
      explain: 'La IA da un punto de partida, pero los precios reales de ventas similares en la zona son la mejor referencia.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es el estudio de títulos?',
      options: [
        'La revisión legal que hace el banco para verificar que la propiedad se puede vender sin problemas',
        'Un curso universitario sobre bienes raíces',
        'La tasación del valor comercial',
        'Un seguro contra incendio',
      ],
      answer: 0,
      explain: 'Revisa dominio, hipotecas, gravámenes y otros antecedentes; si faltan documentos, la venta se atrasa.',
    },
    {
      type: 'fill',
      sentence: 'Una regla que se menciona: el dividendo no debería superar mucho el ___ que ya pagas.',
      options: ['arriendo', 'sueldo bruto', 'gasto en supermercado'],
      answer: 0,
      explain: 'Si el dividendo es mucho mayor que tu arriendo actual, tu presupuesto mensual queda muy apretado al pasar a ser propietario.',
    },
  ],

  'titulo-no-confirmado-cockroaches-in-the-coal-mine-': [
    {
      type: 'concept',
      title: 'Cucarachas en la mina: deuda privada',
      emoji: '🪳',
      body: 'Comentan un memo de Howard Marks de noviembre de 2025 y se preguntan si estamos viendo las **primeras señales de caída** del mercado de **deuda privada**. Temas: qué es la deuda privada, **señales de riesgo** en los mercados de crédito y **prudencia ante la complacencia**.',
    },
    {
      type: 'mc',
      prompt: '¿Qué es la deuda privada?',
      options: [
        'Préstamos a empresas hechos por fondos o inversionistas, fuera de los bancos y la bolsa',
        'Las deudas personales de tarjeta de crédito',
        'Bonos emitidos por el gobierno',
        'Acciones de empresas que no pagan dividendos',
      ],
      answer: 0,
      explain: 'Son créditos que no se transan en bolsa; por eso suelen tener menos liquidez y menos transparencia de precios.',
    },
    {
      type: 'tf',
      statement: 'La complacencia de los inversionistas (creer que nada puede salir mal) suele ser una señal para ser más prudente.',
      answer: true,
      explain: 'Cuando todos se sienten seguros, se aceptan más riesgos por menos retorno; ahí es cuando más conviene revisar lo que tienes.',
    },
    {
      type: 'fill',
      sentence: 'Un activo que no se puede vender rápido tiene baja ___.',
      options: ['liquidez', 'rentabilidad', 'inflación'],
      answer: 0,
      explain: 'Si necesitas la plata en un mal momento, un activo ilíquido puede obligarte a esperar o a vender con descuento.',
    },
    {
      type: 'match',
      prompt: 'Une cada concepto con su significado',
      pairs: [
        ['Riesgo de crédito', 'Que el deudor no pague'],
        ['Complacencia', 'Confianza excesiva en que todo irá bien'],
        ['Señal temprana', 'Pequeño problema que anticipa otros mayores'],
      ],
    },
  ],

  'titulo-no-confirmado-especial-200-episodios': [
    {
      type: 'concept',
      title: '200 episodios de aprendizaje',
      emoji: '🎉',
      body: 'Episodio especial: repasan los **aprendizajes de 200 episodios** y definen el **rumbo para los próximos 100**. Un buen recordatorio para tus finanzas: de vez en cuando, **mira hacia atrás** para ver cuánto avanzaste y decidir hacia dónde seguir.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se repasan aprendizajes acumulados y se define el rumbo para los próximos episodios.',
      answer: true,
      explain: 'Hacer balance periódico ayuda a quedarse con lo que funcionó y corregir lo que no.',
    },
    {
      type: 'mc',
      prompt: '¿Cuál es una buena práctica de "balance" para tus finanzas personales?',
      options: [
        'Revisar una vez al año tu patrimonio, metas y hábitos',
        'No mirar nunca tus cuentas para no estresarte',
        'Revisar tus inversiones cada hora',
        'Cambiar todas tus metas cada semana',
      ],
      answer: 0,
      explain: 'Una revisión anual es suficiente para ver tendencias y ajustar, sin caer en reaccionar a cada movimiento del mercado.',
    },
    {
      type: 'order',
      prompt: 'Ordena una revisión anual de tus finanzas',
      items: [
        'Mirar dónde estabas hace un año',
        'Comparar con dónde estás hoy',
        'Identificar qué funcionó y qué no',
        'Definir el rumbo del próximo año',
      ],
      explain: 'Comparar con tu propio pasado (y no con otros) te muestra el progreso real y te ayuda a decidir el siguiente paso.',
    },
    {
      type: 'fill',
      sentence: 'El patrimonio es lo que tienes menos lo que ___.',
      options: ['debes', 'ganas', 'gastas'],
      answer: 0,
      explain: 'Activos menos deudas: es la mejor foto de tu situación financiera y la que conviene seguir año a año.',
    },
  ],

  'titulo-no-confirmado-finanzas-en-pareja': [
    {
      type: 'concept',
      title: 'Finanzas claras, amor largo',
      emoji: '💞',
      body: 'Sobre la **comunicación financiera en pareja**: finanzas claras ayudan a mantener el amor. Se propone una **estructura común** para las finanzas (útil también si no tienes pareja) y se explica por qué un **tercero** puede facilitar estas conversaciones.',
    },
    {
      type: 'tf',
      statement: 'En este episodio se plantea que un tercero puede facilitar las conversaciones de plata en pareja.',
      answer: true,
      explain: 'Alguien externo ayuda a bajar la emoción, ordenar la conversación y proponer acuerdos que ambos vean como justos.',
    },
    {
      type: 'match',
      prompt: 'Une cada forma de organizar la plata en pareja con su descripción',
      pairs: [
        ['Todo en común', 'Juntan todos los ingresos y gastos'],
        ['Proporcional', 'Cada uno aporta según lo que gana'],
        ['Cuenta común + personales', 'Pozo compartido y algo de plata propia'],
      ],
    },
    {
      type: 'mc',
      prompt: 'Uno gana $1.500.000 y el otro $1.000.000. Si aportan en forma proporcional a gastos comunes de $1.000.000, ¿cuánto pone quien gana más?',
      options: ['$600.000', '$500.000', '$750.000', '$1.000.000'],
      answer: 0,
      explain: 'Entre ambos ganan $2.500.000; quien gana $1.500.000 aporta el 60% (1,5 ÷ 2,5), o sea $600.000. Así el esfuerzo relativo es el mismo.',
    },
    {
      type: 'fill',
      sentence: 'Hablar de plata con ___ evita malentendidos y peleas.',
      options: ['claridad', 'indirectas', 'secretos'],
      answer: 0,
      explain: 'Acordar reglas explícitas (quién paga qué, cuánto se ahorra) evita que cada uno asuma algo distinto.',
    },
  ],
}
