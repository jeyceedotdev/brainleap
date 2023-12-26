'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { assignmentSchema } from '../validations/assignment'

const constructDueDate = (date: string, time: string) => {
	const [hours, minutes] = time.split(':')
	const [year, month, day] = date.split('-')

	return new Date(
		parseInt(year),
		parseInt(month) - 1,
		parseInt(day),
		parseInt(hours),
		parseInt(minutes),
	)
}

export async function createAssignment(course_id: string, formData: FormData) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const dueDate = constructDueDate(
		formData.get('dueDate') as string,
		formData.get('dueTime') as string,
	)
	const values = assignmentSchema.parse({
		title: formData.get('title'),
		description: formData.get('description'),
		attachment: formData.get('attachment'),
		link: formData.get('link'),
		due_date: formData.get('dueDate'),
		due_time: formData.get('dueTime'),
	})

	const { data: assignmentFiles, error: assignmentFilesError } =
		await supabase.storage
			.from('files')
			.upload(
				`assignments/${values.attachment.name}`,
				values.attachment,
				{
					upsert: true,
				},
			)

	if (assignmentFilesError) {
		throw assignmentFilesError
	}

	const { error: assignmentError } = await supabase
		.from('assignments')
		.insert({
			title: values.title,
			due_date: dueDate,
			attachment: assignmentFiles.path,
			course_id: course_id,
		})

	if (assignmentError) {
		throw assignmentError
	}
}