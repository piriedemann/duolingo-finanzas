import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startLeagueSync } from './lib/leaderboard'
import { startCloudSync } from './lib/account'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// publica el XP del jugador en la liga (no hace nada si Supabase no está configurado)
startLeagueSync()
// con sesión iniciada, guarda el progreso en la cuenta (ver lib/account.ts)
startCloudSync()
