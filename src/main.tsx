import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startLeagueSync } from './lib/leaderboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// publica el XP del jugador en la liga (no hace nada si Supabase no está configurado)
startLeagueSync()
