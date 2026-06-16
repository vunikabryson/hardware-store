import { prisma } from '@/lib/prisma'
import { Prisma, ProductStatus } from '@prisma/client'

export type ProductFilters = {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  featured?: boolean
  sort?: string
  page?: number
  pageSize?: number
}

const productInclude = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  category: { select: { name: true, slug: true } },
  brand: { select: { name: true } },
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    status,
    featured,
    sort = 'newest',
    page = 1,
    pageSize = 12,
  } = filters

  const where: Prisma.ProductWhereInput = {
    isArchived: false,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (brand) {
    where.brand = { slug: brand }
  }

  if (status) {
    where.status = status as ProductStatus
  }

  if (featured) {
    where.isFeatured = true
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price_asc'
      ? { price: 'asc' }
      : sort === 'price_desc'
      ? { price: 'desc' }
      : sort === 'name_asc'
      ? { name: 'asc' }
      : { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pageCount: Math.ceil(total / pageSize),
    page,
  }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  })
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      isArchived: false,
    },
    include: productInclude,
    take: limit,
  })
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPriceRange() {
  const result = await prisma.product.aggregate({
    where: { isArchived: false },
    _min: { price: true },
    _max: { price: true },
  })
  return {
    min: result._min.price ? Number(result._min.price) : 0,
    max: result._max.price ? Number(result._max.price) : 100000,
  }
}

export async function getAllBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}
