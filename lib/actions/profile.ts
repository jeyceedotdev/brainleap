'use server'

import { getSession, getUser } from '@/lib/queries/user'
import { createClient } from '@/lib/supabase/action'
import { fullNameSchema, usernameSchema } from '@/lib/validations/profile'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadAvatar(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const file = formData.get('avatar') as File

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}-${Math.random()}.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (error) {
    throw error
  }

  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`

  await supabase
    .from('profiles')
    .update({ avatar_url: fileUrl })
    .eq('id', user.id)

  revalidatePath('/profile')
}

export async function updateAvatar(formData: FormData) {
  await uploadAvatar(formData)
  redirect('/profile')
}

export async function updateUsername(formData: FormData) {
  const supabase = createClient()
  const res = usernameSchema.safeParse({
    username: formData.get('username'),
  })

  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  if (!res.success) {
    return {
      errors: res.error,
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username: res.data.username,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }

  revalidatePath('/profile')
}

export async function updateName(formData: FormData) {
  const supabase = createClient()
  const res = fullNameSchema.safeParse({
    full_name: formData.get('name'),
  })

  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  if (!res.success) {
    return {
      error: res.error,
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: res.data.name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }

  revalidatePath('/profile')
}

export async function updateUniversity(formData: FormData) {
  const supabase = createClient()

  const university = formData.get('university') as string

  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      university: university,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }

  revalidatePath('/profile')
}

export async function updateSection(formData: FormData) {
  const supabase = createClient()
  // const res = profileSchema.safeParse({
  // 	section: formData.get('section'),
  // })
  const section = formData.get('section') as string

  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // if (!res.success) {
  // 	return {
  // 		error: res.error,
  // 	}
  // }

  const { error } = await supabase
    .from('profiles')
    .update({
      section: section,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }

  revalidatePath('/profile')
}

export async function updateAbout(formData: FormData) {
  const supabase = createClient()
  const about = formData.get('about') as string

  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      about: about,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    throw error
  }

  revalidatePath('/profile')
}

export async function updateProfile(formData: FormData) {
  await Promise.all([
    updateName(formData),
    updateUsername(formData),
    updateAbout(formData),
  ])
  revalidatePath('/profile')
}
