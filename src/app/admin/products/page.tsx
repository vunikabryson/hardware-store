import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Input } from '@/components/ui/input'
import { AdminProductTable } from '@/components/admin/products/admin-product-table'
import { Badge } from '@/components/ui/badge'

type SearchParams = { search?: string; status?: string; category?: string; page?: string }

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 20

  const where: any = { isArchived: false }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { sku: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.category) where.category = { slug: searchParams.category }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  const statusCounts = await prisma.product.groupBy({
    by: ['status'],
    where: { isArchived: false },
    _count: true,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/admin/products" className={`px-3 py-1.5 rounded-full border ${!searchParams.status ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 hover:bg-stone-50'}`}>
          All ({total})
        </Link>
        {statusCounts.map((s) => (
          <Link
            key={s.status}
            href={`/admin/products?status=${s.status}`}
            className={`px-3 py-1.5 rounded-full border ${searchParams.status === s.status ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 hover:bg-stone-50'}`}
          >
            {s.status.replace('_', ' ')} ({s._count})
          </Link>
        ))}
      </div>

      {/* Search + filters */}
      <form method="GET" className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <select
          name="category"
          defaultValue={searchParams.category}
          className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 px-4 rounded-md bg-stone-900 text-white text-sm font-medium hover:bg-stone-800"
        >
          Filter
        </button>
      </form>

      <AdminProductTable products={products} total={total} page={page} pageSize={pageSize} />
    </div>
  )
}
