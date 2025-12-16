import { AssignmentEditor } from '@/components/assignments/AssignmentEditor'

export default function EditAssignmentPage({ params }: { params: { id: string } }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AssignmentEditor assignmentId={params.id} />
    </div>
  )
}




