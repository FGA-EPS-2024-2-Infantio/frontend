'use client'

import {
  createClass,
  fetchClassById,
  fetchClasses,
  updateClass
} from '@/store/slices/classSlice'
import { fetchTeachers } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ClassResponseDto, CreateClassType } from '@/types/Classes'
import { Button, Form, Input, Modal, Select } from 'antd'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

type Props = {
  isModalOpen: boolean
  setIsModalOpen: (state: boolean) => void
  classToEdit?: ClassResponseDto
}

export default function ModalSaveClass({
  isModalOpen,
  setIsModalOpen,
  classToEdit
}: Props) {
  const [form] = Form.useForm<CreateClassType>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.class)
  const session = useSession()

  const { teachers, error: errorTeacher } = useSelector(
    (state: RootState) => state.teacher
  )

  useEffect(() => {
    dispatch(fetchTeachers())
  }, [dispatch])

  useEffect(() => {
    if (errorTeacher) {
      console.log('erro', errorTeacher)
      toast.error(errorTeacher)
    }
  }, [errorTeacher])

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (classToEdit) {
      form.setFieldsValue({
        teacherId: classToEdit.teacher.id,
        name: classToEdit.name
      })
    }
  }, [classToEdit, form])

  const handleSaveClass = async () => {
    try {
      const values = await form.validateFields()

      if (classToEdit) {
        const action = await dispatch(
          updateClass({
            id: classToEdit.id,
            data: values
          })
        )

        if (updateClass.rejected.match(action)) {
          toast.error(
            `Erro ao atualizar turma: ${action.payload || 'Erro ao atualizar turma'}`
          )
        } else {
          toast.success('Turma atualizada com sucesso')
          setIsModalOpen(false)
          dispatch(fetchClasses())
          dispatch(fetchClassById(classToEdit.id))
        }
      } else {
        const action = await dispatch(createClass({...values, userId: session.data?.user.id ?? ""}))

        if (createClass.rejected.match(action)) {
          toast.error(
            `Erro ao criar turma: ${action.payload || 'Erro ao criar turma'}`
          )
        } else {
          toast.success('Turma criada com sucesso')
          setIsModalOpen(false)
          dispatch(fetchClasses())
        }
      }
    } catch (error) {
      console.log('Erro ao validar o formulário:', error)
    }
  }

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      className='rounded-lg'
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSaveClass}
        className='space-y-4'
      >
        <Form.Item
          name='name'
          label='Nome da turma'
          rules={[
            { required: true, message: 'Por favor, insira o nome da escola' }
          ]}
        >
          <Input placeholder='Nome da Escola' />
        </Form.Item>

        <Form.Item
          name='teacherId'
          label='Professor'
          rules={[
            { required: true, message: 'Por favor, selecione um professor' }
          ]}
        >
          <Select
            placeholder='Selecione um professor'
            loading={!teachers.length}
            options={teachers.map(teacher => ({
              label: teacher.name,
              value: teacher.id
            }))}
          />
        </Form.Item>

        <div className='flex justify-end'>
          <Button onClick={handleCancel} className='mr-2'>
            Cancelar
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            className='bg-blue-500 hover:bg-blue-600'
          >
            {classToEdit ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
