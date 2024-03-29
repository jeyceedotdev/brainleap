'use client'

import { Button } from '@/ui/button'
import { AlertTriangleIcon } from 'lucide-react'
import { useEffect } from 'react'

export default function SignInErrorPage({
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
    <article className="grid place-items-center">
      <AlertTriangleIcon className="text-red-500" />
      <section className="text-center max-w-prose grid gap-y-2 py-2">
        <h2 className="text-2xl">Oops!</h2>
        <p>
          It seems like something went wrong. We&apos;re sorry for the
          inconvenience.
        </p>
      </section>
      <Button type="button" onClick={() => reset()}>
        Try Again
      </Button>
    </article>
  )
}
