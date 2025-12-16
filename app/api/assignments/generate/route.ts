import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { generateAssignment } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientId, sessionId, visibility, preferences, therapistId } = body

    // Fetch client and session data
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { therapist: true }
    })

    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!client || !sessionData) {
      return NextResponse.json({ error: 'Client or session not found' }, { status: 404 })
    }

    // Use provided therapistId or get first therapist from database
    let assignedTherapistId = therapistId
    if (!assignedTherapistId) {
      const firstTherapist = await prisma.user.findFirst({
        where: { role: 'THERAPIST' }
      })
      assignedTherapistId = firstTherapist?.id || client.therapistId
    }

    // Generate assignment using AI
    const generated = await generateAssignment({
      clientProfile: {
        name: client.name,
        age: client.age || undefined,
        gender: client.gender || undefined,
        condition: client.condition || undefined,
        therapyGoals: client.therapyGoals || undefined,
      },
      sessionContext: {
        sessionId: sessionData.id,
        summary: sessionData.summary || undefined,
        focusArea: sessionData.focusArea || undefined,
      },
      preferences: preferences || {},
      visibility: visibility || 'PRIVATE',
    })

    // Create assignment in database
    const assignment = await prisma.assignment.create({
      data: {
        title: generated.title,
        taskDescription: generated.taskDescription,
        learningObjectives: generated.learningObjectives,
        reflectionPrompts: generated.reflectionPrompts,
        estimatedTime: generated.estimatedTime,
        difficultyLevel: generated.difficultyLevel,
        customFields: generated.customFields ? JSON.stringify(generated.customFields) : null,
        therapistId: assignedTherapistId,
        clientId: clientId,
        sessionId: sessionId,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(assignment)
  } catch (error: any) {
    console.error('Error generating assignment:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate assignment. Please try again.'
    
    if (error.message?.includes('API key')) {
      errorMessage = 'OpenAI API key is missing or invalid. Please check your .env file.'
    } else if (error.message?.includes('No response from AI')) {
      errorMessage = 'AI service did not respond. Please check your OpenAI API key and try again.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

