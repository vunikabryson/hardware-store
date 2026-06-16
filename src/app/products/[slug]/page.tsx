import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products'
import { getSiteSettings } from '@/lib/settings'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductGrid } from '@/components/products/product-grid'
import { AddToQuoteButton } from '@/components/products/add-to-quote-button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getWhatsAppUrl } from '@/lib/utils'
import { MessageCircle, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Buy ${product.name} at the best price.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || '',
      images: product.images[0] ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const [related, settings] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id),
    getSiteSettings(),
  ])

  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
    IN_STOCK: { label: 'In Stock', variant: 'success' },
    LOW_STOCK: { label: 'Low Stock', variant: 'warning' },
    OUT_OF_STOCK: { label: 'Out of Stock', variant: 'destructive' },
    DISCONTINUED: { label: 'Discontinued', variant: 'secondary' },
  }
  const status = statusConfig[product.status] || statusConfig.IN_STOCK

  const whatsappMessage = `Hi, I'm interested in "${product.name}" (SKU: ${product.sku || 'N/A'}). Can you tell me more about availability and pricing?`
  const whatsappUrl = getWhatsAppUrl(settings.whatsappNumber, whatsappMessage)

  const relatedSerialized = related.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((i) => i.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MWK',
      price: product.price.toString(),
      availability:
        product.status === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-stone-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.brand && (
            <p className="text-sm text-primary-600 font-medium mb-1">{product.brand.name}</p>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant={status.variant}>{status.label}</Badge>
            {product.sku && <span className="text-sm text-stone-400">SKU: {product.sku}</span>}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
<span className="text-3xl font-bold text-stone-900">
  {formatPrice(Number(product.price))}
</span>

{product.comparePrice && (
  <span className="text-lg text-stone-400 line-through">
    {formatPrice(Number(product.comparePrice))}
  </span>
)}
            {product.unit && product.unit !== 'each' && (
              <span className="text-sm text-stone-500">per {product.unit}</span>
            )}
          </div>

          {product.description && (
            <div className="prose prose-sm max-w-none text-stone-600 mb-6">
              <p>{product.description}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <AddToQuoteButton
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
                image: product.images[0]?.url,
              }}
              disabled={product.status === 'OUT_OF_STOCK'}
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#25D366] text-[#25D366] px-4 py-2.5 text-sm font-medium hover:bg-[#25D366]/5"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6 text-sm text-stone-600 space-y-2">
            <div className="flex justify-between">
              <span>Category</span>
              <Link href={`/categories/${product.category.slug}`} className="font-medium text-primary-600">
                {product.category.name}
              </Link>
            </div>
            {product.brand && (
              <div className="flex justify-between">
                <span>Brand</span>
                <span className="font-medium">{product.brand.name}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span>Weight</span>
                <span className="font-medium">{product.weight} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedSerialized.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedSerialized} />
        </section>
      )}
    </div>
  )
}
