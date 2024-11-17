'use client'

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation'

function Index() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className='flex flex-1 items-center justify-center p-6'>
      <div className='rounded-lg bg-white/30 p-6 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {user ? `Olá ${user.nickname}! 👋` : 'Olá Visitante! 👋'}
        </h1>
        <p className='mt-2 text-lg text-gray-600'>
          Bem-vindo ao sistema{' '}
          <span className='font-semibold text-green-700'>Infantio</span>, utilize o menu lateral para navegar.
        </p>
        <div className='mt-4'>
          {user ? (
            <a href="/api/auth/logout" className="px-4 py-2 bg-red-500 text-white rounded">Logout</a>
          ) : (
            <a href="/api/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;