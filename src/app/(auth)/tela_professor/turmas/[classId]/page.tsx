'use client'

import { fetchClassDetails } from '@/store/slices/classSlice'
import { AppDispatch, RootState } from '@/store/store'
import { Spin, Table } from 'antd'
import classNames from 'classnames'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function ClassDetailsPage() {
  const router = useRouter()
  const { classId } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { loading, error, classData, students } = useSelector(
    (state: RootState) => state.class
  )

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassDetails(Array.isArray(classId) ? classId[0] : classId))
      
    }
  }, [classId, dispatch])

  const studentColumns = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
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
    router.push(`/tela_professor/turmas/${classId}/${record.id}`)
  }

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      {/* <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{classData.name}</h2>
        <Button type='primary' onClick={() => console.log('Iniciar chamada')}>
          Chamada
        </Button>
      </div> */}

      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Lista de Alunos</h3>
          <Table
            columns={studentColumns}
            dataSource={students}
            rowKey='id'
            pagination={false}
            bordered
            rowClassName={() =>
              classNames('cursor-pointer hover:bg-gray-100 transition duration-200')
            }
            onRow={record => ({
              onClick: () => handleRowClick(record)
            })}
          />
        </div>
      </div>
    </div>
  )
}