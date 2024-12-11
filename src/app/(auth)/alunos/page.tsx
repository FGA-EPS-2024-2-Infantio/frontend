'use client'

import ModalCreateStudent from '@/components/Student/ModalCreateStudent'
import { fetchStudents } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { StudentsResponseDTO } from '@/types/Students'
import type { TableProps } from 'antd'
import { Button, Table } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function Students() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { students, loading, error } = useSelector(
    (state: RootState) => state.student
  )

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const columns: TableProps<StudentsResponseDTO>['columns'] = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Turma',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Categoria',
      dataIndex: 'categorie',
      key: 'categorie'
    }
  ]

  const data: StudentsResponseDTO[] = students?.map(student => ({
    id: student.id,
    schoolId: student.schoolId,
    name: student.name,
    class: student.class,
    turn: student.turn,
    categorie: student.categorie,
    disabled: student.disabled,
    schoolId: student.schoolId,
    payments: student.payments
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: StudentsResponseDTO) => {
    router.push(`/alunos/${record.id}`)
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
        <h2 className='text-lg font-semibold'>Gerenciamento de Alunos</h2>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>
          Adicionar Alunos
        </Button>
      </div>
      <Table<StudentsResponseDTO>
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

      <ModalCreateStudent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
}
