import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProducts, getPriceRange, getAllBrands } from '@/lib/data/products'
import { getActiveCategories } from '@/lib/data/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { Pagination } from '@/components/products/pagination'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our full catalog of building materials, tools, plumbing, electrical, paint and more.',
}

type SearchParamsT = {
  search?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  status?: string
  featured?: string
  sort?: string
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParamsT
}) {
  const page = Number(searchParams.page) || 1

  const [{ products, total, pageCount }, categories, priceRange, brands] = await Promise.all([
    getProducts({
      search: searchParams.search,
      category: searchParams.category,
      brand: searchParams.brand,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      status: searchParams.status,
      featured: searchParams.featured === 'true',
      sort: searchParams.sort,
      page,
    }),
    getActiveCategories(),
    getPriceRange(),
    getAllBrands(),
  ])

  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">
          {searchParams.search ? `Search results for "${searchParams.search}"` : 'All Products'}
        </h1>
        <p className="text-sm text-stone-500 mt-1">{total} products found</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <Suspense fallback={<div className="h-96" />}>
          <ProductFilters
            categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products }))}
            brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
            priceRange={priceRange}
            searchParams={searchParams}
          />
        </Suspense>

        <div>
          <ProductGrid products={serialized} />
          {pageCount > 1 && (
            <div className="mt-8">
              <Pagination currentPage={page} pageCount={pageCount} searchParams={searchParams} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
