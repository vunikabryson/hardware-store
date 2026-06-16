'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/ui/toast'
import { QuoteProvider } from '@/lib/context/quote-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <QuoteProvider>{children}</QuoteProvider>
      </ToastProvider>
    </SessionProvider>
  )
}
