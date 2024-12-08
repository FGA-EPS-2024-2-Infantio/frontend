'use client'
import ModalSaveClass from '@/components/Class/ModalSaveClass'
import {
  deleteClassById,
  fetchClassById,
  updateClassStudents
} from '@/store/slices/classSlice'
import { fetchStudents } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Select, Spin } from 'antd'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function ClassDetails() {
  const { classId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, classObj } = useSelector(
    (state: RootState) => state.class
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const classIdStr = Array.isArray(classId) ? classId[0] : classId

  const { students, error: errorStudents } = useSelector(
    (state: RootState) => state.student
  )

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  useEffect(() => {
    if (errorStudents) {
      console.log('erro', errorStudents)
      toast.error(errorStudents)
    }
  }, [errorStudents])

  useEffect(() => {
    if (classIdStr) {
      dispatch(fetchClassById(classIdStr))
    }
  }, [dispatch, classIdStr])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (classObj?.students) {
      setSelectedStudents(classObj.students.map(student => student.id))
    }
  }, [classObj])

  const handleUpdateStudents = () => {
    dispatch(
      updateClassStudents({
        id: classIdStr,
        data: { studentIds: selectedStudents }
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Alunos atualizados com sucesso!')
        dispatch(fetchClassById(classIdStr))
      })
      .catch(error => toast.error(`Erro: ${error.message}`))
  }

  const handleDeactivateClass = useCallback(() => {
    dispatch(deleteClassById(classIdStr))
      .unwrap()
      .then(() => {
        toast.success('Turma desativada com sucesso')
        dispatch(fetchClassById(classIdStr))
      })
      .catch(error => toast.error(`Erro: ${error.message}`))
  }, [dispatch, classIdStr])

  const actionMenuItems = useMemo(() => {
    const items = []

    items.push({
      key: 'editClass',
      label: <span onClick={() => setIsModalOpen(true)}>Editar escola</span>
    })

    if (!classObj?.disabled) {
      items.push({
        key: 'deactivateClass',
        label: (
          <Popconfirm
            title='Tem certeza que deseja desativar esta turma?'
            onConfirm={handleDeactivateClass}
            okText='Sim'
            cancelText='Não'
            placement='bottom'
          >
            <span>Desativar turma</span>
          </Popconfirm>
        )
      })
    }

    return items
  }, [handleDeactivateClass, classObj?.disabled])

  const session = useSession()

  if (session.data?.user.role !== 'ADMIN' && session.data?.user.role !== 'DIRECTOR') {
    return (
      <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>Você não possui autorização para visualizar essa tela!</div>
      </div>
    )
  }

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  if (!classObj)
    return (
      <div className='flex h-full items-center justify-center'>
        Turma não encontrada
      </div>
    )

  return (
    <div className='mx-auto w-full space-y-8 rounded-lg bg-white p-8 shadow-xl'>
      {/* Cabeçalho com título e ações */}
      <div className='flex items-center justify-between border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-900'>{classObj.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2 rounded-lg border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>

      {/* Informações da turma */}
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              classObj.disabled
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {classObj.disabled ? 'Desabilitada' : 'Habilitada'}
          </span>
          <p className='text-lg text-gray-700'>
            Professor:{' '}
            <span className='font-medium'>{classObj.teacher.name}</span>
          </p>
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800'>Alunos:</h3>
        {classObj.students.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {classObj.students.map(student => (
              <div
                key={student.id}
                className='flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md'
              >
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600'>
                  {student.name[0].toUpperCase()}
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900'>{student.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>Nenhum aluno matriculado.</p>
        )}
      </div>

      {/* Seleção e Atualização de Alunos */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <Select
          mode='multiple'
          className='w-full flex-1'
          placeholder='Selecione os alunos'
          loading={!students.length}
          options={students.map(student => ({
            label: student.name,
            value: student.id
          }))}
          value={selectedStudents}
          onChange={setSelectedStudents}
        />
        <Button
          type='primary'
          className='w-full sm:w-auto'
          onClick={handleUpdateStudents}
        >
          Atualizar alunos
        </Button>
      </div>

      {/* Modal */}
      <ModalSaveClass
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        classToEdit={classObj}
      />
    </div>
  )
}
