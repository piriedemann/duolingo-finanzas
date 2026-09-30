import type { Unit } from '../types'

export const unit: Unit = {
  id: 'tortuga',
  animal: 'La Tortuga',
  emoji: '🐢',
  color: '#1cb0f6',
  colorDark: '#1899d6',
  title: 'Lento pero seguro: la magia del largo plazo',
  description: 'La Tortuga te enseña cómo el interés compuesto y la paciencia le ganan a la liebre apurada.',
  lessons: [
    {
      id: 'tortuga-1',
      title: 'Interés simple vs compuesto',
      exercises: [
        {
          type: 'concept',
          title: 'Interés simple',
          emoji: '➕',
          body: 'Con **interés simple** ganas intereses solo sobre la plata que pusiste al inicio. Si inviertes $1.000.000 al 5% simple anual, ganas **$50.000 cada año**, siempre lo mismo.',
        },
        {
          type: 'concept',
          title: 'Interés compuesto: la bola de nieve',
          emoji: '⛄',
          body: 'Con **interés compuesto**, los intereses que ganas se suman al capital y **al año siguiente también generan intereses**. Es "interés sobre interés": al principio parece igual, pero con los años la diferencia se vuelve enorme.',
        },
        {
          type: 'tf',
          statement: 'Con interés compuesto, la plata crece la misma cantidad de pesos cada año.',
          answer: false,
          explain: 'Como el capital va creciendo, el interés de cada año se calcula sobre un monto mayor y la ganancia en pesos aumenta.',
        },
        {
          type: 'fill',
          sentence: 'El interés compuesto es ganar interés sobre el ___.',
          options: ['interés ya ganado', 'sueldo bruto', 'impuesto', 'crédito'],
          answer: 0,
          explain: 'Reinvertir lo ganado hace que tu base crezca, y así cada año el crecimiento es un poco mayor.',
        },
        {
          type: 'match',
          prompt: 'Une cada concepto con su descripción',
          pairs: [
            ['Capital', 'La plata que inviertes al inicio'],
            ['Tasa de interés', 'El porcentaje que ganas por período'],
            ['Interés simple', 'Se calcula solo sobre el capital inicial'],
            ['Interés compuesto', 'Se calcula sobre capital + intereses acumulados'],
          ],
        },
        {
          type: 'mc',
          prompt: '¿Qué ingrediente hace MÁS poderoso al interés compuesto?',
          options: ['El tiempo', 'Revisar la inversión todos los días', 'Cambiar de inversión seguido', 'Invertir solo en diciembre'],
          answer: 0,
          explain: 'El efecto de "interés sobre interés" se acelera con los años; mientras más tiempo, más se nota la curva.',
        },
        {
          type: 'tf',
          statement: 'El interés compuesto también funciona en tu contra cuando tienes deudas que no pagas.',
          answer: true,
          explain: 'En una deuda impaga los intereses se suman al saldo y generan más intereses, igual que en una inversión pero al revés.',
        },
      ],
    },
    {
      id: 'tortuga-2',
      title: 'La regla del 72 y empezar temprano',
      exercises: [
        {
          type: 'concept',
          title: 'La regla del 72',
          emoji: '✌️',
          body: 'Un truco para calcular de cabeza: **divide 72 por la tasa de interés anual** y obtienes cuántos años tarda tu plata en **duplicarse**. Al 8% anual: 72 ÷ 8 = **9 años**. Es una aproximación, pero funciona muy bien para tasas entre 4% y 12%.',
        },
        {
          type: 'mc',
          prompt: 'Usando la regla del 72, ¿qué tasa necesitas para duplicar tu plata en 8 años?',
          options: ['9%', '8%', '12%', '6%'],
          answer: 0,
          explain: 'La regla funciona en ambos sentidos: 72 ÷ 8 años = 9% anual.',
        },
        {
          type: 'concept',
          title: 'Empezar temprano le gana a poner más',
          emoji: '⏰',
          body: '**Ana** invierte $100.000 al mes desde los 25 hasta los 35 y luego no pone más. **Beto** parte a los 35 y pone $100.000 al mes hasta los 65. Con un 7% anual, Ana aporta $12 millones y Beto $36 millones... pero **Ana termina con más plata** a los 65. Sus primeros años tuvieron más tiempo para componerse.',
        },
        {
          type: 'tf',
          statement: 'En el ejemplo, Ana aportó tres veces menos que Beto y aun así terminó con más plata.',
          answer: true,
          explain: 'Cada peso que Ana invirtió a los 25 tuvo 40 años para crecer; los de Beto tuvieron como máximo 30.',
        },
        {
          type: 'mc',
          prompt: 'La Fran tiene 23 años y gana $700.000. Cree que "invertir es para cuando gane más". ¿Qué le dirías?',
          options: [
            'Que empiece con poco ahora: el tiempo vale más que el monto',
            'Que espere a ganar $2.000.000 para que valga la pena',
            'Que invierta todo su sueldo de una vez',
          ],
          answer: 0,
          feedback: [
            '¡Así es! Montos chicos con muchos años pueden superar montos grandes con pocos años.',
            'Esperar le hace perder los años más valiosos del interés compuesto.',
            'Primero necesita cubrir gastos y un fondo de emergencia; invertir no es dejarse sin plata.',
          ],
          explain: 'El tiempo es el multiplicador principal del interés compuesto, y es lo único que no se puede recuperar después.',
        },
        {
          type: 'fill',
          sentence: 'Según la regla del 72, al 12% anual la plata se duplica en unos ___ años.',
          options: ['6', '12', '8', '72'],
          answer: 0,
          explain: '72 ÷ 12 = 6. Mientras mayor la tasa, más rápido se duplica.',
        },
        {
          type: 'order',
          prompt: 'Ordena de MÁS rápido a MÁS lento en duplicar la plata',
          items: ['Rentabilidad de 12% anual', 'Rentabilidad de 9% anual', 'Rentabilidad de 6% anual', 'Rentabilidad de 3% anual'],
          explain: 'Con la regla del 72: 6, 8, 12 y 24 años respectivamente. Una tasa más alta duplica antes.',
        },
      ],
    },
    {
      id: 'tortuga-3',
      title: 'Los enemigos silenciosos: inflación y comisiones',
      exercises: [
        {
          type: 'concept',
          title: 'La inflación se come tu plata',
          emoji: '🎈',
          body: 'La **inflación** es la subida general de precios. Si tu plata está quieta en la cuenta, cada año compra menos. Por eso importa la **rentabilidad real**: lo que ganas **descontando la inflación**. Aproximación: rentabilidad real ≈ rentabilidad nominal − inflación.',
        },
        {
          type: 'tf',
          statement: 'Si un depósito te da 3% al año y la inflación es 5%, en realidad estás perdiendo poder de compra.',
          answer: true,
          explain: 'Tu plata crece 3% pero las cosas suben 5%, así que al final del año puedes comprar menos que antes.',
        },
        {
          type: 'concept',
          title: 'Las comisiones también se componen',
          emoji: '🐜',
          body: 'Una comisión de "solo 1%" al año parece poco, pero se descuenta **todos los años sobre todo tu saldo**. En 30 años puede llevarse una parte enorme del resultado. Comparar costos es de las decisiones más rentables que puedes tomar.',
        },
        {
          type: 'match',
          prompt: 'Une cada concepto',
          pairs: [
            ['Inflación', 'Subida general de precios'],
            ['Rentabilidad nominal', 'Lo que gana tu inversión sin ajustar'],
            ['Rentabilidad real', 'Lo que ganas descontando la inflación'],
            ['Comisión', 'Costo que te cobra quien administra tu plata'],
          ],
        },
        {
          type: 'mc',
          prompt: 'Dos fondos invierten en lo mismo. Uno cobra 0,5% anual y el otro 2% anual. A 20 años, ¿cuál conviene?',
          options: ['El de 0,5%', 'El de 2%, porque cobrar más significa que es mejor', 'Da lo mismo, la diferencia es chica'],
          answer: 0,
          explain: 'Si invierten en lo mismo, obtienen retornos parecidos antes de costos; la diferencia de comisión se compone año tras año a tu favor.',
        },
        {
          type: 'fill',
          sentence: 'La paciencia es clave: el interés compuesto funciona mejor cuando ___ la inversión por muchos años.',
          options: ['no tocas', 'retiras seguido', 'cambias cada mes', 'revisas cada hora'],
          answer: 0,
          explain: 'Cada retiro corta la bola de nieve y hace que esa plata deje de componerse.',
        },
        {
          type: 'tf',
          statement: 'Guardar todos tus ahorros de largo plazo bajo el colchón es la opción más segura para no perder valor.',
          answer: false,
          explain: 'Bajo el colchón la plata no crece y la inflación la va haciendo valer menos cada año.',
        },
      ],
    },
  ],
}
