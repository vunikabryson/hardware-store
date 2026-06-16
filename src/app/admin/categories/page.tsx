import { prisma } from '@/lib/prisma'
import { AdminCategoriesClient } from '@/components/admin/categories/admin-categories-client'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { isArchived: false } } } } },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Categories</h1>
      <AdminCategoriesClient categories={categories.map(c => ({ ...c, productCount: c._count.products }))} />
    </div>
  )
}
