'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, MessageSquare,
  Mail, Settings, ChevronRight, ShoppingBag as Logo,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Brands', href: '/admin/brands', icon: ShoppingBag },
  { label: 'Quote Requests', href: '/admin/quotes', icon: ShoppingBag },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 flex-col bg-stone-900 text-stone-300 shrink-0">
      <div className="flex items-center gap-2 p-4 border-b border-stone-800">
        <div className="h-8 w-8 rounded bg-primary-600 flex items-center justify-center">
          <Logo className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">BuildRight</p>
          <p className="text-[10px] text-stone-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-stone-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-stone-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-white rounded-md hover:bg-stone-800"
        >
          View Store <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  )
}
