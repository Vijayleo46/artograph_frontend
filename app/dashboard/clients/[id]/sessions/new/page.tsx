import { NewSessionForm } from '@/components/clients/NewSessionForm'

export default async function NewSessionPage({ params }: { params: { id: string } }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <NewSessionForm clientId={params.id} />
    </div>
  )
}

