import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAssignmentEmail } from '@/lib/email'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { therapistNote } = body

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        therapist: true,
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Send email
    const emailResult = await sendAssignmentEmail({
      to: assignment.client.email,
      therapistName: assignment.therapist?.name || 'Therapist',
      assignmentTitle: assignment.title,
      taskDescription: assignment.taskDescription,
      learningObjectives: assignment.learningObjectives,
      reflectionPrompts: assignment.reflectionPrompts,
      therapistNote: therapistNote,
    })

    // Log email
    const emailLog = await prisma.emailLog.create({
      data: {
        assignmentId: assignment.id,
        therapistId: assignment.therapistId,
        clientEmail: assignment.client.email,
        subject: `Therapy Assignment: ${assignment.title}`,
        status: emailResult.success ? 'sent' : 'failed',
        messageId: emailResult.messageId || null,
        errorMessage: emailResult.error || null,
      },
    })

    // Update assignment status
    if (emailResult.success) {
      await prisma.assignment.update({
        where: { id: params.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      success: emailResult.success,
      emailLog,
      error: emailResult.error,
    })
  } catch (error: any) {
    console.error('Error sending assignment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send assignment' },
      { status: 500 }
    )
  }
}




