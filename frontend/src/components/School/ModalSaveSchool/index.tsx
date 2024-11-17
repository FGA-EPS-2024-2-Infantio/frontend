'use client'

import { createSchool, fetchSchoolById, fetchSchools, updateSchool } from '@/store/slices/schoolSlice'
import { AppDispatch, RootState } from '@/store/store'
import { CreateSchoolType, SchoolResponseDto } from '@/types/Schools'
import { Button, Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

type Props = {
  isModalOpen: boolean
  setIsModalOpen: (state: boolean) => void
  schoolToEdit?: SchoolResponseDto
}

export default function ModalSaveSchool({
  isModalOpen,
  setIsModalOpen,
  schoolToEdit
}: Props) {
  const [form] = Form.useForm<CreateSchoolType>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.school)

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (schoolToEdit) {
      form.setFieldsValue({
        name: schoolToEdit.name,
        directorEmail: schoolToEdit.directorEmail,
        numberStudents: schoolToEdit.numberStudents
      })
    }
  }, [schoolToEdit, form])

  const handleSaveSchool = async () => {
    try {
      const values = await form.validateFields()

      if (schoolToEdit) {
        const action = await dispatch(
          updateSchool({
            id: schoolToEdit.id,
            data: values
          })
        )

        if (updateSchool.rejected.match(action)) {
          toast.error(
            `Erro ao atualizar escola: ${action.payload || 'Erro ao atualizar escola'}`
          )
        } else {
          toast.success('Escola atualizada com sucesso')
          setIsModalOpen(false)
          dispatch(fetchSchools())
          dispatch(fetchSchoolById(schoolToEdit.id))
        }
      } else {
        const action = await dispatch(createSchool(values))

        if (createSchool.rejected.match(action)) {
          toast.error(
            `Erro ao criar escola: ${action.payload || 'Erro ao criar escola'}`
          )
        } else {
          toast.success('Escola criada com sucesso')
          setIsModalOpen(false)
          dispatch(fetchSchools())
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
        onFinish={handleSaveSchool}
        className='space-y-4'
      >
        <Form.Item
          name='name'
          label='Nome da Escola'
          rules={[
            { required: true, message: 'Por favor, insira o nome da escola' }
          ]}
        >
          <Input placeholder='Nome da Escola' />
        </Form.Item>

        <Form.Item
          name='directorEmail'
          label='E-mail do Diretor'
          rules={[
            {
              required: true,
              message: 'Por favor, insira o e-mail do diretor'
            },
            { type: 'email', message: 'Por favor, insira um e-mail válido' }
          ]}
        >
          <Input placeholder='E-mail do Diretor' />
        </Form.Item>

        <Form.Item
          name='numberStudents'
          label='Quantidade de alunos'
          rules={[
            {
              required: true,
              message: 'Por favor, insira a quantidade de alunos'
            }
          ]}
        >
          <InputNumber min={1} className='w-full' />
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
            {schoolToEdit ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
