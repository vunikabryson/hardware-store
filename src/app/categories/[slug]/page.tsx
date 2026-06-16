import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getProducts, getPriceRange, getAllBrands } from '@/lib/data/products'
import { getActiveCategories } from '@/lib/data/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { Pagination } from '@/components/products/pagination'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) return {}
  return {
    title: category.name,
    description: category.description || `Browse our range of ${category.name} products.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category || !category.isActive) notFound()

  const page = Number(searchParams.page) || 1

  const [{ products, total, pageCount }, categories, priceRange, brands] = await Promise.all([
    getProducts({
      category: params.slug,
      search: searchParams.search,
      brand: searchParams.brand,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      status: searchParams.status,
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
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <h1 className="font-display text-2xl font-bold">{category.name}</h1>
        </div>
        {category.description && <p className="text-stone-500 mt-2 max-w-2xl">{category.description}</p>}
        <p className="text-sm text-stone-500 mt-1">{total} products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <ProductFilters
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products }))}
          brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
          priceRange={priceRange}
          searchParams={{ ...searchParams, category: params.slug }}
        />

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
