import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-[#0a1931] mt-14 lg:mt-0 pb-16 lg:pb-0 relative overflow-x-hidden w-full">{children}</main>
    </div>
  )
}
