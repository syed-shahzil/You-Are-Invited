import { GROOM, BRIDE } from '../data/wedding'
import { Orn } from './Icons'

export default function Couple() {
  return (
    <section className="couple">
      <i className="fl l" />
      <i className="fl r" />
      <div className="wrap">
        <div className="role rv">GROOM</div>
        <h2 className="name rv">{GROOM}</h2>
        <Orn className="rv" />
        <p className="with rv">with</p>
        <Orn className="rv" />
        <div className="role rv">BRIDE</div>
        <h2 className="name rv">{BRIDE}</h2>
      </div>
    </section>
  )
}
