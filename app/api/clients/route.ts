import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        sessions: {
          orderBy: {
            sessionNumber: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            assignments: true,
            sessions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(clients)
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, age, gender, condition, therapyGoals, therapistId } = body

    // Get first therapist if not provided
    let assignedTherapistId = therapistId
    if (!assignedTherapistId) {
      const firstTherapist = await prisma.user.findFirst({
        where: { role: 'THERAPIST' }
      })
      if (!firstTherapist) {
        // Create a default therapist if none exists
        const defaultTherapist = await prisma.user.create({
          data: {
            email: 'therapist@example.com',
            password: 'default',
            name: 'Default Therapist',
            role: 'THERAPIST',
          }
        })
        assignedTherapistId = defaultTherapist.id
      } else {
        assignedTherapistId = firstTherapist.id
      }
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        condition: condition || null,
        therapyGoals: therapyGoals || null,
        therapistId: assignedTherapistId,
      },
    })

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 500 }
    )
  }
}

