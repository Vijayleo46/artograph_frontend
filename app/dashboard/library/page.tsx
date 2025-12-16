import { prisma } from '@/lib/prisma'
import { PublicLibrary } from '@/components/library/PublicLibrary'

export default async function LibraryPage() {
  const templates = await prisma.template.findMany({
    where: { OR: [{ status: 'APPROVED' }, { status: 'PRIVATE' }] },
    include: {
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PublicLibrary initialTemplates={templates} userRole="ADMIN" />
    </div>
  )
}

