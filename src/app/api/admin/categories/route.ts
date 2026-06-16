import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { name, description, icon } = await req.json()
  let slug = slugify(name, { lower: true, strict: true })
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  const category = await prisma.category.create({ data: { name, slug, description, icon } })
  return NextResponse.json({ success: true, category }, { status: 201 })
}
