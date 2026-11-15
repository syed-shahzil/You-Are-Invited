import { useEffect, useRef } from 'react'
import { FRAME_COUNT, FPS, loadFrame, warmCache } from '../lib/frames'

const HOLD_MS = 1200
const LOOKAHEAD = 16

export default function Opening() {
  const hero = useRef(null)
  const canvas = useRef(null)
  const btn = useRef(null)
  const hint = useRef(null)

  useEffect(() => {
    const h = document.documentElement
    const ctx = canvas.current.getContext('2d')
    const heroEl = hero.current
    const btnEl = btn.current
    const hintEl = hint.current
    // Background music (10 s clip, loops). File: public/audio/music.m4a
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/music.m4a`)
    audio.loop = true
    audio.volume = 0.6
    audio.preload = 'auto'
    const bm = {}
    let started = false
    let ready = false
    let holding = false
    let holdStart = 0
    let holdRaf = 0
    let playRaf = 0
    let hintTimer = 0
    let alive = true
    let scrollHandler = null

    const dec = (i) => {
      if (i >= FRAME_COUNT || i in bm) return
      bm[i] = null
      loadFrame(i).then(
        (b) => {
          if (alive) bm[i] = b
          else if (b.close) b.close()
        },
        () => delete bm[i]
      )
    }
    const ahead = (i) => {
      for (let k = i; k < i + LOOKAHEAD; k++) dec(k)
    }
    const freeBefore = (i) => {
      for (const k in bm) {
        if (+k < i - 1) {
          const b = bm[k]
          if (b && b.close) b.close()
          delete bm[k]
        }
      }
    }
    const draw = (b) => ctx.drawImage(b, 0, 0, 640, 360)

    // Block touch/wheel scrolling while locked.
    const stop = (e) => {
      if (h.classList.contains('lock') && e.cancelable) e.preventDefault()
    }
    document.addEventListener('touchmove', stop, { passive: false })
    document.addEventListener('wheel', stop, { passive: false })

    // Show frame 1 and start warming the next frames.
    ahead(0)
    let waitT = 0
    const waitFirst = () => {
      if (!alive) return
      if (bm[0]) {
        draw(bm[0])
        ready = true
        btnEl.classList.remove('loading')
        stopWarm = warmCache(LOOKAHEAD)
      } else waitT = setTimeout(waitFirst, 40)
    }
    let stopWarm = () => {}
    waitFirst()

    const prog = (p) => btnEl.style.setProperty('--p', p)
    const tick = () => {
      const p = Math.min(1, (performance.now() - holdStart) / HOLD_MS)
      prog(p)
      if (p >= 1) {
        holding = false
        play()
        return
      }
      holdRaf = requestAnimationFrame(tick)
    }
    const down = (e) => {
      if (started || !ready || holding) return
      if (e && e.cancelable) e.preventDefault()
      holding = true
      holdStart = performance.now()
      btnEl.classList.add('holding')
      // Start music on the press itself: phones only allow sound after a touch.
      audio.play().catch(() => {})
      ahead(0)
      tick()
    }
    const up = () => {
      if (!holding) return
      holding = false
      cancelAnimationFrame(holdRaf)
      btnEl.classList.remove('holding')
      audio.pause() // released too early: stop and rewind
      audio.currentTime = 0
      prog(0)
      hintEl.classList.add('on')
      clearTimeout(hintTimer)
      hintTimer = setTimeout(() => hintEl.classList.remove('on'), 1600)
    }
    const onPointerDown = (e) => {
      try {
        btnEl.setPointerCapture(e.pointerId)
      } catch (x) {}
      down(e)
    }
    const onKeyDown = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e)
    }
    const onKeyUp = (e) => {
      if (e.key === ' ' || e.key === 'Enter') up()
    }
    const noMenu = (e) => e.preventDefault()
    btnEl.addEventListener('pointerdown', onPointerDown)
    btnEl.addEventListener('pointerup', up)
    btnEl.addEventListener('pointercancel', up)
    btnEl.addEventListener('lostpointercapture', up)
    btnEl.addEventListener('contextmenu', noMenu)
    btnEl.addEventListener('keydown', onKeyDown)
    btnEl.addEventListener('keyup', onKeyUp)

    function play() {
      started = true
      hintEl.classList.remove('on')
      heroEl.classList.add('playing')
      let t0 = performance.now()
      let prev = t0
      let last = -1
      const step = (now) => {
        if (!alive) return
        const i = Math.min(FRAME_COUNT - 1, Math.floor(((now - t0) * FPS) / 1000))
        ahead(i)
        if (i > last) {
          const b = bm[i]
          if (b) {
            draw(b)
            last = i
            freeBefore(i)
          } else t0 += now - prev // wait for the frame instead of skipping it
        }
        prev = now
        if (last >= FRAME_COUNT - 1) return finish()
        playRaf = requestAnimationFrame(step)
      }
      playRaf = requestAnimationFrame(step)
    }

    function finish() {
      heroEl.classList.remove('playing')
      heroEl.classList.add('done')
      h.classList.remove('lock')
      setTimeout(() => {
        for (const k in bm) {
          const b = bm[k]
          if (b && b.close) b.close()
        }
      }, 500)
      scrollHandler = () => {
        if (window.scrollY > 40) {
          heroEl.classList.add('scrolled')
          window.removeEventListener('scroll', scrollHandler)
        }
      }
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }

    return () => {
      alive = false
      clearTimeout(waitT)
      clearTimeout(hintTimer)
      cancelAnimationFrame(holdRaf)
      cancelAnimationFrame(playRaf)
      stopWarm()
      audio.pause()
      document.removeEventListener('touchmove', stop)
      document.removeEventListener('wheel', stop)
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
      btnEl.removeEventListener('pointerdown', onPointerDown)
      btnEl.removeEventListener('pointerup', up)
      btnEl.removeEventListener('pointercancel', up)
      btnEl.removeEventListener('lostpointercapture', up)
      btnEl.removeEventListener('contextmenu', noMenu)
      btnEl.removeEventListener('keydown', onKeyDown)
      btnEl.removeEventListener('keyup', onKeyUp)
      for (const k in bm) {
        const b = bm[k]
        if (b && b.close) b.close()
      }
    }
  }, [])

  return (
    <header className="hero" ref={hero}>
      <div className="stage">
        <canvas
          ref={canvas}
          id="fg"
          width="640"
          height="360"
          role="img"
          aria-label="A royal maroon invitation envelope that opens to a floral wedding invitation card"
        />
      </div>
      <div className="hint cz" ref={hint} role="status">
        Keep holding to open
      </div>
      <button className="open loading" ref={btn} type="button" aria-label="Long press to open invitation">
        <span className="fill" />
        <span className="t">LONG PRESS TO OPEN INVITATION</span>
      </button>
      <div className="cue" aria-hidden="true">
        SCROLL<i />
      </div>
    </header>
  )
}
