// Builds a single self-contained index.html (JS, CSS and all 191 frames inlined)
// into dist-single/. Handy for hosts that only accept one HTML file.
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

execSync('npx vite build --mode single', { stdio: 'inherit' })

const files = readdirSync('public/frames').filter((f) => f.endsWith('.webp')).sort()
const frames = files.map((f) => readFileSync(`public/frames/${f}`).toString('base64'))
const tag = `<script>window.__FRAMES__=${JSON.stringify(frames)}</script>`
const path = 'dist-single/index.html'
let html = readFileSync(path, 'utf8')
html = html.replace('<head>', '<head>' + tag)
// favicon is an external file in normal builds; inline it here
const fav = readFileSync('public/favicon.svg').toString('base64')
html = html.replace('href="./favicon.svg"', `href="data:image/svg+xml;base64,${fav}"`)
writeFileSync(path, html)
console.log(`dist-single/index.html written (${(html.length / 1e6).toFixed(2)} MB, ${frames.length} frames)`)
