import { Orn, Sprig, PinIcon } from './Icons'

function Node({ emoji }) {
  return (
    <span className="node">
      <span className="disc">{emoji}</span>
    </span>
  )
}

export default function EventCard({ event, variant }) {
  const spr = variant === 'walima' ? 'sp2' : 'sp1'
  return (
    <section className={`event ${variant}`} id={event.id}>
      <div className="card rv">
        <svg className="finial" viewBox="0 0 90 30" aria-hidden="true">
          <use href="#fin" />
        </svg>
        {['a', 'b', 'c2', 'd'].map((k) => (
          <svg key={k} className={`c ${k}`} aria-hidden="true">
            <use href="#cn" />
          </svg>
        ))}
        <h2>{event.title}</h2>
        <p className="date">{event.date}</p>
        <Orn id={variant === 'walima' ? 'o2' : 'o1'} />

        <div className="tl-wrap">
          <Sprig id={spr} side="l" pos="top" />
          <Sprig id={spr} side="r" pos="top" />
          <ol className="tl">
            {event.items.map((it) => (
              <li key={it.time + it.label}>
                <Node emoji={it.emoji} />
                <span className="tm">{it.time}</span>
                {it.label && <span className="ev">{it.label}</span>}
              </li>
            ))}
            <li>
              <Sprig id={spr} side="l" pos="bot" />
              <Sprig id={spr} side="r" pos="bot" />
              <Node emoji="📍" />
              <span className="k">VENUE</span>
              <span className="n">{event.venue.name}</span>
              <span className="ad">{event.venue.address}</span>
            </li>
          </ol>
        </div>

        <a className="map" href={event.mapUrl} target="_blank" rel="noopener noreferrer">
          <PinIcon />
          <span>{event.mapLabel}</span>
        </a>
      </div>
    </section>
  )
}
