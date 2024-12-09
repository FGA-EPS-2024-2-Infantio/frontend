import Sidebar from '@/components/Sidebar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../utils/authOptions'

type Props = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
      <div className='flex'>
        <Sidebar session={session} />
        <div className='flex-1 p-6'>{children}</div>
      </div>
  )
}
