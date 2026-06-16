import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team for product inquiries, quotes, or support.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">Contact Us</h1>
      <p className="text-stone-500 mb-8 max-w-xl">
        Have a question about a product, pricing, or delivery? Send us a message and we'll respond as soon as possible.
      </p>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <ContactForm />

        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 p-5">
            <h2 className="font-semibold mb-4">Get in Touch</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-600 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-primary-600">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-600 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary-600">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary-600 shrink-0" />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
