import { useState } from 'react'
import { ALL_LESSONS, UNITS } from '../data/units'
import { isLessonUnlocked, openChest, useStore } from '../state/store'
import { go, richText } from '../lib/util'
import { sfx } from '../lib/sound'
import { LESSON_EPISODES } from '../data/lessonEpisodes'
import { EPISODES } from '../data/episodes'
import { BookOpen, Check, Crown, Gift, Headphones, Lock, Play } from '../components/Icons'

const ORDERED = ALL_LESSONS.map((x) => x.lesson.id)
const CHEST_REWARD = 30

export function Learn() {
  const s = useStore((s) => s)
  const [guide, setGuide] = useState<string | null>(null)
  const guideUnit = UNITS.find((u) => u.id === guide)
  const currentIndex = ORDERED.findIndex((id) => !s.completed[id])

  return (
    <div className="learn">
      {UNITS.map((unit, ui) => {
        const doneCount = unit.lessons.filter((l) => s.completed[l.id]).length
        const unitDone = doneCount === unit.lessons.length
        const chestId = 'chest-' + unit.id
        const chestOpened = s.chests.includes(chestId)
        return (
          <section key={unit.id} className="unit" id={'unidad-' + unit.id} style={{ ['--u' as string]: unit.color }}>
            <header className="unit-head">
              <div className="unit-symbol" aria-hidden>
                {unit.emoji}
              </div>
              <div className="grow">
                <div className="unit-kicker">
                  Unidad {ui + 1} · {unit.animal}
                </div>
                <h2>{unit.title}</h2>
                <p>{unit.description}</p>
                <div className="unit-progress">
                  <div className="bar thin">
                    <div className="bar-fill" style={{ width: `${(doneCount / unit.lessons.length) * 100}%`, background: unit.color }} />
                  </div>
                  <span className="muted small">
                    {doneCount}/{unit.lessons.length}
                  </span>
                </div>
              </div>
              <button className="btn small ghost guide-btn" onClick={() => setGuide(unit.id)}>
                <BookOpen size={16} /> Guía
              </button>
            </header>

            <ol className="track">
              {unit.lessons.map((lesson, li) => {
                const gi = ORDERED.indexOf(lesson.id)
                const rec = s.completed[lesson.id]
                const unlocked = isLessonUnlocked(s, gi, ORDERED)
                const current = gi === currentIndex
                const graded = lesson.exercises.filter((e) => e.type !== 'concept').length
                const minutes = Math.max(3, Math.round(lesson.exercises.length * 0.5))
                const eps = EPISODES.filter((e) => (LESSON_EPISODES[lesson.id] ?? []).includes(e.id))
                return (
                  <li key={lesson.id} className={'step' + (rec ? ' done' : '') + (!unlocked ? ' locked' : '') + (current ? ' current' : '')}>
                    <div className="step-dot">
                      {!unlocked ? <Lock size={16} /> : rec ? rec.bestAccuracy === 1 ? <Crown size={17} /> : <Check size={18} /> : li + 1}
                    </div>
                    <button
                      className="step-card"
                      disabled={!unlocked}
                      onClick={() => {
                        sfx.tap()
                        go('leccion/' + lesson.id)
                      }}
                    >
                      <div className="grow">
                        <div className="step-title">{lesson.title}</div>
                        <div className="step-meta">
                          {minutes} min · {graded} ejercicios
                          {rec && ` · mejor ${Math.round(rec.bestAccuracy * 100)}%`}
                        </div>
                        {eps.length > 0 && (
                          <div className="step-eps">
                            <Headphones size={13} />
                            {eps.map((e) => (e.number !== null ? '#' + e.number : e.title.slice(0, 22) + '…')).join(' · ')}
                          </div>
                        )}
                      </div>
                      {unlocked && (
                        <span className={'step-cta' + (current ? ' primary' : '')}>
                          {current ? (
                            <>
                              <Play size={14} /> Empezar
                            </>
                          ) : rec ? (
                            'Repasar'
                          ) : (
                            'Abrir'
                          )}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
              <li className={'step chest-step' + (unitDone ? ' done' : ' locked')}>
                <div className="step-dot">
                  <Gift size={16} />
                </div>
                <div className="chest-row">
                  <span className="muted small">
                    {chestOpened ? `Recompensa cobrada · +${CHEST_REWARD} Lucas` : unitDone ? 'Unidad completa' : 'Completa la unidad para desbloquear la recompensa'}
                  </span>
                  {unitDone && !chestOpened && (
                    <button
                      className="btn small gold"
                      onClick={() => {
                        openChest(chestId, CHEST_REWARD)
                        sfx.finish()
                      }}
                    >
                      Cobrar +{CHEST_REWARD} Lucas
                    </button>
                  )}
                </div>
              </li>
            </ol>
          </section>
        )
      })}

      {guideUnit && (
        <div className="modal-backdrop" onClick={() => setGuide(null)}>
          <div className="modal guide" onClick={(e) => e.stopPropagation()} style={{ ['--u' as string]: guideUnit.color }}>
            <div className="guide-head">
              <div className="unit-kicker">Guía · {guideUnit.animal}</div>
              <h2>{guideUnit.title}</h2>
            </div>
            <div className="guide-body">
              {guideUnit.lessons.map((l) => (
                <div key={l.id}>
                  <h3 className="guide-lesson">{l.title}</h3>
                  {l.exercises.map((ex, i) =>
                    ex.type === 'concept' ? (
                      <div key={i} className="guide-card">
                        <strong>{ex.title}</strong>
                        <p>{richText(ex.body)}</p>
                      </div>
                    ) : null,
                  )}
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="btn primary wide" onClick={() => setGuide(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="path-end muted small">Nuevas unidades se suman a medida que salen episodios.</p>
    </div>
  )
}
