import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description, icon } = await req.json()
  let slug = slugify(name, { lower: true, strict: true })
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing && existing.id !== params.id) slug = `${slug}-${Date.now()}`

  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, slug, description, icon },
  })
  return NextResponse.json({ success: true, category })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
