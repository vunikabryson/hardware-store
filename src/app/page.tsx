import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, Headphones, Hammer } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/data/products'
import { getActiveCategories } from '@/lib/data/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getActiveCategories(),
  ])

  const featured = featuredProducts.map((p) => ({ ...p, price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null }))

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600 via-stone-900 to-stone-900" />
        <div className="container relative mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-600/20 px-3 py-1 text-xs font-medium text-primary-300 mb-4">
              <Hammer className="h-3.5 w-3.5" /> Built for builders
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Everything you need to build it right.
            </h1>
            <p className="text-stone-300 text-lg mb-8 max-w-md">
              From cement to cordless drills — quality materials, tools, and supplies at competitive prices, with bulk quotes for contractors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10" asChild>
                <Link href="/quote">Request a Bulk Quote</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-lg bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors"
              >
                <span className="text-3xl">{cat.icon}</span>
                <p className="mt-3 font-medium">{cat.name}</p>
                <p className="text-xs text-stone-400">{cat._count.products} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-stone-100">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary-600" />
            <div>
              <p className="font-semibold">Delivery Available</p>
              <p className="text-stone-500">Across the city and surrounding areas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary-600" />
            <div>
              <p className="font-semibold">Quality Guaranteed</p>
              <p className="text-stone-500">Trusted brands and products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-8 w-8 text-primary-600" />
            <div>
              <p className="font-semibold">Expert Support</p>
              <p className="text-stone-500">Get advice from our team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Shop by Category</h2>
          <Link href="/products" className="text-sm font-medium text-primary-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-stone-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Featured Products</h2>
            <Link href="/products?featured=true" className="text-sm font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">Need a bulk order quote?</h2>
            <p className="text-primary-100">
              Tell us what you need and we'll get back to you with the best pricing for your project.
            </p>
          </div>
          <Button size="lg" variant="outline" className="bg-white text-primary-700 border-white hover:bg-stone-100 shrink-0" asChild>
            <Link href="/quote">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
