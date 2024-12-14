'use client'

import { fetchTeacherClasses } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { Spin, Table } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function TurmasDoProfessor() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const session = useSession();
  const { loading, error, teacherClasses } = useSelector(
    (state: RootState) => state.teacher
  )

  useEffect(() => {
    if (session.data?.user) {
      dispatch(fetchTeacherClasses(session.data?.user.id ?? ""))
    }
  }, [dispatch, session.data?.user])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const columns = [
    {
      title: 'Nome da Turma',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Quantidade de Estudantes',
      dataIndex: 'students',
      key: 'students',
      render: (students: { id: string; name: string }[] | undefined) =>
        <span>{Array.isArray(students) ? students.length : 0}</span>
    }
  ]

  const handleRowClick = (record: { id: string }) => {
    router.push(`/tela_professor/turmas/${record.id}`)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spin size='large' />
      </div>
    )
  }

  if (teacherClasses.length === 0) {
    return <div className='text-center py-4'>Nenhuma turma encontrada</div>
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Turmas do Professor</h1>
      <Table
        columns={columns}
        dataSource={teacherClasses}
        rowKey='id'
        bordered
        rowClassName={() =>
          classNames('cursor-pointer hover:bg-gray-100 transition duration-200')
        }
        onRow={record => ({
          onClick: () => handleRowClick(record)
        })}
      />
    </div>
  )
}