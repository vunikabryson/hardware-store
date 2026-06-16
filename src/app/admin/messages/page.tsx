import { prisma } from '@/lib/prisma'
import { AdminMessagesClient } from '@/components/admin/messages/admin-messages-client'

export default async function AdminMessagesPage() {
  const messages = await prisma.contactForm.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Contact Messages</h1>
      <AdminMessagesClient messages={messages} />
    </div>
  )
}
