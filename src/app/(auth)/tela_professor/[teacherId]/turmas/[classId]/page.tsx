'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Button, Spin, Table } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchClassDetails } from '@/store/slices/classSlice'
import { toast } from 'react-toastify'

export default function ClassDetailsPage() {
  const router = useRouter()
  const { teacherId, classId } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { loading, error, classData, students, calls } = useSelector(
    (state: RootState) => state.class
  )

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (teacherId && classId) {
      dispatch(fetchClassDetails(Array.isArray(classId) ? classId[0] : classId))
      
    }
  }, [teacherId, classId, dispatch])

  const studentColumns = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    }
  ]

  const callsColumns = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Presentes',
      dataIndex: 'presentCount',
      key: 'presentCount'
    },
    {
      title: 'Ausentes',
      dataIndex: 'absentCount',
      key: 'absentCount'
    }
  ]

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  }

  if (!classData) {
    return (
      <div className='flex h-full items-center justify-center'>
        Turma não encontrada
      </div>
    )
  }

  const handleRowClick = (record: { id: string }) => {
    router.push(`/tela_professor/${teacherId}/turmas/${classId}/${record.id}`)
  }

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{classData.name}</h2>
        <Button type='primary' onClick={() => console.log('Iniciar chamada')}>
          Chamada
        </Button>
      </div>

      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Lista de Alunos</h3>
          <Table
            columns={studentColumns}
            dataSource={students}
            rowKey='id'
            pagination={false}
            bordered
            onRow={record => ({
              onClick: () => handleRowClick(record)
            })}
          />
        </div>

        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Lista de Chamadas</h3>
          <Table
            columns={callsColumns}
            
            dataSource={calls}
            rowKey='id'
            pagination={false}
            bordered
          />
        </div>
      </div>
    </div>
  )
}