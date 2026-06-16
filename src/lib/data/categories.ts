import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const getActiveCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isArchived: false } } },
        },
      },
    })
  },
  ['active-categories'],
  { revalidate: 60, tags: ['categories'] }
)
