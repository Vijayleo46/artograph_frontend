import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status, tags } = body

    const existing = await prisma.template.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Only admin can approve/reject, therapist can only publish (set to PENDING)
    if (status === 'APPROVED' || status === 'REJECTED') {
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else if (status === 'PENDING') {
      if (session.user.role !== 'THERAPIST' || existing.therapistId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      if (session.user.role === 'THERAPIST' && existing.therapistId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === 'APPROVED') {
        updateData.approvedAt = new Date()
        updateData.approvedBy = session.user.id
      }
    }
    if (tags) {
      updateData.tags = tags
    }

    const updated = await prisma.template.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update template' },
      { status: 500 }
    )
  }
}




