import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const getUser = async () => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!user) {
    redirect('/auth/signin')
  }

  return user
}

export const getSession = async () => {
  const supabase = createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }


  return session
}
