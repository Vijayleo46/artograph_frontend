import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    const sessionId = searchParams.get('sessionId')

    const where: any = {}
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (sessionId) {
      where.sessionId = sessionId
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        session: {
          select: {
            id: true,
            sessionNumber: true,
            focusArea: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(assignments)
  } catch (error: any) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, taskDescription, learningObjectives, reflectionPrompts, estimatedTime, difficultyLevel, customFields, clientId, sessionId, parentAssignmentId, therapistId } = body

    // Get therapist ID from client or use provided one
    let assignedTherapistId = therapistId
    if (!assignedTherapistId && clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      })
      assignedTherapistId = client?.therapistId
    }
    
    if (!assignedTherapistId) {
      const firstTherapist = await prisma.user.findFirst({
        where: { role: 'THERAPIST' }
      })
      assignedTherapistId = firstTherapist?.id
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        taskDescription,
        learningObjectives,
        reflectionPrompts,
        estimatedTime,
        difficultyLevel,
        customFields: customFields ? (typeof customFields === 'string' ? customFields : JSON.stringify(customFields)) : null,
        therapistId: assignedTherapistId || '',
        clientId,
        sessionId,
        parentAssignmentId: parentAssignmentId || null,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(assignment)
  } catch (error: any) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

