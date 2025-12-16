import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    const where: any = {}
    if (clientId) {
      where.clientId = clientId
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            assignments: true,
          }
        }
      },
      orderBy: {
        sessionNumber: 'desc'
      }
    })

    return NextResponse.json(sessions)
  } catch (error: any) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientId, sessionNumber, summary, focusArea, therapistId } = body

    // Get client to find therapist
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const assignedTherapistId = therapistId || client.therapistId

    // Get the next session number if not provided
    let nextSessionNumber = sessionNumber
    if (!nextSessionNumber) {
      const lastSession = await prisma.session.findFirst({
        where: {
          therapistId: assignedTherapistId,
          clientId: clientId,
        },
        orderBy: {
          sessionNumber: 'desc'
        }
      })
      nextSessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1
    }

    const newSession = await prisma.session.create({
      data: {
        sessionNumber: nextSessionNumber,
        summary: summary || null,
        focusArea: focusArea || null,
        therapistId: assignedTherapistId,
        clientId: clientId,
      },
    })

    return NextResponse.json(newSession)
  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    )
  }
}

