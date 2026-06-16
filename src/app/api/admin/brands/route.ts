import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  let slug = slugify(name, { lower: true, strict: true })
  const existing = await prisma.brand.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`
  const brand = await prisma.brand.create({ data: { name, slug } })
  return NextResponse.json({ success: true, brand }, { status: 201 })
}
