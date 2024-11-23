'use client'
import ModalCreateStudent from '@/components/Student/ModalCreateStudent'
import { deleteStudentById, fetchStudentById } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Spin } from 'antd'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function StudentDetails() {
  const { studentId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, student } = useSelector(
    (state: RootState) => state.student
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const studentIdStr = Array.isArray(studentId) ? studentId[0] :studentId

  useEffect(() => {
    if (studentIdStr) {
      dispatch(fetchStudentById(studentIdStr))
    }
  }, [dispatch, studentIdStr])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const copyToClipboard = () => {
    // TODO recuperar link de cadastro do aluno

    navigator.clipboard.writeText('LINK CADASTRO ALUNO')
    toast.info('Link Copiado com Sucesso')
  }

  const handleDeactivateStudent = useCallback(() => {
    dispatch(deleteStudentById(studentIdStr))
      .unwrap()
      .then(() => {
        toast.success('Aluno desativado com sucesso')
        dispatch(fetchStudentById(studentIdStr))
      })
      .catch(error => toast.error(`Erro: ${error.message}`))
  }, [dispatch, studentIdStr])

  const actionMenuItems = useMemo(() => {
    const items = []

    items.push({
      key: 'editStudent',
      label: <span onClick={() => setIsModalOpen(true)}>Editar Estudante</span>
    })

    if (!student?.disabled) {
      items.push({
        key: 'deactivateStudent',
        label: (
          <Popconfirm
            title='Tem certeza que deseja desativar este Estudante?'
            onConfirm={handleDeactivateStudent}
            okText='Sim'
            cancelText='Não'
            placement='bottom'
          >
            <span>Desativar Estudante</span>
          </Popconfirm>
        )
      })
    }

    items.push({
        key: 'copyToClipboard',
        label: <span onClick={copyToClipboard}>Copiar link</span>
    })

    return items
  }, [handleDeactivateStudent, student?.disabled])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  if (!student)
    return (
      <div className='flex h-full items-center justify-center'>
        Estudante não encontrado
      </div>
    )

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{student.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>
      <p>
        {student.disabled ? (
          <p className='text-red-500'>Desabilitada</p>
        ) : (
          <p className='text-green-500'>Habilitada</p>
        )}
      </p>
      <p className='text-gray-700'>Nome: {student.name} </p>
      <p className='text-gray-700'>
        Turma: {student.class}
      </p>
      <p className='text-gray-700'>
        Categoria: {student.categorie}
      </p>
      <p className='text-gray-700'>
        Turno: {student.turn}
      </p>

      <ModalCreateStudent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studentToEdit={student}
      />
    </div>
  )
}
