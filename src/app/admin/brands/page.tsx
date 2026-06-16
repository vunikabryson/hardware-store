import { prisma } from '@/lib/prisma'
import { AdminBrandsClient } from '@/components/admin/brands/admin-brands-client'

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Brands</h1>
      <AdminBrandsClient brands={brands.map((b) => ({ ...b, productCount: b._count.products }))} />
    </div>
  )
}
