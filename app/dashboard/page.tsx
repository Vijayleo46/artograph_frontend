import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Users, BookOpen, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await Promise.all([
    prisma.assignment.count(),
    prisma.client.count(),
    prisma.template.count({
      where: { OR: [{ status: 'APPROVED' }, { status: 'PRIVATE' }] }
    }),
  ])

  const recentAssignments = await prisma.assignment.findMany({
    include: {
      client: {
        select: {
          name: true,
        }
      },
      session: {
        select: {
          sessionNumber: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/dashboard/assignments/generate"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Assignment
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assignments</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats[0]}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Clients</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats[1]}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Templates</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats[2]}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentAssignments.map((assignment, idx) => (
                <li key={assignment.id}>
                  <div className="relative pb-8">
                    {idx !== recentAssignments.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assignment.client.name} - Session {assignment.session.sessionNumber}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {recentAssignments.length === 0 && (
                <li className="text-sm text-gray-500 py-4">No assignments yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

