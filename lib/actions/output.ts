'use server'

import { createClient } from '@/lib/supabase/action'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { gradeSchema, outputSchema } from '../validations/output'

type OutputSchemaFieldErrors = z.inferFlattenedErrors<
  typeof outputSchema
>['fieldErrors']

type OutputSchemaFormState = {
  errors: OutputSchemaFieldErrors | undefined
  message: string | undefined
}

type GradeSchemaFieldErrors = z.inferFlattenedErrors<
  typeof gradeSchema
>['fieldErrors']
type GradeSchemaFormState = {
  errors: GradeSchemaFieldErrors | undefined
  message: string | undefined
}

export const createOutput = async (
  assignmentId: string,
  courseId: string,
  previousState: OutputSchemaFormState,
  formData: FormData,
): Promise<OutputSchemaFormState> => {
  const supabase = createClient()

  const values = outputSchema.parse({
    file: formData.get('output'),
  })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, id')
    .eq('id', user.id)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data: file, error: fileError } = await supabase.storage
    .from('files')
    .upload(
      `assignments/${profile.username}/${values.file.name}`,
      values.file,
      {
        upsert: true,
      },
    )

  if (fileError) {
    throw fileError
  }

  const { error } = await supabase.from('outputs').insert({
    course_id: courseId,
    assignment_id: assignmentId,
    student_id: profile.id,
    attachment: file.path,
    grade: 0,
    submitted_at: new Date().toISOString(),
  })

  if (error) {
    throw error
  }

  revalidatePath(`/course/${courseId}/${assignmentId}`)

  return {
    errors: undefined,
    message: 'Output created successfully',
  }
}

export const gradeOutput = async (
  courseId: string,
  assignmentId: string,
  outputId: string,
  previousState: GradeSchemaFormState,
  formData: FormData,
): Promise<GradeSchemaFormState> => {
  const supabase = createClient()
  const result = gradeSchema.safeParse({
    grade: formData.get('grade'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: undefined,
    }
  }

  const { error } = await supabase
    .from('outputs')
    .update({
      grade: result.data.grade,
    })
    .eq('output_id', outputId)

  if (error) {
    throw error
  }

  revalidatePath(`/course/${courseId}/${assignmentId}`)

  return {
    errors: undefined,
    message: 'Output graded successfully',
  }
}
