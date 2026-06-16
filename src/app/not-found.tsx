import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-display text-6xl font-bold text-stone-200">404</h1>
      <h2 className="text-2xl font-bold mt-4 mb-2">Page not found</h2>
      <p className="text-stone-500 mb-8 max-w-sm">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
