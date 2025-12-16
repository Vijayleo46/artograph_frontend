import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      sessions: {
        include: {
          assignments: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              assignments: true
            }
          }
        },
        orderBy: {
          sessionNumber: 'desc'
        }
      },
      _count: {
        select: {
          assignments: true,
          sessions: true,
        }
      }
    }
  })

  if (!client) {
    return <div className="text-center py-12 text-red-600">Client not found</div>
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-600 mt-1">{client.email}</p>
        </div>
        <Link
          href={`/dashboard/clients/${client.id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Client
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
          <div className="space-y-2 text-sm">
            {client.age && <p><strong>Age:</strong> {client.age}</p>}
            {client.gender && <p><strong>Gender:</strong> {client.gender}</p>}
            {client.condition && <p><strong>Condition:</strong> {client.condition}</p>}
            {client.therapyGoals && (
              <div>
                <strong>Therapy Goals:</strong>
                <p className="mt-1 text-gray-600">{client.therapyGoals}</p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <p><strong>Total Sessions:</strong> {client._count.sessions}</p>
              <p><strong>Total Assignments:</strong> {client._count.assignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Sessions</h2>
            <Link
              href={`/dashboard/clients/${client.id}/sessions/new`}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Session
            </Link>
          </div>
          <div className="space-y-4">
            {client.sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">Session {session.sessionNumber}</h3>
                    {session.focusArea && (
                      <p className="text-sm text-gray-600">{session.focusArea}</p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/assignments/generate?clientId=${client.id}&sessionId=${session.id}`}
                    className="text-sm text-primary-600 hover:text-primary-900"
                  >
                    Generate Assignment
                  </Link>
                </div>
                {session.summary && (
                  <p className="text-sm text-gray-600 mt-2">{session.summary}</p>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {session._count.assignments} assignment(s)
                </div>
                {session.assignments.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {session.assignments.map((assignment) => (
                      <Link
                        key={assignment.id}
                        href={`/dashboard/assignments/${assignment.id}/edit`}
                        className="block text-sm text-primary-600 hover:text-primary-900"
                      >
                        {assignment.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {client.sessions.length === 0 && (
              <p className="text-sm text-gray-500">No sessions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

