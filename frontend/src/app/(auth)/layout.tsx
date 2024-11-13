'use client'

import Sidebar from '@/components/Sidebar'
import { UserProvider } from '@auth0/nextjs-auth0/client'

type Props = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <UserProvider>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-6'>{children}</div>
      </div>
    </UserProvider>
  )
}