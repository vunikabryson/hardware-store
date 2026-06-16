'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-9 w-9 rounded-full bg-stone-100 animate-pulse" />
  }

  if (!session) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/auth/login" aria-label="Sign in">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[180px] rounded-md border border-stone-200 bg-white p-1 shadow-lg"
        >
          <div className="px-3 py-2 text-sm">
            <p className="font-medium text-stone-900">{session.user?.name}</p>
            <p className="text-stone-500 text-xs">{session.user?.email}</p>
          </div>
          <DropdownMenu.Separator className="h-px bg-stone-100 my-1" />
          {session.user?.role === 'ADMIN' && (
            <DropdownMenu.Item asChild>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-stone-100 cursor-pointer outline-none"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-stone-100 cursor-pointer outline-none text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
