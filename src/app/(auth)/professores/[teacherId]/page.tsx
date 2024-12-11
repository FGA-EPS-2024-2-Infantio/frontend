'use client'
import ModalSaveTeacher from '@/components/Teacher/ModalSaveTeacher'
import { disableTeacherById, fetchTeacherById } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Spin } from 'antd'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function TeacherDetails() {
  const { teacherId } = useParams() 
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, teacher } = useSelector(
    (state: RootState) => state.teacher
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const teacherIdStr = Array.isArray(teacherId) ? teacherId[0] : teacherId

  const router = useRouter();

  useEffect(() => {
    if (teacherIdStr) {
      dispatch(fetchTeacherById(teacherIdStr))
    }
  }, [dispatch, teacherIdStr])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDisableTeacher = useCallback(() => {
    dispatch(disableTeacherById(teacherIdStr))
      .unwrap()
      .then(() => {
        toast.success('Professor desabilitado com sucesso')
        router.push('/professores')
      })
      .catch();
  }, [dispatch, teacherIdStr, router])

  const actionMenuItems = useMemo(() => {
    const items = []

    items.push({
      key: 'editTeacher',
      label: <span onClick={() => setIsModalOpen(true)}>Editar professor</span>
    })

    items.push({
      key: 'deleteTeacher',
      label: (
        <Popconfirm
          title='Tem certeza que deseja desativar este professor?'
          onConfirm={handleDisableTeacher}
          okText='Sim'
          cancelText='Não'
          placement='bottom'
        >
          <span>Desativar professor</span>
        </Popconfirm>
      )
    })

    return items
  }, [handleDisableTeacher])

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
  if (!teacher)
    return (
      <div className='flex h-full items-center justify-center'>
        Professor não encontrado
      </div>
    )

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{teacher.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>
      <p className='text-gray-700'>Numero de turmas: {teacher.numberOfClasses}</p>
      <p className='text-gray-700'>CPF: {teacher.cpf}</p>
      <p className='text-gray-700'>Data de início: {new Date(teacher.startDate).toLocaleDateString('pt-BR')}</p>

      <ModalSaveTeacher
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        teacherToEdit={teacher}
      />
    </div>
  )
}

