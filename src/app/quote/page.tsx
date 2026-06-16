import { Metadata } from 'next'
import { QuoteForm } from '@/components/quote/quote-form'

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Get a personalized quote for your building materials and supplies. Add products and submit your request.',
}

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold mb-2">Request a Quote</h1>
      <p className="text-stone-500 mb-8">
        Add products to your quote list while browsing, then submit your details below and we'll get back to you with pricing and availability.
      </p>
      <QuoteForm />
    </div>
  )
}
