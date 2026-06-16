import Link from 'next/link'
import { Package, Tag, MessageSquare, Mail, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getDashboardStats() {
  const [
    totalProducts,
    totalQuotes,
    pendingQuotes,
    unreadMessages,
    lowStockProducts,
    outOfStockProducts,
    recentProducts,
    recentQuotes,
  ] = await Promise.all([
    prisma.product.count({ where: { isArchived: false } }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
    prisma.contactForm.count({ where: { isRead: false } }),
    prisma.product.count({ where: { status: 'LOW_STOCK', isArchived: false } }),
    prisma.product.count({ where: { status: 'OUT_OF_STOCK', isArchived: false } }),
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true, images: { take: 1 } },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])
  return {
    totalProducts,
    totalQuotes,
    pendingQuotes,
    unreadMessages,
    lowStockProducts,
    outOfStockProducts,
    recentProducts,
    recentQuotes,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, href: '/admin/products', color: 'text-blue-600 bg-blue-50' },
    { label: 'Quote Requests', value: stats.totalQuotes, icon: MessageSquare, href: '/admin/quotes', color: 'text-green-600 bg-green-50', badge: stats.pendingQuotes > 0 ? `${stats.pendingQuotes} pending` : null },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, href: '/admin/messages', color: 'text-purple-600 bg-purple-50' },
    { label: 'Low Stock Alerts', value: stats.lowStockProducts + stats.outOfStockProducts, icon: AlertTriangle, href: '/admin/products?status=LOW_STOCK', color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard Overview</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="flex flex-col p-4 bg-white rounded-lg border border-stone-200 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {card.badge && (
                  <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-medium">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-stone-500 mt-1">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="font-semibold text-amber-800">Stock Alerts</p>
          </div>
          <ul className="text-sm text-amber-700 space-y-1">
            {stats.lowStockProducts > 0 && (
              <li>
                <Link href="/admin/products?status=LOW_STOCK" className="hover:underline">
                  {stats.lowStockProducts} product(s) are running low on stock
                </Link>
              </li>
            )}
            {stats.outOfStockProducts > 0 && (
              <li>
                <Link href="/admin/products?status=OUT_OF_STOCK" className="hover:underline">
                  {stats.outOfStockProducts} product(s) are out of stock
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-stone-100">
            <h2 className="font-semibold">Recent Products</h2>
            <Link href="/admin/products" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {stats.recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                <div className="h-10 w-10 rounded-md bg-stone-100 overflow-hidden shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-300">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-stone-500">{product.category.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{formatPrice(Number(product.price))}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    product.status === 'IN_STOCK' ? 'bg-green-100 text-green-700' :
                    product.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-stone-100">
            <h2 className="font-semibold">Recent Quote Requests</h2>
            <Link href="/admin/quotes" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {stats.recentQuotes.length === 0 ? (
              <p className="text-sm text-stone-400 p-4">No quote requests yet.</p>
            ) : stats.recentQuotes.map((quote) => (
              <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{quote.name}</p>
                  <p className="text-xs text-stone-500">{quote.quoteNumber}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    quote.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    quote.status === 'QUOTED' ? 'bg-blue-100 text-blue-700' :
                    quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
