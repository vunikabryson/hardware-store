import { Metadata } from 'next'
import { Truck, ShieldCheck, Headphones, Users, Award, Clock } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our hardware store, our mission, and why customers trust us for their building material needs.',
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const values = [
    { icon: ShieldCheck, title: 'Quality Assured', text: 'We stock only trusted, quality-tested brands and materials.' },
    { icon: Truck, title: 'Reliable Delivery', text: 'Fast and dependable delivery across the city and surrounding areas.' },
    { icon: Headphones, title: 'Expert Advice', text: 'Our team has years of experience and is happy to help you choose the right products.' },
    { icon: Users, title: 'Customer First', text: 'We build long-term relationships with homeowners and contractors alike.' },
    { icon: Award, title: 'Competitive Pricing', text: 'Bulk and contractor pricing available — request a quote anytime.' },
    { icon: Clock, title: 'Always Open', text: settings.businessHours },
  ]

  return (
    <div>
      <section className="bg-stone-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">About {settings.siteName}</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-lg">
            {settings.tagline} — supplying quality building materials, tools, and supplies to homeowners and contractors.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-stone-600 mb-4">
              {settings.siteName} was founded with a simple mission: to make quality building materials and
              tools accessible and affordable for everyone — from individual homeowners doing small repairs
              to large contractors managing major construction projects.
            </p>
            <p className="text-stone-600">
              Today, we stock thousands of products across building materials, plumbing, electrical, paint,
              tools, roofing, hardware, and safety equipment — all backed by a team that genuinely cares
              about helping you get your project done right.
            </p>
          </div>
          <div className="rounded-lg bg-primary-50 border border-primary-100 p-8 text-center">
            <p className="font-display text-5xl font-bold text-primary-600 mb-2">8+</p>
            <p className="text-stone-600">Product categories covering everything you need to build</p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold mb-6 text-center">Why Choose Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="rounded-lg border border-stone-200 p-6">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-stone-500">{v.text}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
