'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Category = { id: string; name: string; slug: string; count: number }
type Brand = { id: string; name: string; slug: string }

export function ProductFilters({
  categories,
  brands,
  priceRange,
  searchParams,
}: {
  categories: Category[]
  brands: Brand[]
  priceRange: { min: number; max: number }
  searchParams: Record<string, string | undefined>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '')

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    Object.entries({ ...searchParams, ...updates }).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearFilters() {
    if (pathname.startsWith('/categories/')) {
      router.push('/products')
    } else {
      router.push(pathname)
    }
  }

  const hasActiveFilters = !!(
    searchParams.category ||
    searchParams.brand ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.status ||
    searchParams.featured
  )

  const content = (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-3.5 w-3.5" /> Clear all filters
        </Button>
      )}

      <div>
        <h3 className="font-semibold text-sm mb-3">Sort By</h3>
        <Select value={searchParams.sort || 'newest'} onValueChange={(v) => updateParams({ sort: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isActive = searchParams.category === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (isActive) {
                    // Deselect: go to all products
                    router.push('/products')
                  } else {
                    // Navigate to the category page directly, preserving other filters
                    const params = new URLSearchParams()
                    Object.entries(searchParams).forEach(([key, value]) => {
                      if (value && key !== 'category' && key !== 'page') params.set(key, value)
                    })
                    const qs = params.toString()
                    router.push(`/categories/${cat.slug}${qs ? `?${qs}` : ''}`)
                  }
                }}
                className={cn(
                  'flex w-full items-center justify-between text-sm py-1 px-2 rounded hover:bg-stone-100 text-left',
                  isActive && 'bg-primary-50 text-primary-700 font-medium'
                )}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-stone-400">{cat.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateParams({ brand: searchParams.brand === brand.slug ? undefined : brand.slug })}
                className={cn(
                  'flex w-full items-center text-sm py-1 px-2 rounded hover:bg-stone-100 text-left',
                  searchParams.brand === brand.slug && 'bg-primary-50 text-primary-700 font-medium'
                )}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range (MWK)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={`${priceRange.min}`}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9"
          />
          <span className="text-stone-400">-</span>
          <Input
            type="number"
            placeholder={`${priceRange.max}`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-2"
          onClick={() => updateParams({ minPrice: minPrice || undefined, maxPrice: maxPrice || undefined })}
        >
          Apply
        </Button>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Availability</h3>
        <div className="space-y-2">
          {[
            { label: 'In Stock', value: 'IN_STOCK' },
            { label: 'Low Stock', value: 'LOW_STOCK' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParams({ status: searchParams.status === opt.value ? undefined : opt.value })}
              className={cn(
                'flex w-full items-center text-sm py-1 px-2 rounded hover:bg-stone-100 text-left',
                searchParams.status === opt.value && 'bg-primary-50 text-primary-700 font-medium'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <Button variant="outline" onClick={() => setMobileOpen(true)} className="w-full">
          <Filter className="h-4 w-4" /> Filters & Sort
        </Button>
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[90%] bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">{content}</aside>
    </>
  )
}
