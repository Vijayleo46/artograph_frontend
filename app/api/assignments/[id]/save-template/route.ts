import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { tags, status } = body

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    const template = await prisma.template.create({
      data: {
        title: assignment.title,
        taskDescription: assignment.taskDescription,
        learningObjectives: assignment.learningObjectives,
        reflectionPrompts: assignment.reflectionPrompts,
        estimatedTime: assignment.estimatedTime,
        difficultyLevel: assignment.difficultyLevel,
        customFields: assignment.customFields,
        tags: tags || [],
        status: status || 'PRIVATE',
        therapistId: assignment.therapistId,
      },
    })

    return NextResponse.json(template)
  } catch (error: any) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save template' },
      { status: 500 }
    )
  }
}




