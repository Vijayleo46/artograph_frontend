import { Suspense } from 'react'
import { AssignmentGenerator } from '@/components/assignments/AssignmentGenerator'

function GenerateAssignmentContent() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AssignmentGenerator />
    </div>
  )
}

export default function GenerateAssignmentPage() {
  return (
    <Suspense fallback={<div className="px-4 sm:px-6 lg:px-8"><div className="text-center py-12">Loading...</div></div>}>
      <GenerateAssignmentContent />
    </Suspense>
  )
}

