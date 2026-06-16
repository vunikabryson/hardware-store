import { MessageCircle } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'
import { getWhatsAppUrl } from '@/lib/utils'

export async function WhatsAppButton() {
  const settings = await getSiteSettings()
  const url = getWhatsAppUrl(
    settings.whatsappNumber,
    `Hi ${settings.siteName}, I'd like to ask about your products.`
  )

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
    </a>
  )
}
