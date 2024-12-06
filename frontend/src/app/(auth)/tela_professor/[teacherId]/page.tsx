'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchTeacherClasses } from '@/store/slices/teacherSlice'
import { Table, Spin } from 'antd'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function TurmasDoProfessor() {
  const { teacherId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error, teacherClasses } = useSelector(
    (state: RootState) => state.teacher
  )

  const teacherIdStr = Array.isArray(teacherId) ? teacherId[0] : teacherId

  useEffect(() => {
    if (teacherIdStr) {
      dispatch(fetchTeacherClasses(teacherIdStr))
    }
  }, [teacherIdStr, dispatch])

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
    router.push(`/tela_professor/${teacherIdStr}/turmas/${record.id}`)
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
        onRow={record => ({
          onClick: () => handleRowClick(record)
        })}
      />
    </div>
  )
}