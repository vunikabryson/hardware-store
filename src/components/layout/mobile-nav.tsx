'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
}

type Settings = {
  contactPhone: string
  address: string
  businessHours: string
}

export function MobileNav({ categories, settings }: { categories: Category[]; settings: Settings }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden p-2 -ml-2 text-stone-700"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <span className="font-display font-bold text-lg">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-stone-500" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                href="/products"
                className="block py-2.5 px-3 rounded-md font-medium text-stone-900 hover:bg-stone-100"
                onClick={() => setOpen(false)}
              >
                All Products
              </Link>
              <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase text-stone-400">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-stone-200 mt-3 space-y-1">
                <Link
                  href="/quote"
                  className="block py-2.5 px-3 rounded-md font-medium text-primary-700 hover:bg-primary-50"
                  onClick={() => setOpen(false)}
                >
                  Request a Quote
                </Link>
                <Link
                  href="/contact"
                  className="block py-2.5 px-3 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-stone-200 text-sm text-stone-600 space-y-2">
              <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-600" />
                {settings.contactPhone}
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
                {settings.address}
              </p>
              <p className="text-xs text-stone-400">{settings.businessHours}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
