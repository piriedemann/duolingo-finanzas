import { useState } from 'react'
import { ALL_LESSONS, UNITS } from '../data/units'
import { isLessonUnlocked, openChest, useStore } from '../state/store'
import { go, richText } from '../lib/util'
import { confetti } from '../lib/confetti'
import { sfx } from '../lib/sound'
import { Mascot } from '../components/Mascot'
import { LESSON_EPISODES } from '../data/lessonEpisodes'
import { EPISODES } from '../data/episodes'

const ORDERED = ALL_LESSONS.map((x) => x.lesson.id)
// desplazamiento horizontal en zigzag, como el camino de Duolingo
const OFFSETS = [0, 44, 70, 44, 0, -44, -70, -44]
const CHEST_REWARD = 30

export function Learn() {
  const s = useStore((s) => s)
  const [open, setOpen] = useState<string | null>(null)
  const [guide, setGuide] = useState<string | null>(null)
  const guideUnit = UNITS.find((u) => u.id === guide)
  const currentIndex = ORDERED.findIndex((id) => !s.completed[id])

  return (
    <div className="learn">
      {UNITS.map((unit, ui) => {
        const unitDone = unit.lessons.every((l) => s.completed[l.id])
        const chestId = 'chest-' + unit.id
        const chestReady = unitDone && !s.chests.includes(chestId)
        return (
          <section key={unit.id} className="unit" id={'unidad-' + unit.id}>
            <div className="unit-banner" style={{ background: unit.color, boxShadow: `0 4px 0 ${unit.colorDark}` }}>
              <div>
                <div className="unit-kicker">
                  Unidad {ui + 1} · {unit.animal}
                </div>
                <h2>{unit.title}</h2>
                <p>{unit.description}</p>
              </div>
              <div className="unit-side">
                <div className="unit-emoji">{unit.emoji}</div>
                <button className="guide-btn" onClick={() => setGuide(unit.id)}>
                  📖 Guía
                </button>
              </div>
            </div>

            <div className="path">
              {unit.lessons.map((lesson, li) => {
                const gi = ORDERED.indexOf(lesson.id)
                const done = !!s.completed[lesson.id]
                const unlocked = isLessonUnlocked(s, gi, ORDERED)
                const current = gi === currentIndex
                const off = OFFSETS[(gi + ui) % OFFSETS.length]
                const rec = s.completed[lesson.id]
                return (
                  <div key={lesson.id} className="node-wrap" style={{ transform: `translateX(${off}px)`, zIndex: open === lesson.id ? 12 : undefined }}>
                    {current && open !== lesson.id && <div className="start-tag">EMPEZAR</div>}
                    <button
                      className={'node' + (done ? ' done' : '') + (!unlocked ? ' locked' : '') + (current ? ' current' : '')}
                      style={
                        unlocked
                          ? { background: unit.color, boxShadow: `0 7px 0 ${unit.colorDark}` }
                          : undefined
                      }
                      onClick={() => {
                        sfx.tap()
                        setOpen(open === lesson.id ? null : lesson.id)
                      }}
                      aria-label={lesson.title}
                    >
                      {!unlocked ? '🔒' : done ? (rec?.bestAccuracy === 1 ? '👑' : '✔') : li === unit.lessons.length - 1 ? '🏆' : '⭐'}
                    </button>
                    {open === lesson.id && (
                      <div className="node-pop" style={{ background: unlocked ? unit.color : '#e5e5e5' }}>
                        <div className="pop-title">{lesson.title}</div>
                        <div className="pop-sub">
                          Lección {li + 1} de {unit.lessons.length}
                          {rec && ` · mejor precisión ${Math.round(rec.bestAccuracy * 100)}%`}
                        </div>
                        {unlocked ? (
                          <button className="btn white wide" style={{ color: unit.color }} onClick={() => go('leccion/' + lesson.id)}>
                            {done ? 'Repasar +5 XP' : 'Empezar +10 XP'}
                          </button>
                        ) : (
                          <div className="pop-locked">Completa la lección anterior para desbloquear</div>
                        )}
                        {(LESSON_EPISODES[lesson.id] ?? []).length > 0 && (
                          <div className="pop-eps">
                            🎧 Escucha:{' '}
                            {EPISODES.filter((e) => LESSON_EPISODES[lesson.id].includes(e.id)).map((e) => (
                              <a key={e.id} href={'#/episodio/' + e.id}>
                                {e.number !== null ? '#' + e.number : e.title.slice(0, 18) + '…'}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="node-wrap" style={{ transform: `translateX(${-OFFSETS[(ui * 3) % OFFSETS.length] / 2}px)` }}>
                <button
                  className={'chest' + (chestReady ? ' ready' : '') + (s.chests.includes(chestId) ? ' opened' : '')}
                  disabled={!chestReady}
                  onClick={() => {
                    openChest(chestId, CHEST_REWARD)
                    sfx.finish()
                    confetti(1500)
                  }}
                  title={chestReady ? `¡Abre el cofre! +${CHEST_REWARD} Lucas` : 'Completa la unidad para abrir el cofre'}
                >
                  {s.chests.includes(chestId) ? '📭' : '🎁'}
                </button>
              </div>
              <div className={'path-mascot ' + (ui % 2 ? 'left' : 'right')}>
                {ui === 0 ? <Mascot size={110} mood="wink" /> : <span className="big-animal">{unit.emoji}</span>}
              </div>
            </div>
          </section>
        )
      })}
      {guideUnit && (
        <div className="modal-backdrop" onClick={() => setGuide(null)}>
          <div className="modal guide" onClick={(e) => e.stopPropagation()}>
            <div className="guide-head" style={{ background: guideUnit.color }}>
              <span className="unit-emoji">{guideUnit.emoji}</span>
              <div>
                <div className="unit-kicker">Guía · {guideUnit.animal}</div>
                <h2>{guideUnit.title}</h2>
              </div>
            </div>
            <div className="guide-body">
              {guideUnit.lessons.map((l) => (
                <div key={l.id}>
                  <h3 className="guide-lesson">{l.title}</h3>
                  {l.exercises.map((ex, i) =>
                    ex.type === 'concept' ? (
                      <div key={i} className="guide-card">
                        <strong>
                          {ex.emoji ?? '💡'} {ex.title}
                        </strong>
                        <p>{richText(ex.body)}</p>
                      </div>
                    ) : null,
                  )}
                </div>
              ))}
            </div>
            <button className="btn primary wide" onClick={() => setGuide(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="path-end">
        <Mascot mood="wow" size={120} />
        <h3>¡Más unidades pronto!</h3>
        <p className="muted">Nuevos capítulos del podcast se convierten en lecciones.</p>
      </div>
    </div>
  )
}
