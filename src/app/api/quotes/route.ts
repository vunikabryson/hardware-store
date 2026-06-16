import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateQuoteNumber } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const quoteItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

const quoteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, 'At least one product is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = quoteSchema.parse(body)
    const session = await getServerSession(authOptions)

    const quote = await prisma.quoteRequest.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        userId: session?.user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, quote }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.flatten() }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to submit quote request' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Number(searchParams.get('page')) || 1
  const pageSize = 20

  const where = status ? { status: status as any } : {}

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      include: { items: { include: { product: { select: { name: true, sku: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.quoteRequest.count({ where }),
  ])

  return NextResponse.json({ quotes, total, pageCount: Math.ceil(total / pageSize) })
}
