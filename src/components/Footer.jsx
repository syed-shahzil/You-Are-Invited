import { DEVELOPER } from '../data/wedding'
import { Orn } from './Icons'

export default function Footer() {
  return (
    <footer>
      <Orn id="o2" style={{ color: 'var(--gold)' }} />
      <p>
        Created &amp; Developed by{' '}
        <a href={DEVELOPER.url} target="_blank" rel="noopener noreferrer">
          {DEVELOPER.name}
        </a>
      </p>
    </footer>
  )
}
