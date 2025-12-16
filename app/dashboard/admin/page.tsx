import { prisma } from '@/lib/prisma'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {

  const pendingTemplates = await prisma.template.findMany({
    where: { status: 'PENDING' },
    include: {
      therapist: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    totalUsers: await prisma.user.count(),
    totalClients: await prisma.client.count(),
    totalAssignments: await prisma.assignment.count(),
    pendingTemplates: pendingTemplates.length,
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AdminDashboard initialPendingTemplates={pendingTemplates} stats={stats} />
    </div>
  )
}

