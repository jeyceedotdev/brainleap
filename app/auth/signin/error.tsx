'use client'

import { AlertTriangleIcon } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<main>
			<AlertTriangleIcon />
			<section>
				<h2>Oops!</h2>
				<p>
					It seems like something went wrong. We&apos;re sorry for the
					inconvenience.
				</p>
			</section>
			<button onClick={() => reset()}>Try Again</button>
		</main>
	)
}