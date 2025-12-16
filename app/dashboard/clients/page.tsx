import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, UserPlus } from 'lucide-react'
import { ClientForm } from '@/components/clients/ClientForm'

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: {
          sessions: true,
          assignments: true,
        }
      },
      sessions: {
        orderBy: {
          sessionNumber: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <ClientForm />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div key={client.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="text-primary-600 hover:text-primary-900 text-sm"
              >
                View
              </Link>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {client.email}</p>
              {client.age && <p><strong>Age:</strong> {client.age}</p>}
              {client.gender && <p><strong>Gender:</strong> {client.gender}</p>}
              {client.condition && <p><strong>Condition:</strong> {client.condition}</p>}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p><strong>Sessions:</strong> {client._count.sessions}</p>
                <p><strong>Assignments:</strong> {client._count.assignments}</p>
              </div>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No clients yet. Add your first client to get started.
          </div>
        )}
      </div>
    </div>
  )
}

