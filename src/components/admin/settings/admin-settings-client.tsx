'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'

const FIELDS = [
  { key: 'site_name', label: 'Site Name', type: 'text' },
  { key: 'site_tagline', label: 'Tagline', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp Number (e.g. 265999000111)', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'business_hours', label: 'Business Hours', type: 'text' },
  { key: 'currency_symbol', label: 'Currency Symbol', type: 'text' },
]

export function AdminSettingsClient({ settings: initial }: { settings: Record<string, string> }) {
  const { toast } = useToast()
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      toast({ title: 'Settings saved!', variant: 'success' })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-5">
      {FIELDS.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            type={field.type}
            value={settings[field.key] || ''}
            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
          />
        </div>
      ))}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}
