import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        sessions: {
          orderBy: {
            sessionNumber: 'desc'
          },
          include: {
            assignments: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        },
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (session.user.role === 'THERAPIST' && client.therapistId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, age, gender, condition, therapyGoals } = body

    const existing = await prisma.client.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (session.user.role === 'THERAPIST' && existing.therapistId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        email: email || existing.email,
        age: age ? parseInt(age) : existing.age,
        gender: gender !== undefined ? gender : existing.gender,
        condition: condition !== undefined ? condition : existing.condition,
        therapyGoals: therapyGoals !== undefined ? therapyGoals : existing.therapyGoals,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update client' },
      { status: 500 }
    )
  }
}




