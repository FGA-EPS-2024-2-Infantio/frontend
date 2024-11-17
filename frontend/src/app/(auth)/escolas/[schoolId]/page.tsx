'use client'
import ModalSaveSchool from '@/components/School/ModalSaveSchool'
import { deleteSchoolById, fetchSchoolById } from '@/store/slices/schoolSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Spin } from 'antd'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function SchoolDetails() {
  const { schoolId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, school } = useSelector(
    (state: RootState) => state.school
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const schoolIdStr = Array.isArray(schoolId) ? schoolId[0] : schoolId

  useEffect(() => {
    if (schoolIdStr) {
      dispatch(fetchSchoolById(schoolIdStr))
    }
  }, [dispatch, schoolIdStr])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDeactivateSchool = useCallback(() => {
    dispatch(deleteSchoolById(schoolIdStr))
      .unwrap()
      .then(() => {
        toast.success('Escola desativada com sucesso')
        dispatch(fetchSchoolById(schoolIdStr))
      })
      .catch(error => toast.error(`Erro: ${error.message}`))
  }, [dispatch, schoolIdStr])

  const actionMenuItems = useMemo(() => {
    const items = []

    items.push({
      key: 'editSchool',
      label: <span onClick={() => setIsModalOpen(true)}>Editar escola</span>
    })

    if (!school?.disabled) {
      items.push({
        key: 'deactivateSchool',
        label: (
          <Popconfirm
            title='Tem certeza que deseja desativar esta escola?'
            onConfirm={handleDeactivateSchool}
            okText='Sim'
            cancelText='Não'
            placement='bottom'
          >
            <span>Desativar escola</span>
          </Popconfirm>
        )
      })
    }

    return items
  }, [handleDeactivateSchool, school?.disabled])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  if (!school)
    return (
      <div className='flex h-full items-center justify-center'>
        Escola não encontrada
      </div>
    )

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{school.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>
      <p>
        {school.disabled ? (
          <p className='text-red-500'>Desabilitada</p>
        ) : (
          <p className='text-green-500'>Habilitada</p>
        )}
      </p>
      <p className='text-gray-700'>Diretor: {school.directorEmail} </p>
      <p className='text-gray-700'>
        Quantidade de alunos: {school.numberStudents}
      </p>

      <ModalSaveSchool
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        schoolToEdit={school}
      />
    </div>
  )
}
