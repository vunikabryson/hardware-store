import Link from 'next/link'
import { Phone, ShoppingBag } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'
import { getActiveCategories } from '@/lib/data/categories'
import { MobileNav } from './mobile-nav'
import { SearchBar } from './search-bar'
import { UserMenu } from './user-menu'
import { QuoteCartIcon } from './quote-cart-icon'

export async function Header() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getActiveCategories()])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white">
      {/* Top bar */}
      <div className="hidden md:block bg-stone-900 text-stone-300 text-xs">
        <div className="container mx-auto px-4 flex items-center justify-between py-1.5">
          <span>{settings.businessHours}</span>
          <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-1.5 hover:text-white">
            <Phone className="h-3 w-3" />
            {settings.contactPhone}
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          <MobileNav categories={categories} settings={settings} />

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-md bg-primary-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-display font-bold text-lg text-stone-900">{settings.siteName}</p>
              <p className="text-[11px] text-stone-500">{settings.tagline}</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Link
              href="/quote"
              className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Request Quote
            </Link>
            <UserMenu />
            <QuoteCartIcon />
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Category nav - desktop */}
        <nav className="hidden md:flex items-center gap-6 pb-3 overflow-x-auto text-sm font-medium text-stone-700">
          <Link href="/products" className="hover:text-primary-600 whitespace-nowrap">
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="hover:text-primary-600 whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/contact" className="hover:text-primary-600 whitespace-nowrap ml-auto">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
