'use client'
import { store } from '@/store/store'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#22c55e'
              }
            }}
          >
            <AntdRegistry>{children}</AntdRegistry>
          </ConfigProvider>
        </Provider>
        <ToastContainer style={{ zIndex: 99999 }} />
      </SessionProvider>
    </>
  )
}
