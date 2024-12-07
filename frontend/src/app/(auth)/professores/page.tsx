'use client'

import ModalSaveTeacher from '@/components/Teacher/ModalSaveTeacher'
import { fetchTeachers } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { TeacherResponseDto } from '@/types/Teachers'
import type { TableProps } from 'antd'
import { Button, Table } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function Teachers() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { teachers, loading, error } = useSelector(
    (state: RootState) => state.teacher
  )

  useEffect(() => {
    dispatch(fetchTeachers())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      console.log("erro",error)
      toast.error(error)
    }
  }, [error])

  const columns: TableProps<TeacherResponseDto>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Número de turmas',
      dataIndex: 'numberOfClasses',
      key: 'numberOfClasses'
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf'
    },
    {
      title: 'Data de Início',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString('pt-BR')
    }
  ]

  const data: TeacherResponseDto[] = teachers.map((teacher:TeacherResponseDto) => ({
    id: teacher.id,
    name: teacher.name,
    numberOfClasses: teacher.numberOfClasses,
    cpf:teacher.cpf,
    startDate: teacher.startDate,
    createdAt: teacher.createdAt
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: TeacherResponseDto) => {
    router.push(`/professores/${record.id}`)
  }

  const session = useSession()

  if (session.data?.user.role !== 'ADMIN' && session.data?.user.role !== 'DIRECTOR') {
    return (
      <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>Você não possui autorização para visualizar essa tela!</div>
      </div>
    )
  }

  return (
    <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Gerenciamento de Professores</h2>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>
          Adicionar Professor
        </Button>
      </div>
      <Table<TeacherResponseDto>
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={record => ({
          onClick: () => handleRowClick(record)
        })}
        rowClassName={({  }) =>
          classNames(
            'cursor-pointer hover:bg-gray-100 transition duration-200',
          )
        }
        rowHoverable={false}
        bordered
        loading={loading}
      />

      <ModalSaveTeacher
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
}
