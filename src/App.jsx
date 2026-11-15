import { useReveal } from './hooks/useReveal'
import { BARAT, WALIMA } from './data/wedding'
import { Defs } from './components/Icons'
import Opening from './components/Opening'
import Couple from './components/Couple'
import Countdown from './components/Countdowns'
import EventCard from './components/EventCard'
import Family from './components/Family'
import Footer from './components/Footer'

export default function App() {
  useReveal()
  return (
    <>
      <Defs />
      <Opening />
      <main>
        <Couple />
        <EventCard event={BARAT} variant="barat" />
        <Countdown event={BARAT} kicker="BARAT COUNTDOWN" />
        <EventCard event={WALIMA} variant="walima" />
        <Countdown event={WALIMA} kicker="WALIMA COUNTDOWN" />
        <Family />
      </main>
      <Footer />
    </>
  )
}
