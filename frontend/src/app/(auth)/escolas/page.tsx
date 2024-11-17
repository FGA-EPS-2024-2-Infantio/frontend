'use client'

import ModalSaveSchool from '@/components/School/ModalSaveSchool'
import { fetchSchools } from '@/store/slices/schoolSlice'
import { AppDispatch, RootState } from '@/store/store'
import { SchoolResponseDto } from '@/types/Schools'
import type { TableProps } from 'antd'
import { Button, Table } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Schools() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { schools, loading, error } = useSelector(
    (state: RootState) => state.school
  )
  
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
    } else if (user) {
      dispatch(fetchSchools())
    }
  }, [user, isLoading, dispatch, router])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const columns: TableProps<SchoolResponseDto>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Diretor',
      dataIndex: 'director',
      key: 'director'
    },
    {
      title: 'Quantidade de alunos',
      dataIndex: 'numberStudents',
      key: 'numberStudents'
    }
  ]

  const data: SchoolResponseDto[] = schools.map(school => ({
    id: school.id,
    name: school.name,
    director: school.directorEmail,
    numberStudents: school.numberStudents,
    createdAt: school.createdAt,
    directorEmail: school.directorEmail,
    disabled: school.disabled
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: SchoolResponseDto) => {
    router.push(`/escolas/${record.id}`)
  }

  if (isLoading) return <div>Carregando...</div>

  return user ? (
    <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Gerenciamento de escolas</h2>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>
          Adicionar escola
        </Button>
      </div>
      <Table<SchoolResponseDto>
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={record => ({
          onClick: () => handleRowClick(record)
        })}
        rowClassName={({ disabled }) =>
          classNames(
            'cursor-pointer hover:bg-gray-100 transition duration-200',
            {
              'bg-red-100 hover:!bg-red-200': disabled
            }
          )
        }
        rowHoverable={false}
        bordered
        loading={loading}
      />

      <ModalSaveSchool
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  ) : null
}
