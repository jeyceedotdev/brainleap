'use client'

import { AlertTriangleIcon } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <section>
      <AlertTriangleIcon />
      <div>
        <h2>Oops!</h2>
        <p>
          It seems like something went wrong. We&apos;re sorry for the
          inconvenience.
        </p>
      </div>
      <Link href="/auth/signin">Try Again</Link>
    </section>
  )
}
