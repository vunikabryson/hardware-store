import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import slugify from 'slugify'

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().nullable().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  lowStockAt: z.number().int().min(0).default(5),
  status: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK', 'DISCONTINUED']),
  isFeatured: z.boolean().default(false),
  unit: z.string().default('each'),
  weight: z.number().nullable().optional(),
  categoryId: z.string(),
  brandId: z.string().nullable().optional(),
  newImageUrls: z.array(z.string()).default([]),
})

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let unique = false
  let counter = 0
  while (!unique) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
    if (!existing || existing.id === excludeId) {
      slug = candidate
      unique = true
    }
    counter++
  }
  return slug
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const data = productSchema.parse(body)
    const slug = await generateUniqueSlug(data.name)

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        sku: data.sku || null,
        stock: data.stock,
        lowStockAt: data.lowStockAt,
        status: data.status,
        isFeatured: data.isFeatured,
        unit: data.unit,
        weight: data.weight,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        images: {
          create: data.newImageUrls.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
