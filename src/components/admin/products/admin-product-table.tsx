'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Pencil, Trash2, ArchiveIcon, MoreVertical, Eye } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'

type Product = {
  id: string
  name: string
  sku: string | null
  price: any
  stock: number
  status: string
  isFeatured: boolean
  images: { url: string }[]
  category: { name: string }
  brand: { name: string } | null
}

const statusColors: Record<string, string> = {
  IN_STOCK: 'bg-green-100 text-green-700',
  LOW_STOCK: 'bg-amber-100 text-amber-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
  DISCONTINUED: 'bg-stone-100 text-stone-600',
}

export function AdminProductTable({
  products,
  total,
  page,
  pageSize,
}: {
  products: Product[]
  total: number
  page: number
  pageSize: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleArchive(id: string, productName: string) {
    if (!confirm(`Archive "${productName}"? It will be hidden from the store.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: true }),
      })
      if (!res.ok) throw new Error('Failed to archive')
      toast({ title: 'Product archived', variant: 'success' })
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  async function handleDelete(id: string, productName: string) {
    if (!confirm(`Permanently DELETE "${productName}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Product deleted', variant: 'success' })
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
        <p className="text-stone-500">No products found.</p>
        <Link href="/admin/products/new" className="text-primary-600 font-medium hover:underline mt-2 inline-block">
          Add your first product
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-4 py-3 font-semibold text-stone-600">Product</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">SKU</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600 hidden sm:table-cell">Category</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">Price</th>
              <th className="text-center px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Stock</th>
              <th className="text-center px-4 py-3 font-semibold text-stone-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id} className={`hover:bg-stone-50 ${deleting === product.id ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded bg-stone-100 overflow-hidden shrink-0">
                      {product.images[0] ? (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-stone-300 text-xs">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 line-clamp-1">{product.name}</p>
                      {product.isFeatured && <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 rounded">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{product.sku || '—'}</td>
                <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{product.category.name}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(Number(product.price))}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">{product.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[product.status] || statusColors.DISCONTINUED}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="p-1.5 rounded hover:bg-stone-100 text-stone-500">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" className="z-50 min-w-[160px] rounded-md border bg-white p-1 shadow-lg text-sm">
                        <DropdownMenu.Item asChild>
                          <Link href={`/admin/products/${product.id}/edit`}
                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-stone-100 cursor-pointer outline-none">
                            <Pencil className="h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <Link href={`/products/${product.id}`} target="_blank"
                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-stone-100 cursor-pointer outline-none">
                            <Eye className="h-4 w-4" /> View on Store
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="h-px bg-stone-100 my-1" />
                        <DropdownMenu.Item
                          onClick={() => handleArchive(product.id, product.name)}
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-stone-100 cursor-pointer outline-none text-amber-700"
                        >
                          <ArchiveIcon className="h-4 w-4" /> Archive
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleDelete(product.id, product.name)}
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-stone-100 cursor-pointer outline-none text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Permanently
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-stone-100 text-sm text-stone-500 flex items-center justify-between">
        <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
        <div className="flex gap-1">
          {page > 1 && (
            <Link href={`?page=${page - 1}`} className="px-3 py-1.5 rounded border border-stone-300 hover:bg-stone-50">Prev</Link>
          )}
          {page * pageSize < total && (
            <Link href={`?page=${page + 1}`} className="px-3 py-1.5 rounded border border-stone-300 hover:bg-stone-50">Next</Link>
          )}
        </div>
      </div>
    </div>
  )
}
