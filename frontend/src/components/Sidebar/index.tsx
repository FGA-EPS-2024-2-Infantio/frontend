'use client'

import { HomeOutlined } from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [getItem('Escolas', '1', <HomeOutlined />),getItem('Professores', '2', <UserOutlined />)]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const router = useRouter()

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSelectedKey(e.key)
    if (e.key === '1') {
      router.push('/escolas')
    }
    if (e.key === '2') {
      router.push('/professores')
    }
  }

  const handleLogoClick = () => {
    setSelectedKey(null)
    router.push('/')
  }

  return (
    <div className='flex min-h-screen'>
      <Sider
        theme='light'
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        className='shadow-lg'
      >
        <div
          className='flex h-16 cursor-pointer items-center justify-center text-lg font-semibold text-green-700'
          onClick={handleLogoClick}
        >
          Infantio
        </div>
        <Menu
          mode='inline'
          items={items}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onClick={handleMenuClick}
        />
      </Sider>
    </div>
  )
}
