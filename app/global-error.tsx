'use client'

import { button } from '@/ui/button'
import { AlertTriangleIcon } from 'lucide-react'
import { useEffect } from 'react'

export default function GlobalError({
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
		<html lang="en" dir="ltr">
			<body>
				<main>
					<AlertTriangleIcon />
					<section>
						<h2>Oops!</h2>
						<p>
							It seems like something went wrong. We&apos;re sorry for the
							inconvenience.
						</p>
					</section>
					<button type="button" className={button} onClick={() => reset()}>
						Try Again
					</button>
				</main>
			</body>
		</html>
	)
}