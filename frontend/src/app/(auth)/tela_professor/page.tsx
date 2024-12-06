'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchTeachers } from '@/store/slices/teacherSlice'
import { Table, Spin } from 'antd'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { TeacherResponseDto } from '@/types/Teachers'

export default function TeacherScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  const { teachers, loading, error } = useSelector(
    (state: RootState) => state.teacher
  )

  useEffect(() => {
    dispatch(fetchTeachers())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
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
      render: (date: Date) => new Date(date).toLocaleDateString('pt-BR')
    }
  ]

  const handleRowClick = (record: TeacherResponseDto) => {
    router.push(`/tela_professor/${record.id}`)
  }

  return (
    <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='text-lg font-semibold mb-4'>Tela do Professor</h2>

      {loading ? (
        <div className='flex h-full items-center justify-center'>
          <Spin size='large' />
        </div>
      ) : teachers.length === 0 ? (
        <div className='text-center py-4'>
          Nenhum professor encontrado
        </div>
      ) : (
        <Table<TeacherResponseDto>
          columns={columns}
          dataSource={teachers}
          pagination={false}
          onRow={record => ({
            onClick: () => handleRowClick(record)
          })}
          rowClassName={() =>
            classNames('cursor-pointer hover:bg-gray-100 transition duration-200')
          }
          bordered
        />
      )}
    </div>
  )
}