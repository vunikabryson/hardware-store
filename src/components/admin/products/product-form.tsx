'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'

type Category = { id: string; name: string }
type Brand = { id: string; name: string }
type ExistingImage = { id: string; url: string; alt: string | null; isPrimary: boolean; sortOrder: number }

type ProductFormProps = {
  categories: Category[]
  brands: Brand[]
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    comparePrice?: number
    sku: string | null
    stock: number
    lowStockAt: number
    status: string
    isFeatured: boolean
    unit: string | null
    weight?: number | null
    categoryId: string
    brandId: string | null
    images: ExistingImage[]
  }
}

export function ProductForm({ categories, brands, product }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    sku: product?.sku || '',
    stock: product?.stock?.toString() || '0',
    lowStockAt: product?.lowStockAt?.toString() || '5',
    status: product?.status || 'IN_STOCK',
    isFeatured: product?.isFeatured || false,
    unit: product?.unit || 'each',
    weight: product?.weight?.toString() || '',
    categoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
  })

  const [existingImages, setExistingImages] = useState<ExistingImage[]>(product?.images || [])
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewImages((prev) => [...prev, ...previews])
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(id: string) {
    setExistingImages((prev) => prev.filter((img) => img.id !== id))
    setDeletedImageIds((prev) => [...prev, id])
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) urls.push(data.url)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categoryId) {
      toast({ title: 'Select a category', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      // Upload new images
      let uploadedUrls: string[] = []
      if (newImages.length > 0) {
        setUploading(true)
        uploadedUrls = await uploadImages(newImages.map((i) => i.file))
        setUploading(false)
      }

      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        lowStockAt: parseInt(form.lowStockAt),
        weight: form.weight ? parseFloat(form.weight) : null,
        brandId: form.brandId || null,
        newImageUrls: uploadedUrls,
        deletedImageIds,
      }

      const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save product')

      toast({
        title: isEdit ? 'Product updated!' : 'Product created!',
        description: form.name,
        variant: 'success',
      })
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Error saving product', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* Left column */}
      <div className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Product Information</h2>
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Portland Cement 50kg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product, its uses, specifications..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative h-24 w-24 rounded-lg overflow-hidden border border-stone-200">
                <Image src={img.url} alt="" fill className="object-cover" />
                {img.isPrimary && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-primary-600 text-white py-0.5">Primary</span>
                )}
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newImages.map((img, i) => (
              <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border border-stone-200">
                <img src={img.preview} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center h-24 w-24 rounded-lg border-2 border-dashed border-stone-300 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="h-6 w-6 text-stone-400" />
              <span className="text-xs text-stone-400 mt-1">Upload</span>
              <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageSelect} />
            </label>
          </div>
          <p className="text-xs text-stone-400">Upload product images (JPG, PNG, WebP). First image will be the primary.</p>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (MWK) *</Label>
              <Input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comparePrice">Compare-at Price (MWK)</Label>
              <Input
                id="comparePrice"
                type="number"
                min="0"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                placeholder="Optional original price"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['each', 'bag', 'ton', 'litre', 'kg', 'length', 'roll', 'box', 'sheet', 'pair', 'set'].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Inventory</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU / Product Code</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. CEM-POR-50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lowStockAt">Low Stock Alert</Label>
              <Input
                id="lowStockAt"
                type="number"
                min="0"
                value={form.lowStockAt}
                onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Stock Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_STOCK">✅ In Stock</SelectItem>
                <SelectItem value="LOW_STOCK">⚠️ Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">❌ Out of Stock</SelectItem>
                <SelectItem value="DISCONTINUED">🚫 Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        {/* Organisation */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Organisation</h2>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Brand</Label>
            <Select value={form.brandId || 'none'} onValueChange={(v) => setForm({ ...form, brandId: v === 'none' ? '' : v })}>
              <SelectTrigger>
                <SelectValue placeholder="No brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No brand</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
          <h2 className="font-semibold">Product Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Featured Product</p>
              <p className="text-xs text-stone-500">Show on homepage and featured section</p>
            </div>
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-3">
          <Button type="submit" className="w-full" size="lg" disabled={saving || uploading}>
            {saving ? (uploading ? 'Uploading images...' : 'Saving...') : isEdit ? 'Save Changes' : 'Publish Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
