import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/products/product-form'

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Add New Product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
