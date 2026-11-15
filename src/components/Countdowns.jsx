import { useCountdown } from '../hooks/useCountdown'
import { Orn } from './Icons'

const two = (n) => String(n).padStart(2, '0')

function Panel({ value, label }) {
  return (
    <div className="cd-panel">
      <span className="cd-num">{value}</span>
      <span className="cd-lbl">{label}</span>
    </div>
  )
}

// One countdown, shown directly after its own event card.
export default function Countdown({ event, kicker }) {
  const t = useCountdown(event.target)
  return (
    <section className="cd-section" id={`${event.id}-countdown`}>
      <div className="cd-card rv">
        <div className="cd-kicker">{kicker}</div>
        <div className="cd-date">{event.date}</div>
        <Orn id="o2" />
        {t.done ? (
          <p className="cd-done" role="status">
            The celebrations have begun!
          </p>
        ) : (
          <div
            className="cd-grid"
            role="timer"
            aria-label={`${kicker}: ${t.days} days ${t.hours} hours ${t.minutes} minutes ${t.seconds} seconds remaining`}
          >
            <Panel value={two(t.days)} label="DAYS" />
            <Panel value={two(t.hours)} label="HOURS" />
            <Panel value={two(t.minutes)} label="MINUTES" />
            <Panel value={two(t.seconds)} label="SECONDS" />
          </div>
        )}
      </div>
    </section>
  )
}
