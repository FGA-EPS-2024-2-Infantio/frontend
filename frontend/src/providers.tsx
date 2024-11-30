'use client'
import { store } from '@/store/store'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#22c55e'
            }
          }}
        >
          <SessionProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </SessionProvider>
        </ConfigProvider>
      </Provider>
      <ToastContainer style={{ zIndex: 99999 }} />
    </>
  )
}
