import { useEffect, useRef, useState } from 'react'
import { FRAME_COUNT, FPS, loadFrame, warmCache } from '../lib/frames'

const HOLD_MS = 1200
const LOOKAHEAD = 16

export default function Opening() {
  const hero = useRef(null)
  const canvas = useRef(null)
  const btn = useRef(null)
  const hint = useRef(null)
  const ctl = useRef({ toggle: () => {} })
  const [showSound, setShowSound] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [dbgLines, setDbgLines] = useState([])

  useEffect(() => {
    const h = document.documentElement
    const ctx = canvas.current.getContext('2d')
    const heroEl = hero.current
    const btnEl = btn.current
    const hintEl = hint.current
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

    // ---------- Background music (public/audio/music.m4a, 10 s, loops) ----------
    // Browsers only allow sound after a "real" gesture (on phones that means the
    // finger LIFTING, not touching down). So we: (1) try immediately, (2) if blocked,
    // retry on every following tap/touch-end/key press until it plays, (3) reload with a
    // fresh URL if the file fails to load, and (4) resume if the tab/phone interrupts it.
    const MUSIC_URL = `${import.meta.env.BASE_URL}audio/music.m4a`
    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.6
    audio.preload = 'auto'
    audio.setAttribute('playsinline', '')
    audio.src = MUSIC_URL
    // Open the site with #audio-debug at the end of the URL to see what the audio is doing.
    const dbg = window.location.hash.includes('audio-debug')
    const log = (m) => {
      if (dbg) setDbgLines((l) => [...l.slice(-7), m])
    }
    if (dbg) {
      log('url: ' + audio.src)
      fetch(MUSIC_URL, { method: 'HEAD' })
        .then((r) => log('file: HTTP ' + r.status + ' ' + (r.headers.get('content-type') || '')))
        .catch((e) => log('file fetch failed: ' + e.message))
    }
    let wantMusic = false
    let armed = false
    let loadTries = 0
    let loadTimer = 0
    const GESTURES = ['pointerup', 'touchend', 'click', 'keydown']
    const onGesture = () => {
      if (wantMusic && audio.paused) tryPlay()
    }
    const arm = () => {
      if (armed) return
      armed = true
      GESTURES.forEach((n) => document.addEventListener(n, onGesture, true))
    }
    const disarm = () => {
      if (!armed) return
      armed = false
      GESTURES.forEach((n) => document.removeEventListener(n, onGesture, true))
    }
    const tryPlay = () => {
      if (!wantMusic || !alive) return
      const p = audio.play()
      if (p && p.catch) {
        p.catch((e) => {
          log('play blocked: ' + e.name)
          if (wantMusic && alive) arm() // blocked: wait for the next real gesture
        })
      }
    }
    const startMusic = () => {
      wantMusic = true
      tryPlay()
    }
    const stopMusic = () => {
      wantMusic = false
      disarm()
      audio.pause()
      try {
        audio.currentTime = 0
      } catch (e) {}
    }
    const onPlaying = () => {
      log('playing')
      setSoundOn(true)
      disarm()
    }
    const onPaused = () => {
      log('paused')
      setSoundOn(false)
      // paused by the system (call, tab switch) while we still want music
      if (wantMusic && alive) arm()
    }
    const onCanPlay = () => log('can play (file loaded)')
    const onAudioError = () => {
      const er = audio.error
      log('audio error: code ' + (er ? er.code : '?') + ' (3=cannot decode, 4=file missing/unsupported)')
      if (!alive || loadTries >= 3) return
      loadTries++
      clearTimeout(loadTimer)
      loadTimer = setTimeout(() => {
        audio.src = `${MUSIC_URL}?retry=${loadTries}` // fresh URL bypasses a bad cached copy
        audio.load()
        if (wantMusic) tryPlay()
      }, 500 * loadTries)
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible' && wantMusic && audio.paused) tryPlay()
    }
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPaused)
    audio.addEventListener('error', onAudioError)
    document.addEventListener('visibilitychange', onVisible)
    ctl.current.toggle = () => {
      if (audio.paused) {
        wantMusic = true
        audio.play().catch((e) => log('button play failed: ' + e.name))
      } else {
        wantMusic = false
        disarm()
        audio.pause()
      }
    }
    const cleanupMusic = () => {
      stopMusic()
      clearTimeout(loadTimer)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPaused)
      audio.removeEventListener('error', onAudioError)
      document.removeEventListener('visibilitychange', onVisible)
      audio.removeAttribute('src')
      audio.load()
    }

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
      startMusic() // may be blocked until the finger lifts; retried automatically
      ahead(0)
      tick()
    }
    const up = () => {
      if (!holding) return
      holding = false
      cancelAnimationFrame(holdRaf)
      btnEl.classList.remove('holding')
      stopMusic() // released too early: stop and rewind
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
      setShowSound(true)
      startMusic() // keep trying until it plays (finger lift / next tap unlocks it)
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
      cleanupMusic()
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

  const btnStyle = {
    position: 'fixed',
    top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
    right: 12,
    zIndex: 50,
    width: 46,
    height: 46,
    borderRadius: '50%',
    border: '1px solid #e8cf92',
    background: 'linear-gradient(#a42b3e, #561823)',
    boxShadow: '0 0 0 3px #2a0b12, 0 0 0 4px #c9a45c, 0 8px 16px rgba(0,0,0,.5)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    padding: 0
  }
  return (
    <>
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
    {showSound && (
      <button
        type="button"
        style={btnStyle}
        onClick={() => ctl.current.toggle()}
        aria-label={soundOn ? 'Mute music' : 'Play music'}
        title={soundOn ? 'Mute music' : 'Play music'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8cf92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#e8cf92" />
          {soundOn ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
        </svg>
      </button>
    )}
    {dbgLines.length > 0 && (
      <pre style={{ position: 'fixed', left: 8, top: 8, zIndex: 60, pointerEvents: 'none', margin: 0, padding: '6px 8px', background: 'rgba(0,0,0,.8)', color: '#9f9', font: '11px/1.4 monospace', maxWidth: '92vw', whiteSpace: 'pre-wrap' }}>
        {dbgLines.join('\n')}
      </pre>
    )}
    </>
  )
}
