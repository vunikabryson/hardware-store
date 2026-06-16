import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  let slug = slugify(name, { lower: true, strict: true })
  const existing = await prisma.brand.findUnique({ where: { slug } })
  if (existing && existing.id !== params.id) slug = `${slug}-${Date.now()}`
  const brand = await prisma.brand.update({ where: { id: params.id }, data: { name, slug } })
  return NextResponse.json({ success: true, brand })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.brand.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
