import { ArtographLogo } from '@/components/ui/ArtographLogo'
import { redirect } from 'next/navigation'

export default async function Home() {
  redirect('/dashboard')
}

