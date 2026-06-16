'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

const statuses = ['PENDING', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'EXPIRED']
const statusColors: Record<string, string> = {
  PENDING: 'text-amber-700',
  REVIEWING: 'text-blue-700',
  QUOTED: 'text-purple-700',
  ACCEPTED: 'text-green-700',
  REJECTED: 'text-red-700',
  EXPIRED: 'text-stone-600',
}

export function QuoteStatusUpdater({ quoteId, currentStatus }: { quoteId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleUpdate() {
    setSaving(true)
    const res = await fetch(`/api/admin/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSaving(false)
    if (res.ok) {
      toast({ title: 'Status updated', variant: 'success' })
      router.refresh()
    } else {
      toast({ title: 'Failed to update status', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" disabled={saving || status === currentStatus} onClick={handleUpdate}>
        {saving ? 'Saving...' : 'Update Status'}
      </Button>
    </div>
  )
}
