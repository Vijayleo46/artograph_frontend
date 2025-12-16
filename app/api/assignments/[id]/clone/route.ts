import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { clientId, sessionId } = body

    const original = await prisma.assignment.findUnique({
      where: { id: params.id }
    })

    if (!original) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    const cloned = await prisma.assignment.create({
      data: {
        title: `${original.title} (Copy)`,
        taskDescription: original.taskDescription,
        learningObjectives: original.learningObjectives,
        reflectionPrompts: original.reflectionPrompts,
        estimatedTime: original.estimatedTime,
        difficultyLevel: original.difficultyLevel,
        customFields: original.customFields,
        therapistId: original.therapistId,
        clientId: clientId || original.clientId,
        sessionId: sessionId || original.sessionId,
        parentAssignmentId: original.id,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(cloned)
  } catch (error: any) {
    console.error('Error cloning assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to clone assignment' },
      { status: 500 }
    )
  }
}




