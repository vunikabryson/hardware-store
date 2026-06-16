import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

type ProductCardData = {
  id: string
  name: string
  slug: string
  price: number | string
  comparePrice?: number | string | null
  status: string
  unit?: string | null
  images: { url: string; alt: string | null }[]
  category: { name: string; slug: string }
  brand?: { name: string } | null
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const primaryImage = product.images[0]
  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
    IN_STOCK:     { label: 'In Stock',     variant: 'success'     },
    LOW_STOCK:    { label: 'Low Stock',    variant: 'warning'     },
    OUT_OF_STOCK: { label: 'Out of Stock', variant: 'destructive' },
    DISCONTINUED: { label: 'Discontinued', variant: 'secondary'   },
  }
  const status = statusConfig[product.status] || statusConfig.IN_STOCK

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <Image
          src={primaryImage?.url || '/images/product-placeholder.svg'}
          alt={primaryImage?.alt || product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge variant={status.variant} className="absolute top-2 left-2">
          {status.label}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-3 gap-1">
        <p className="text-xs text-stone-500">{product.category.name}</p>
        <h3 className="font-medium text-sm text-stone-900 line-clamp-2 group-hover:text-primary-600">
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-xs text-stone-400">{product.brand.name}</p>
        )}
        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-stone-900">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(Number(product.comparePrice))}
            </span>
          )}
          {product.unit && product.unit !== 'each' && (
            <span className="text-xs text-stone-400">/{product.unit}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
