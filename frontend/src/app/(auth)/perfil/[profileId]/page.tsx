
import { authOptions } from '@/app/utils/authOptions'
import { getServerSession } from 'next-auth'

type Props = {
  params: {
    profileId: string
  }
}

export default async function Profile(props: Props) {
  const session = await getServerSession(authOptions)
  const url =
    process.env.NEXT_PUBLIC_API_URL + `/users/${props.params.profileId}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.backendTokens.accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  const user = await response.json()

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='text-2xl font-extrabold text-gray-900'>
        Olá, <span className='text-green-600'>{user.name}</span>!
      </h2>
      <p className='text-lg text-gray-700'>
        Seu e-mail é:{' '}
        <span className='font-medium text-green-900'>{user.email}</span>
      </p>
    </div>
  )
}
