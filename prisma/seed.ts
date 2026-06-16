import { PrismaClient, Role, ProductStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hardwarestore.com' },
    update: {},
    create: {
      email: 'admin@hardwarestore.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('Created admin:', admin.email)

  // Categories
  const categories = [
    { name: 'Building Materials', slug: 'building-materials', icon: '🏗️', description: 'Cement, bricks, sand, and construction materials' },
    { name: 'Plumbing', slug: 'plumbing', icon: '🔧', description: 'Pipes, fittings, valves, and plumbing tools' },
    { name: 'Electrical', slug: 'electrical', icon: '⚡', description: 'Wiring, switches, circuit breakers, and electrical supplies' },
    { name: 'Paint & Finishes', slug: 'paint-finishes', icon: '🎨', description: 'Interior, exterior paints, primers, and finishes' },
    { name: 'Tools', slug: 'tools', icon: '🔨', description: 'Hand tools, power tools, and accessories' },
    { name: 'Roofing', slug: 'roofing', icon: '🏠', description: 'Roofing sheets, tiles, gutters, and accessories' },
    { name: 'Hardware & Fasteners', slug: 'hardware-fasteners', icon: '🔩', description: 'Bolts, screws, nails, and general hardware' },
    { name: 'Safety Equipment', slug: 'safety-equipment', icon: '🦺', description: 'PPE, helmets, gloves, and safety gear' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Created categories')

  // Brands
  const brands = [
    { name: 'Lafarge', slug: 'lafarge' },
    { name: 'PPC', slug: 'ppc' },
    { name: 'Dulux', slug: 'dulux' },
    { name: 'Stanley', slug: 'stanley' },
    { name: 'Bosch', slug: 'bosch' },
    { name: 'Gyproc', slug: 'gyproc' },
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    })
  }
  console.log('Created brands')

  // Sample products
  const buildingCat = await prisma.category.findUnique({ where: { slug: 'building-materials' } })
  const paintCat = await prisma.category.findUnique({ where: { slug: 'paint-finishes' } })
  const toolsCat = await prisma.category.findUnique({ where: { slug: 'tools' } })
  const plumbingCat = await prisma.category.findUnique({ where: { slug: 'plumbing' } })
  const lafarge = await prisma.brand.findUnique({ where: { slug: 'lafarge' } })
  const dulux = await prisma.brand.findUnique({ where: { slug: 'dulux' } })
  const bosch = await prisma.brand.findUnique({ where: { slug: 'bosch' } })

  const products = [
    {
      name: 'Portland Cement 50kg',
      slug: 'portland-cement-50kg',
      description: 'High-quality Portland cement for all construction needs. Suitable for foundations, walls, and general masonry work.',
      price: 18500,
      sku: 'CEM-POR-50',
      stock: 200,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: buildingCat!.id,
      brandId: lafarge!.id,
      unit: 'bag',
    },
    {
      name: 'Dulux Weathershield Exterior Paint 20L',
      slug: 'dulux-weathershield-exterior-20l',
      description: 'Premium exterior paint with advanced weather protection. Lasts up to 8 years. Available in 100+ colours.',
      price: 45000,
      sku: 'PAI-DUL-EXT-20',
      stock: 45,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: paintCat!.id,
      brandId: dulux!.id,
      unit: 'litre',
    },
    {
      name: 'Bosch 20V Cordless Drill',
      slug: 'bosch-20v-cordless-drill',
      description: 'Professional grade cordless drill with 20V lithium battery. Includes 2 batteries and charger.',
      price: 89000,
      sku: 'TOO-BOS-DRL-20V',
      stock: 15,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: toolsCat!.id,
      brandId: bosch!.id,
      unit: 'each',
    },
    {
      name: 'PVC Pipe 110mm x 3m',
      slug: 'pvc-pipe-110mm-3m',
      description: 'High-pressure PVC pipe for drainage and sewage. SABS approved.',
      price: 8500,
      sku: 'PLU-PVC-110-3M',
      stock: 80,
      status: ProductStatus.IN_STOCK,
      isFeatured: false,
      categoryId: plumbingCat!.id,
      unit: 'length',
    },
    {
      name: 'River Sand 1 Ton',
      slug: 'river-sand-1-ton',
      description: 'Clean washed river sand for plastering and brickwork. Delivered per ton.',
      price: 12000,
      sku: 'BLD-SND-1T',
      stock: 3,
      lowStockAt: 5,
      status: ProductStatus.LOW_STOCK,
      isFeatured: false,
      categoryId: buildingCat!.id,
      unit: 'ton',
    },
    {
      name: 'Wire Nails 5kg Box (2.5mm)',
      slug: 'wire-nails-5kg-2-5mm',
      description: 'Galvanised wire nails, 2.5mm diameter, 75mm length. 5kg box.',
      price: 3500,
      sku: 'HRD-NLS-2.5-75',
      stock: 0,
      status: ProductStatus.OUT_OF_STOCK,
      isFeatured: false,
      categoryId: buildingCat!.id,
      unit: 'box',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('Created products')

  // Site settings
  const settings = [
    { key: 'site_name', value: 'BuildRight Hardware' },
    { key: 'site_tagline', value: 'Your Trusted Building Partner' },
    { key: 'contact_email', value: 'info@buildright.co.mw' },
    { key: 'contact_phone', value: '+265 999 000 111' },
    { key: 'whatsapp_number', value: '265999000111' },
    { key: 'address', value: 'Kamuzu Procession Road, Blantyre, Malawi' },
    { key: 'business_hours', value: 'Mon-Fri: 7am-5pm, Sat: 7am-1pm' },
    { key: 'currency', value: 'MWK' },
    { key: 'currency_symbol', value: 'MWK' },
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('Created site settings')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
