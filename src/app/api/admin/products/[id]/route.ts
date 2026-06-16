import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import slugify from 'slugify'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { newImageUrls = [], deletedImageIds = [], ...rest } = body

    // Build unique slug
    let slug = slugify(rest.name, { lower: true, strict: true })
    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } })
    if (existing && existing.id !== params.id) {
      slug = `${slug}-${Date.now()}`
    }

    // Delete removed images
    if (deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({ where: { id: { in: deletedImageIds } } })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: rest.name,
        slug,
        description: rest.description,
        price: rest.price,
        comparePrice: rest.comparePrice ?? null,
        sku: rest.sku || null,
        stock: rest.stock,
        lowStockAt: rest.lowStockAt,
        status: rest.status,
        isFeatured: rest.isFeatured,
        unit: rest.unit,
        weight: rest.weight ?? null,
        categoryId: rest.categoryId,
        brandId: rest.brandId || null,
        images: newImageUrls.length > 0 ? {
          create: newImageUrls.map((url: string, i: number) => ({
            url,
            isPrimary: false,
            sortOrder: 100 + i,
          })),
        } : undefined,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const body = await req.json()
  const product = await prisma.product.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json({ success: true, product })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
