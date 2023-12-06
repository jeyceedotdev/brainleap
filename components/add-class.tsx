'use client'

import { Button } from './ui/button'
import { DialogContent, DialogHeader } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { addClass } from '@/lib/actions'
import { useTransition } from 'react'

export function AddClassDialog() {
	const [isPending, startTransition] = useTransition()
	async function action(formData: FormData) {
		startTransition(() => {
			addClass(formData)
		})
	}

	return (
		<>
			<DialogContent>
				<DialogHeader>Add Class</DialogHeader>
				<form className="space-y-8" action={action}>
					<div>
						<Label htmlFor="title">Class Title</Label>
						<Input
							type="text"
							id="title"
							name="title"
							placeholder="Class Title"
						/>
					</div>
					<div>
						<Label htmlFor="description">Class Description</Label>
						<Textarea
							id="description"
							name="description"
							placeholder="Class Description"
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
					>
						Submit
					</Button>
				</form>
			</DialogContent>
		</>
	)
}