import type { Exercise } from '../types'

/**
 * Taller Animales Financieros × Fundación Educación 2020 (1 de octubre 2026).
 * Tres módulos: primero la historia (en vivo), después las preguntas, y recién en la
 * última pregunta le ponemos nombre al concepto. Por eso los enunciados evitan nombrarlo.
 */

export interface WorkshopModule {
  id: string
  order: number
  emoji: string
  title: string // lo que ve el participante antes de responder (sin nombrar el concepto)
  concept: string // el nombre, se revela al terminar
  color: string
  exercises: Exercise[]
}

export const WORKSHOP = {
  id: 'e2020',
  name: 'Taller Educación 2020',
  org: 'Fundación Educación 2020',
  date: '1 de octubre 2026',
  /** Desafío de una semana: quien más XP junte gana. Fechas inclusivas (hora local). */
  challengeStart: '2026-10-01',
  challengeEnd: '2026-10-08',
  prize: '$50.000',
}

export const MODULES: WorkshopModule[] = [
  {
    id: 'inflacion',
    order: 1,
    emoji: '🎈',
    title: 'Módulo 1: La luca de antes',
    concept: 'Inflación',
    color: '#b3413a',
    exercises: [
      {
        type: 'mc',
        prompt: 'Hace 10 años, con $1.000 comprabas un pan grande y una bebida. Hoy, con esos mismos $1.000, ¿qué pasa?',
        options: ['Compro menos cosas que antes', 'Compro lo mismo: la plata no cambia', 'Compro más, porque hay más productos'],
        answer: 0,
        explain: 'Los precios suben con el tiempo y la misma plata alcanza para menos. Ese es el efecto que estamos viendo.',
      },
      {
        type: 'tf',
        statement: 'Si guardo $100.000 en efectivo debajo del colchón durante 5 años, cuando los saque van a comprar lo mismo que hoy.',
        answer: false,
        explain: 'Serán los mismos $100.000, pero comprarán menos porque los precios habrán subido. La plata quieta pierde valor.',
      },
      {
        type: 'mc',
        prompt: 'Recibes la segunda cuota del aporte en octubre y parte la vas a usar en marzo. ¿Qué opción protege mejor esa plata mientras tanto?',
        options: [
          'Dejarla en una cuenta de ahorro o depósito a plazo que pague interés',
          'Guardarla en efectivo en la casa',
          'Dejarla en la Cuenta RUT, que no paga interés',
          'Gastarla ahora en cualquier cosa, por si sube de precio',
        ],
        answer: 0,
        explain:
          'Herramientas simples del sistema formal (cuenta de ahorro, depósito a plazo) pagan un interés que compensa parte de la subida de precios. La Cuenta RUT sirve para mover plata, no para guardarla meses.',
      },
      {
        type: 'fill',
        sentence: 'Cuando los precios suben y la misma plata alcanza para menos, a eso se le llama ___.',
        options: ['inflación', 'interés', 'deflación', 'devaluación'],
        answer: 0,
        explain: 'Ese es el nombre. Lo que acaban de ver es la inflación: la plata quieta pierde poder de compra.',
      },
    ],
  },
  {
    id: 'diversificacion',
    order: 2,
    emoji: '🧺',
    title: 'Módulo 2: Una sola canasta',
    concept: 'Diversificación',
    color: '#b3862c',
    exercises: [
      {
        type: 'mc',
        prompt: 'Daniela vende completos en la feria y es su único ingreso. Un mes, la feria se suspende por lluvia tres fines de semana seguidos. ¿Qué le pasa a Daniela?',
        options: ['Se queda casi sin ingresos ese mes', 'No le afecta: siempre puede vender después', 'Gana más, porque la gente tiene más hambre'],
        answer: 0,
        explain: 'Cuando todo depende de una sola fuente y esa fuente falla, no hay nada que amortigüe el golpe.',
      },
      {
        type: 'mc',
        prompt: '¿Cuál de estas personas está mejor protegida si algo sale mal?',
        options: [
          'Quien trabaja medio tiempo y además hace clases particulares',
          'Quien tiene un solo trabajo muy bien pagado',
          'Quien depende solo del aporte del programa',
        ],
        answer: 0,
        explain: 'No es que ganar más no importe. Es que depender de una sola fuente te deja sin red si esa fuente falla.',
      },
      {
        type: 'tf',
        statement: 'Prestarle todos mis ahorros a un solo amigo para su negocio es más riesgoso que repartirlos en varias cosas distintas.',
        answer: true,
        explain: 'Si ese único negocio falla, pierdes todo. Repartido, un golpe no se lleva el total.',
      },
      {
        type: 'mc',
        prompt: 'Sabes usar Excel, has atendido público y estás estudiando tu carrera. ¿Por qué eso también es "repartir el riesgo"?',
        options: [
          'Porque si una puerta se cierra, tienes otras habilidades con que ganar plata',
          'Porque saber más cosas siempre significa un sueldo más alto',
          'No tiene relación: repartir el riesgo es solo con la plata',
        ],
        answer: 0,
        explain: 'La idea aplica a la plata, a los ingresos y a las habilidades. Más puertas abiertas, menos dependencia de una sola.',
      },
      {
        type: 'fill',
        sentence: 'No poner todos los huevos en la misma canasta, en finanzas, se llama ___.',
        options: ['diversificación', 'inflación', 'especulación', 'ahorro'],
        answer: 0,
        explain: 'Ese es el nombre: diversificar. Repartir para que ningún golpe te saque del juego.',
      },
    ],
  },
  {
    id: 'compuesto',
    order: 3,
    emoji: '♟️',
    title: 'Módulo 3: El tablero de ajedrez',
    concept: 'Interés compuesto',
    color: '#2f6f4f',
    exercises: [
      {
        type: 'mc',
        prompt: 'En un tablero de ajedrez pones $1.000.000 en la primera casilla y en cada casilla siguiente el doble de la anterior. ¿En qué casilla se pasa de los mil millones?',
        options: ['Casilla 11', 'Casilla 32', 'Casilla 64', 'Nunca: faltan casillas'],
        answer: 0,
        explain: '1, 2, 4, 8, 16… en la casilla 11 ya son 1.024 millones. Nuestro cerebro no está hecho para imaginar ese crecimiento.',
      },
      {
        type: 'tf',
        statement: 'Mejorar un 1% cada día durante un año te deja más o menos un 30% mejor que al inicio.',
        answer: false,
        explain: 'Es cerca de 37 veces mejor, no un 37%. Cada mejora se construye sobre la anterior. Lo mismo pasa con lo que entra a tu cabeza en la micro.',
      },
      {
        type: 'mc',
        prompt: 'El mismo mecanismo también puede jugar en contra. ¿En cuál de estos casos?',
        options: [
          'Una deuda que no se paga y va sumando intereses sobre intereses',
          'Un ahorro que gana interés todos los meses',
          'Un libro que lees de a poco cada día',
        ],
        answer: 0,
        explain: 'Una deuda que no se paga crece igual de rápido que un ahorro, pero en contra tuya. Mismo tablero, otra dirección.',
      },
      {
        type: 'mc',
        prompt: 'Vas bien con tu ahorro y de repente pierdes un ingreso por dos meses. ¿Qué te ayuda a no salirte del juego?',
        options: ['Tener un pequeño fondo de emergencia guardado', 'Pedir un crédito de consumo rápido', 'Dejar de ahorrar para siempre'],
        answer: 0,
        explain: 'Van a pasar cosas. Un fondo de emergencia es la red que permite seguir en el juego sin endeudarse.',
      },
      {
        type: 'fill',
        sentence: 'Cuando lo que ganas (en plata o en conocimiento) vuelve a generar más, y el crecimiento se acelera con el tiempo, se llama ___.',
        options: ['interés compuesto', 'interés simple', 'inflación', 'presupuesto'],
        answer: 0,
        explain: 'Ese es el nombre: interés compuesto. Pequeños pasos constantes, en la plata y en la cabeza, se multiplican.',
      },
    ],
  },
]
