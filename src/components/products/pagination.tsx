import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({
  currentPage,
  pageCount,
  searchParams,
}: {
  currentPage: number
  pageCount: number
  searchParams: Record<string, string | undefined>
}) {
  function buildUrl(page: number) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value)
    })
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - currentPage) <= 1
  )

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href={buildUrl(Math.max(1, currentPage - 1))}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-md border border-stone-200',
          currentPage === 1 && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-stone-400">…</span>}
          <Link
            href={buildUrl(p)}
            className={cn(
              'inline-flex items-center justify-center h-9 w-9 rounded-md border text-sm',
              p === currentPage
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-stone-200 hover:bg-stone-50'
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      <Link
        href={buildUrl(Math.min(pageCount, currentPage + 1))}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-md border border-stone-200',
          currentPage === pageCount && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
