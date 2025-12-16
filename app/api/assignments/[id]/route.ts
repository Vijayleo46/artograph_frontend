import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Debug: log incoming request for troubleshooting
    console.log('[GET] /api/assignments/' + params.id, { url: req.url, headers: Object.fromEntries(req.headers.entries()) })
    // No auth required - per NO_LOGIN_NEEDED.md
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        session: true,
        therapist: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error: any) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No auth required - per NO_LOGIN_NEEDED.md
    const body = await req.json()
    const { title, taskDescription, learningObjectives, reflectionPrompts, estimatedTime, difficultyLevel, customFields } = body

    const existing = await prisma.assignment.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Create new version
    const updated = await prisma.assignment.create({
      data: {
        title: title || existing.title,
        taskDescription: taskDescription || existing.taskDescription,
        learningObjectives: learningObjectives || existing.learningObjectives,
        reflectionPrompts: reflectionPrompts || existing.reflectionPrompts,
        estimatedTime: estimatedTime ?? existing.estimatedTime,
        difficultyLevel: difficultyLevel || existing.difficultyLevel,
        customFields: customFields || existing.customFields,
        therapistId: existing.therapistId,
        clientId: existing.clientId,
        sessionId: existing.sessionId,
        parentAssignmentId: existing.parentAssignmentId || existing.id,
        version: existing.version + 1,
        status: existing.status,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await prisma.assignment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}




