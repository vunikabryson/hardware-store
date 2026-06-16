import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { QuoteStatusUpdater } from '@/components/admin/quotes/quote-status-updater'

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, sku: true, price: true, images: { take: 1 } },
          },
        },
      },
    },
  })
  if (!quote) notFound()

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/quotes" className="p-1.5 rounded hover:bg-stone-100">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">{quote.quoteNumber}</h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <h2 className="font-semibold mb-3">Customer Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Name</dt><dd className="font-medium">{quote.name}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Email</dt><dd>{quote.email}</dd></div>
            {quote.phone && <div className="flex justify-between"><dt className="text-stone-500">Phone</dt><dd>{quote.phone}</dd></div>}
            {quote.company && <div className="flex justify-between"><dt className="text-stone-500">Company</dt><dd>{quote.company}</dd></div>}
            <div className="flex justify-between"><dt className="text-stone-500">Submitted</dt><dd>{new Date(quote.createdAt).toLocaleDateString()}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <h2 className="font-semibold mb-3">Status</h2>
          <QuoteStatusUpdater quoteId={quote.id} currentStatus={quote.status} />
        </div>
      </div>

      {quote.message && (
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <h2 className="font-semibold mb-2">Customer Message</h2>
          <p className="text-sm text-stone-600">{quote.message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <h2 className="font-semibold p-4 border-b border-stone-100">Requested Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-4 py-2 text-stone-500 font-medium">Product</th>
              <th className="text-center px-4 py-2 text-stone-500 font-medium">Qty</th>
              <th className="text-right px-4 py-2 text-stone-500 font-medium">Unit Price</th>
              <th className="text-right px-4 py-2 text-stone-500 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.product.name}</p>
                  {item.product.sku && <p className="text-xs text-stone-400">{item.product.sku}</p>}
                </td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{formatPrice(Number(item.product.price))}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(Number(item.product.price) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-stone-200">
              <td colSpan={3} className="px-4 py-3 text-right font-semibold">Estimated Total</td>
              <td className="px-4 py-3 text-right font-bold">
                {formatPrice(quote.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
