'use client'

import {
  createStudent,
  fetchStudents,
  updateStudent
} from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import {
  CategorieType,
  ClassType,
  StudentDTO,
  StudentsResponseDTO,
  TurnType
} from '@/types/Students'
import { Button, Form, Input, Modal, Select } from 'antd'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

type Props = {
  isModalOpen: boolean
  setIsModalOpen: (state: boolean) => void
  studentToEdit?: StudentsResponseDTO
}

const optsPeriod = [
  {
    value: CategorieType.INTEGRAL,
    label: 'Integral'
  },
  {
    value: CategorieType.PARCIAL,
    label: 'Parcial'
  }
]

const turnType = [
  {
    value: TurnType.MATUTINO,
    label: 'Matutino'
  },
  {
    value: TurnType.VESPERTINO,
    label: 'Vespertino'
  }
]

const classType = [
  {
    value: ClassType.BERCARIO,
    label: 'Berçário'
  },
  {
    value: ClassType.CRECHE,
    label: 'Creche'
  },
  {
    value: ClassType.ESCOLA,
    label: 'Escola'
  },
  {
    value: ClassType.REFORCO,
    label: 'Reforço'
  }
]

export default function ModalCreateStudent({
  isModalOpen,
  setIsModalOpen,
  studentToEdit
}: Readonly<Props>) {
  const [form] = Form.useForm<StudentDTO>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.student)

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (studentToEdit) {
      form.setFieldsValue({
        name: studentToEdit.name,
        class: studentToEdit.class,
        categorie: studentToEdit.categorie,
        turn: studentToEdit.turn
      })
    }
  }, [studentToEdit, form])

  const session = useSession()

  const handleCreateStudent = async () => {
    try {
      const values = await form.validateFields()
      values.userId = session.data?.user.id ?? ''
      const action = studentToEdit
        ? await dispatch(updateStudent({ id: studentToEdit.id, data: values }))
        : await dispatch(createStudent(values))

      if (
        createStudent.rejected.match(action) ||
        updateStudent.rejected.match(action)
      ) {
        toast.error(
          studentToEdit
            ? `Erro ao atualizar o aluno: ${action.payload || 'Erro ao atualizar Aluno'}`
            : `Erro ao criar Aluno: ${action.payload || 'Erro ao criar Aluno'}`
        )
      } else {
        setIsModalOpen(false)
        dispatch(fetchStudents(session.data?.user.id ?? ''))
        toast.success(
          studentToEdit
            ? `Aluno atualizado com sucesso`
            : `Aluno criado com sucesso`
        )
        form.resetFields()
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
        onFinish={handleCreateStudent}
        className='space-y-4'
      >
        <Form.Item
          name='name'
          label='Nome do Aluno'
          rules={[
            { required: true, message: 'Por favor, insira o nome do Aluno' }
          ]}
        >
          <Input placeholder='Nome do Aluno' />
        </Form.Item>

        <Form.Item
          name='turn'
          label='Turno'
          rules={[
            {
              required: true,
              message: 'Por favor, insira um turno válido'
            }
          ]}
        >
          <Select placeholder='Turno do Aluno' options={turnType} />
        </Form.Item>

        <Form.Item
          name='categorie'
          label='Periodo'
          rules={[
            {
              required: true,
              message: 'Por favor, insira um periodo válido'
            }
          ]}
        >
          <Select placeholder='Periodo do Aluno' options={optsPeriod} />
        </Form.Item>

        <Form.Item
          name='class'
          label='Turma'
          rules={[
            {
              required: true,
              message: 'Por favor, insira uma Turma válida'
            }
          ]}
        >
          <Select placeholder='Turma do Aluno' options={classType} />
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
            Cadastrar
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
