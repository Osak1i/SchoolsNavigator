import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import { preloadAllSVGs } from './app/utils/svgCache'

// Start fetching all floor map SVGs immediately — before any floor is selected.
// By the time the user switches floors, the SVG is already in memory.
preloadAllSVGs();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
