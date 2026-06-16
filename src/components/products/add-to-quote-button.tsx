'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuote } from '@/lib/context/quote-context'
import { useToast } from '@/components/ui/toast'

export function AddToQuoteButton({
  product,
  disabled,
}: {
  product: { id: string; name: string; price: number; unit?: string | null; image?: string }
  disabled?: boolean
}) {
  const { addItem } = useQuote()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    addItem(
      { productId: product.id, name: product.name, price: product.price, unit: product.unit, image: product.image },
      quantity
    )
    toast({ title: 'Added to quote list', description: `${product.name} (x${quantity})`, variant: 'success' })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-stone-300 rounded-md">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2.5 hover:bg-stone-100"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-10 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-2.5 hover:bg-stone-100"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <Button onClick={handleAdd} disabled={disabled} className="flex-1">
        {disabled ? 'Out of Stock' : 'Add to Quote List'}
      </Button>
    </div>
  )
}
