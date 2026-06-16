'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

type Message = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  createdAt: Date
}

export function AdminMessagesClient({ messages }: { messages: Message[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selected, setSelected] = useState<Message | null>(null)

  async function markRead(id: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    })
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    toast({ title: 'Message deleted', variant: 'success' })
    setSelected(null)
    router.refresh()
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-200px)] min-h-96">
      <div className="bg-white rounded-lg border border-stone-200 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-stone-400">No messages yet.</div>
        ) : messages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg.id) }}
            className={`w-full text-left p-4 border-b border-stone-100 hover:bg-stone-50 ${selected?.id === msg.id ? 'bg-primary-50' : ''}`}
          >
            <div className="flex items-start gap-2">
              {msg.isRead ? (
                <MailOpen className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
              ) : (
                <Mail className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${msg.isRead ? 'font-normal' : 'font-semibold'}`}>{msg.name}</p>
                  <p className="text-xs text-stone-400 shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-stone-600 truncate">{msg.subject}</p>
                <p className="text-xs text-stone-400 truncate">{msg.message}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-5">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <p className="text-sm text-stone-500">From: {selected.name} ({selected.email})</p>
                {selected.phone && <p className="text-sm text-stone-500">Phone: {selected.phone}</p>}
                <p className="text-xs text-stone-400">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                className="p-2 rounded hover:bg-red-50 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="border-t border-stone-100 pt-4">
              <p className="text-stone-700 whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Mail className="h-4 w-4" /> Reply by Email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            Select a message to view
          </div>
        )}
      </div>
    </div>
  )
}
