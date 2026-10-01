import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Configuración pública (la anon key está pensada para ir en el cliente; la seguridad la dan las políticas RLS).
// Sin estas variables la app funciona igual, pero la liga queda en modo local y no hay login.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          // la sesión anónima se guarda en localStorage y sobrevive recargas
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // PKCE: el login con Google vuelve con ?code=… en vez de tokens en el hash (que usa el router)
          flowType: 'pkce',
        },
      })
    : null

export const cloudEnabled = supabase !== null
