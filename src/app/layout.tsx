import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: {
    default: 'BuildRight Hardware | Quality Building Materials & Tools',
    template: '%s | BuildRight Hardware',
  },
  description:
    'BuildRight Hardware is your trusted supplier of building materials, plumbing, electrical, paint, tools, and roofing supplies in Malawi. Request a quote today.',
  keywords: [
    'hardware store',
    'building materials',
    'cement',
    'plumbing',
    'electrical',
    'paint',
    'tools',
    'roofing',
    'Malawi hardware',
    'Blantyre hardware',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'postgresql://neondb_owner:npg_Q3TbCig9NnzI@ep-cold-fire-aq95ba0d-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'BuildRight Hardware',
    title: 'BuildRight Hardware | Quality Building Materials & Tools',
    description:
      'Your trusted supplier of building materials, plumbing, electrical, paint, tools and roofing supplies.',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'BuildRight Hardware',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildRight Hardware',
    description: 'Your trusted building partner',
    images: ['/images/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
