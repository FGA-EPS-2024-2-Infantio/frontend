'use client'

export default function Home() {
  return (
    <div className='flex flex-1 items-center justify-center p-6'>
      <div className='rounded-lg bg-white/30 p-6 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Olá Nome! 👋</h1>
        <p className='mt-2 text-lg text-gray-600'>
          Bem-vindo ao sistema{' '}
          <span className='font-semibold text-green-700'>Infantio</span>,
          utilize o menu lateral para navegar.
        </p>
      </div>
    </div>
  )
}
