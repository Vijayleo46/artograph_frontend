'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'

interface AssignmentActionsProps {
  assignmentId: string
}

export default function AssignmentActions({ assignmentId }: AssignmentActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to delete assignment')
      }

      toast({ title: 'Assignment deleted', description: 'The assignment was removed.' })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({ title: 'Delete failed', description: String(error) })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <Link
        href={`/dashboard/assignments/${assignmentId}/edit`}
        className="text-primary-600 hover:text-primary-900"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Button
        variant="ghost"
        className="text-red-600 hover:text-red-900"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}