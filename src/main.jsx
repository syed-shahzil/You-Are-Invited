import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

try {
  history.scrollRestoration = 'manual'
} catch (e) {}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(<App />)
