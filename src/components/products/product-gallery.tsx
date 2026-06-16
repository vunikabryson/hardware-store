'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type ProductImage = { id: string; url: string; alt: string | null }

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-stone-100 flex items-center justify-center text-stone-300">
        No image available
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square rounded-lg bg-stone-100 overflow-hidden relative mb-3">
        <Image
          src={images[active].url}
          alt={images[active].alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 rounded-md overflow-hidden border-2',
                active === i ? 'border-primary-600' : 'border-transparent'
              )}
            >
              <Image src={img.url} alt={img.alt || productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
