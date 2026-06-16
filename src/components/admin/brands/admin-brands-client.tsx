'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

type Brand = { id: string; name: string; slug: string; isActive: boolean; productCount: number }

export function AdminBrandsClient({ brands: initial }: { brands: Brand[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  function openNew() { setEditing(null); setName(''); setDialogOpen(true) }
  function openEdit(b: Brand) { setEditing(b); setName(b.name); setDialogOpen(true) }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      const url = editing ? `/api/admin/brands/${editing.id}` : '/api/admin/brands'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to save brand')
      toast({ title: editing ? 'Brand updated' : 'Brand created', variant: 'success' })
      setDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(b: Brand) {
    if (b.productCount > 0) {
      toast({ title: 'Cannot delete', description: `This brand has ${b.productCount} products.`, variant: 'destructive' })
      return
    }
    if (!confirm(`Delete brand "${b.name}"?`)) return
    await fetch(`/api/admin/brands/${b.id}`, { method: 'DELETE' })
    toast({ title: 'Brand deleted', variant: 'success' })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New Brand</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {initial.map((brand) => (
          <div key={brand.id} className="bg-white rounded-lg border border-stone-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{brand.name}</p>
              <p className="text-xs text-stone-400">{brand.productCount} products</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(brand)} className="p-1.5 rounded hover:bg-stone-100 text-stone-500">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(brand)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Brand' : 'New Brand'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Brand Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dulux" />
            </div>
            <div className="flex gap-3 justify-end">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Save' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
