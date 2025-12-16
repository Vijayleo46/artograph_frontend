import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const tags = searchParams.get('tags')?.split(',')

    const where: any = {}
    
    if (session.user.role === 'THERAPIST') {
      // Therapists see their own templates and approved public ones
      where.OR = [
        { therapistId: session.user.id },
        { status: 'APPROVED' }
      ]
    } else if (session.user.role === 'ADMIN') {
      // Admins see all templates
      if (status) {
        where.status = status
      }
    } else {
      // Others only see approved public templates
      where.status = 'APPROVED'
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      }
    }

    const templates = await prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        title: true,
        taskDescription: true,
        learningObjectives: true,
        reflectionPrompts: true,
        estimatedTime: true,
        difficultyLevel: true,
        tags: true,
        status: true,
        createdAt: true,
        therapist: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(templates)
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const therapistId = session?.user?.id || 'system-user'
    
    const body = await req.json()
    const { title, taskDescription, learningObjectives, reflectionPrompts, estimatedTime, difficultyLevel, customFields, tags, status } = body

    const template = await prisma.template.create({
      data: {
        title,
        taskDescription,
        learningObjectives,
        reflectionPrompts,
        estimatedTime,
        difficultyLevel,
        customFields: customFields || {},
        tags: tags || [],
        status: status || 'PRIVATE',
        therapistId,
      },
    })

    return NextResponse.json(template)
  } catch (error: any) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    )
  }
}


