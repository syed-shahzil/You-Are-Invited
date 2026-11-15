export const FRAME_COUNT = 191
export const FPS = 24

const pad = (i) => String(i + 1).padStart(4, '0')
export const frameUrl = (i) => `${import.meta.env.BASE_URL}frames/frame_${pad(i)}.webp`

function b64ToBlob(b64) {
  const s = atob(b64)
  const u = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i)
  return new Blob([u], { type: 'image/webp' })
}

function blobToDrawable(blob) {
  if (self.createImageBitmap) return createImageBitmap(blob)
  return new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = URL.createObjectURL(blob)
  })
}

// Decodes one frame. Frames normally come from /frames/*.webp; the single-file
// build (npm run build:single) embeds them in window.__FRAMES__ instead.
export function loadFrame(i) {
  const inline = window.__FRAMES__
  const blob = inline
    ? Promise.resolve(b64ToBlob(inline[i]))
    : fetch(frameUrl(i)).then((r) => {
        if (!r.ok) throw new Error('frame ' + i)
        return r.blob()
      })
  return blob.then(blobToDrawable)
}

// Warms the HTTP cache for later frames so playback never waits on the network.
export function warmCache(from = 16, concurrency = 3) {
  if (window.__FRAMES__) return () => {}
  let next = from
  let stopped = false
  const run = () => {
    if (stopped || next >= FRAME_COUNT) return
    const i = next++
    fetch(frameUrl(i)).then(run, run)
  }
  for (let k = 0; k < concurrency; k++) run()
  return () => {
    stopped = true
  }
}
