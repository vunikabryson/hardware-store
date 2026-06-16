import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'
import { getActiveCategories } from '@/lib/data/categories'

export async function Footer() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getActiveCategories()])

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-3">{settings.siteName}</h3>
          <p className="text-sm text-stone-400 mb-4">{settings.tagline}</p>
          <div className="flex gap-3">
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-primary-600">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-primary-600">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link href={`/categories/${cat.slug}`} className="hover:text-primary-400">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-primary-400">All Products</Link></li>
            <li><Link href="/quote" className="hover:text-primary-400">Request a Quote</Link></li>
            <li><Link href="/contact" className="hover:text-primary-400">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-primary-400">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-400" />
              {settings.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-400" />
              <a href={`tel:${settings.contactPhone}`} className="hover:text-primary-400">
                {settings.contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary-400" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary-400">
                {settings.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-400" />
              {settings.businessHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
