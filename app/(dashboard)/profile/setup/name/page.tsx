import { createClient } from '@/lib/supabase/server'
import { button } from '@/ui/button'
import { form } from '@/ui/form'
import { input } from '@/ui/input'
import { label } from '@/ui/label'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { updateName } from '@/lib/actions/profile'
import { Session } from '@supabase/supabase-js'

const getName = async (session: Session) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data, error } = await supabase
		.from('profiles')
		.select('full_name')
		.eq('profile_id', session.user.id)
		.limit(1)
		.single()

	if (error) {
		throw error
	}

	// Return empty string if no username is found
	if (!data || !data.full_name) {
		return ''
	}

	return data.full_name
}

export default async function Page() {
	const cookieStore = cookies()

	const supabase = createClient(cookieStore)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session) {
		redirect('/auth/signin')
	}

	const fullName = await getName(session)

	return (
		<div>
			<form className={form} action={updateName}>
				<label className={label} htmlFor="name">
					Name
				</label>
				<input
					className={input}
					type="text"
					name="name"
					id="name"
					defaultValue={fullName}
				/>
				<button className={button} type="submit">
					Submit Name
				</button>
			</form>
		</div>
	)
}