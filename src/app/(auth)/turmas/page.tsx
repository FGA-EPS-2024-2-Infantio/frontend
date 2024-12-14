'use client'

import ModalSaveClass from '@/components/Class/ModalSaveClass'
import { fetchClasses } from '@/store/slices/classSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ClassResponseDto } from '@/types/Classes'
import type { TableProps } from 'antd'
import { Button, Table } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function Classes() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { classes, loading, error } = useSelector(
    (state: RootState) => state.class
  )

  const session = useSession()

  useEffect(() => {
    dispatch(fetchClasses(session.data?.user.id ?? ""))
  }, [dispatch, session.data?.user.id])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const columns: TableProps<ClassResponseDto>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Professor',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (_, classObj) => {
        return <div>{classObj.teacher.name}</div>
      }
    }
  ]

  const data: ClassResponseDto[] = (classes ?? []).map(classObj => ({
    id: classObj.id,
    name: classObj.name,
    createdAt: classObj.createdAt,
    updatedAt: classObj.updatedAt,
    disabledAt: classObj.disabledAt,
    disabled: classObj.disabled,
    teacher: {
      id: classObj.teacher.id,
      name: classObj.teacher.name
    },
    students: classObj.students.map(student => {
      return {
        id: student.id,
        name: student.name
      }
    })
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: ClassResponseDto) => {
    router.push(`/turmas/${record.id}`)
  }

  if (session.data?.user.role !== 'DIRECTOR') {
    return (
      <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>Você não possui autorização para visualizar essa tela!</div>
      </div>
    )
  }

  return (
    <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Gerenciamento de turmas</h2>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>
          Adicionar Turma
        </Button>
      </div>
      <Table<ClassResponseDto>
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

      <ModalSaveClass
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
}
