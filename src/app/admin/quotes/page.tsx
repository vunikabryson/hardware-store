import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  QUOTED: 'bg-purple-100 text-purple-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-stone-100 text-stone-600',
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = 20
  const where: any = {}
  if (searchParams.status) where.status = searchParams.status

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      include: { items: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.quoteRequest.count({ where }),
  ])

  const statusCounts = await prisma.quoteRequest.groupBy({ by: ['status'], _count: true })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Quote Requests</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/admin/quotes" className={`px-3 py-1.5 rounded-full border ${!searchParams.status ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300'}`}>
          All ({total})
        </Link>
        {statusCounts.map((s) => (
          <Link
            key={s.status}
            href={`/admin/quotes?status=${s.status}`}
            className={`px-3 py-1.5 rounded-full border ${searchParams.status === s.status ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300'}`}
          >
            {s.status} ({s._count})
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-4 py-3 font-semibold text-stone-600">Quote #</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Items</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Date</th>
              <th className="text-center px-4 py-3 font-semibold text-stone-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-600">{quote.quoteNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{quote.name}</p>
                  <p className="text-xs text-stone-500">{quote.email}</p>
                </td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                  {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
                </td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[quote.status]}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/quotes/${quote.id}`} className="text-primary-600 hover:underline text-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">No quote requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
