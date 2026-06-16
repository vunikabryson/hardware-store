import { prisma } from './prisma'
import { unstable_cache } from 'next/cache'

export const getSiteSettings = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findMany()
    const map: Record<string, string> = {}
    for (const s of settings) map[s.key] = s.value
    return {
      siteName: map.site_name || 'BuildRight Hardware',
      tagline: map.site_tagline || 'Your Trusted Building Partner',
      contactEmail: map.contact_email || 'info@buildright.co.mw',
      contactPhone: map.contact_phone || '+265 999 000 111',
      whatsappNumber: map.whatsapp_number || '265999000111',
      address: map.address || 'Blantyre, Malawi',
      businessHours: map.business_hours || 'Mon-Fri: 7am-5pm',
      currencySymbol: map.currency_symbol || 'MWK',
    }
  },
  ['site-settings'],
  { revalidate: 60, tags: ['settings'] }
)
