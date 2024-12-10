'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const SignInButton = () => {
  const { data: session } = useSession()

  if (session && session.user)
    return (
      <div className='ml-auto flex gap-4'>
        <p className='text-sky-600'>{session.user.name}</p>
        <Link
          href={'/api/auth/signout'}
          className='ml-auto flex gap-4 text-red-600'
        >
          Sign Out
        </Link>
      </div>
    )

  return (
    <div className='ml-auto flex items-center gap-4'>
      <Link
        href={'/api/auth/signin'}
        className='ml-auto flex gap-4 text-green-600'
      >
        Sign In
      </Link>
    </div>
  )
}

export default SignInButton
