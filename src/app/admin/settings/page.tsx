import { prisma } from '@/lib/prisma'
import { AdminSettingsClient } from '@/components/admin/settings/admin-settings-client'

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findMany()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold">Site Settings</h1>
      <AdminSettingsClient settings={map} />
    </div>
  )
}
