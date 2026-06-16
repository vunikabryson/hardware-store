'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Minus, Plus, CheckCircle2 } from 'lucide-react'
import { useQuote } from '@/lib/context/quote-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { formatPrice } from '@/lib/utils'

export function QuoteForm() {
  const { items, removeItem, updateQuantity, clear } = useQuote()
  const { toast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      toast({ title: 'Add products first', description: 'Your quote list is empty.', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setSubmitted(true)
      clear()
    } catch (err: any) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 border border-stone-200 rounded-lg">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Quote Request Submitted!</h2>
        <p className="text-stone-500 mb-6 max-w-sm mx-auto">
          Thanks for your request. Our team will review it and get back to you shortly via email or phone.
        </p>
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg mb-4">Your Items</h2>
        {items.length === 0 ? (
          <div className="border border-dashed border-stone-300 rounded-lg p-8 text-center text-stone-500">
            No products added yet.{' '}
            <a href="/products" className="text-primary-600 font-medium hover:underline">
              Browse products
            </a>{' '}
            and click "Add to Quote List".
          </div>
        ) : (
          <div className="border border-stone-200 rounded-lg divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-3">
                <div className="relative h-14 w-14 rounded-md bg-stone-100 overflow-hidden shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-stone-500">{formatPrice(item.price)} {item.unit && item.unit !== 'each' ? `/ ${item.unit}` : ''}</p>
                </div>
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 hover:bg-stone-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 hover:bg-stone-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="w-24 text-right font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-stone-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-between p-3 font-semibold">
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-4">Your Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5 mt-4">
          <Label htmlFor="message">Additional Notes</Label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Delivery location, timeline, or other details..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? 'Submitting...' : 'Submit Quote Request'}
      </Button>
    </form>
  )
}
