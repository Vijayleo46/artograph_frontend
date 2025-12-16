import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

