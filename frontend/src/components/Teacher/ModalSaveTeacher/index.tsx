'use client'

import { createTeacher, fetchTeacherById, fetchTeachers, updateTeacher } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { CreateTeacherType, TeacherResponseDto } from '@/types/Teachers'
import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment';

type Props = {
  isModalOpen: boolean
  setIsModalOpen: (state: boolean) => void
  teacherToEdit?: TeacherResponseDto
}

export default function ModalSaveTeacher({
  isModalOpen,
  setIsModalOpen,
  teacherToEdit
}: Props) {
  const [form] = Form.useForm<CreateTeacherType>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.teacher)

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (teacherToEdit) {
      form.setFieldsValue({
        name: teacherToEdit.name,
        numberOfClasses: teacherToEdit.numberOfClasses,
        cpf: teacherToEdit.cpf,
        startDate: teacherToEdit.startDate // Certifique-se de usar `moment`
      })
    }
  }, [teacherToEdit, form])

  const handleSaveTeacher = async () => {
    try {
      const values = await form.validateFields()

      // Converte `startDate` para `Date` ao salvar
      const teacherData: CreateTeacherType = {
        ...values,
        startDate: values.startDate,
      };

      if (teacherToEdit) {
        const action = await dispatch(
          updateTeacher({
            id: teacherToEdit.id,
            data: teacherData
          })
        )

        if (updateTeacher.rejected.match(action)) {
          toast.error(
            `Erro ao atualizar professor: ${action.payload || 'Erro ao atualizar professor'}`
          )
        } else {
          toast.success('Professor atualizado com sucesso')
          setIsModalOpen(false)
          dispatch(fetchTeachers())
          dispatch(fetchTeacherById(teacherToEdit.id))
        }
      } else {
        const action = await dispatch(createTeacher(teacherData))

        if (createTeacher.rejected.match(action)) {
          toast.error(
            `Erro ao criar professor: ${action.payload || 'Erro ao criar professor'}`
          )
        } else {
          toast.success('Professor criado com sucesso')
          setIsModalOpen(false)
          dispatch(fetchTeachers())
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
        layout="vertical"
        onFinish={handleSaveTeacher}
        className="space-y-4"
        initialValues={teacherToEdit || {}}
      >
        <Form.Item
          name="name"
          label="Nome do Professor"
          rules={[
            { required: true, message: 'Por favor, insira o nome do professor' }
          ]}
        >
          <Input placeholder="Nome do Professor" />
        </Form.Item>

        <Form.Item
          name="numberOfClasses"
          label="Quantidade de turmas"
          rules={[
            { required: true, message: 'Por favor, insira a quantidade de turmas' },
            { type: 'number'}
          ]}
        >
          <InputNumber min={18} className="w-full" placeholder="Quantidade de turmas" />
        </Form.Item>

        <Form.Item
          name="cpf"
          label="CPF do Professor"
          rules={[
            { required: true, message: 'Por favor, insira o CPF do professor' },
            { len: 11, message: 'O CPF deve ter exatamente 11 caracteres' }
          ]}
        >
          <Input placeholder="CPF do Professor" maxLength={11} />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Data de Início"
          rules={[{ required: true, message: 'Por favor, selecione a data de início' }]}
        >
          <DatePicker
            className="w-full"
            placeholder="Data de Início"
            format="DD/MM/YYYY"
            value={form.getFieldValue('startDate') ? moment(form.getFieldValue('startDate')) : null} // Certifique-se de que o valor seja `moment`
            onChange={(date) => form.setFieldValue('startDate', date)} // Converte para `Date`
          />
        </Form.Item>

        <div className="flex justify-end">
          <Button onClick={handleCancel} className="mr-2">
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {teacherToEdit ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
