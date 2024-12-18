'use client'

import ModalSaveTeacher from '@/components/Teacher/ModalSaveTeacher'
import axiosInstance from '@/config/AxiosInstance'
import { fetchTeachers } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { TeacherResponseDto } from '@/types/Teachers'
import { Button, Table } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Teachers() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { teachers, loading } = useSelector((state: RootState) => state.teacher)
  
  const session = useSession()

  const [schools, setSchools] = useState<{ [id: number]: string }>({})

  useEffect(() => {
    dispatch(fetchTeachers(session.data?.user.id ?? ""))
  }, [dispatch, session.data?.user.id])

  // useEffect(() => {
  //   if (error) {
  //     console.log("erro",error)
  //     toast.error(error)
  //   }
  // }, [error])

  // Função para buscar o nome da escola
  const fetchSchoolName = async (schoolId: string) => {
    try {
      const response = await axiosInstance.get(`/schools/${schoolId}`)

      return response.data.name // Supondo que o retorno tenha o campo 'name' da escola
    } catch (error) {
      console.error('Erro ao buscar escola:', error)
      return ''
    }
  }

  // Atualizando o estado dos nomes das escolas
  useEffect(() => {
    const loadSchoolNames = async () => {
      const schoolNames: { [id: string]: string } = {}
      for (const teacher of teachers) {
        if (!schoolNames[teacher.schoolId]) {
          const schoolName = await fetchSchoolName(teacher.schoolId)
          schoolNames[teacher.schoolId] = schoolName
        }
      }
      setSchools(schoolNames)
    }
    loadSchoolNames()
  }, [teachers])

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
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      title: 'Escola',
      dataIndex: 'schoolId',
      key: 'schoolId',
      render: (schoolId: number) => schools[schoolId] || 'Carregando...'
    }
  ]

  const data: TeacherResponseDto[] = teachers.map((teacher: TeacherResponseDto) => ({
    id: teacher.id,
    name: teacher.name,
    numberOfClasses: teacher.numberOfClasses,
    cpf: teacher.cpf,
    startDate: teacher.startDate,
    createdAt: teacher.createdAt,
    disabled: teacher.disabled,
    schoolId: teacher.schoolId
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: TeacherResponseDto) => {
    router.push(`/professores/${record.id}`)
  }

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
        rowClassName={({disabled}) =>
          classNames(
            'cursor-pointer hover:bg-gray-100 transition duration-200',
            {'bg-red-100 hover:!bg-red-200': disabled}
          )
        }
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
