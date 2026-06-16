'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'

export function AdminHeader({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-stone-200">
      <h1 className="text-sm font-medium text-stone-500">Admin Dashboard</h1>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm">{user.name}</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" className="z-50 min-w-[160px] rounded-md border bg-white p-1 shadow-md">
            <div className="px-3 py-2 text-xs text-stone-500">{user.email}</div>
            <DropdownMenu.Separator className="h-px bg-stone-100 my-1" />
            <DropdownMenu.Item
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-stone-100 cursor-pointer text-red-600 outline-none"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
