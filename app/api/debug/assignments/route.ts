import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Get the last 5 assignments
    const assignments = await prisma.assignment.findMany({
      take: -5, // Last 5
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        client: {
          select: { name: true, email: true }
        },
        session: {
          select: { sessionNumber: true }
        }
      }
    })

    return NextResponse.json({
      count: assignments.length,
      assignments: assignments.map(a => ({
        id: a.id,
        title: a.title,
        client: a.client?.name,
        createdAt: a.createdAt,
      }))
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
