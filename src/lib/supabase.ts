import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Configuración pública (la anon key está pensada para ir en el cliente; la seguridad la dan las políticas RLS).
// Sin estas variables la app funciona igual, pero la liga queda en modo local.
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
        },
      })
    : null

export const cloudEnabled = supabase !== null
