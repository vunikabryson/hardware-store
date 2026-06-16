'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { useQuote } from '@/lib/context/quote-context'
import { Button } from '@/components/ui/button'

export function QuoteCartIcon() {
  const { count } = useQuote()

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/quote" aria-label="Quote list">
        <FileText className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Link>
    </Button>
  )
}
