import { FAMILY } from '../data/wedding'
import { Orn } from './Icons'

export default function Family() {
  return (
    <section className="family">
      <i className="fl l" />
      <i className="fl r" />
      <div className="wrap">
        <div className="role rv">INVITED BY</div>
        <Orn className="rv" />
        <p className="fam rv">{FAMILY}</p>
      </div>
    </section>
  )
}
