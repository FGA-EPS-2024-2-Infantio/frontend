import { createTeacher, fetchSchools, fetchTeacherById, fetchTeachers, updateTeacher } from '@/store/slices/teacherSlice'
import { AppDispatch, RootState } from '@/store/store'
import { CreateTeacherType, TeacherResponseDto } from '@/types/Teachers'
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

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
  const { loading, schools } = useSelector((state: RootState) => state.teacher)
  const [schoolOptions, setSchoolOptions] = useState<{ value: number, label: string }[]>([])

  // Atualizar os campos apenas quando teacherToEdit estiver disponível
  useEffect(() => {
    if (teacherToEdit) {
      console.log(teacherToEdit)
      form.setFieldsValue({
        name: teacherToEdit.name,
        numberOfClasses: teacherToEdit.numberOfClasses,
        cpf: teacherToEdit.cpf,
        startDate: dayjs(teacherToEdit.startDate).toISOString() ?? null,
        schoolId: teacherToEdit.schoolId,
      });
    }
  }, [teacherToEdit, form]);

  // Requisição para buscar escolas
  useEffect(() => {
    if (schools.length === 0) {
      dispatch(fetchSchools())
    }
  }, [dispatch, schools]);

  // Atualiza as opções do Select sempre que o estado de schools for alterado
  useEffect(() => {
    if (schools.length > 0) {
      const options = schools.map((school) => ({
        value: school.id, 
        label: school.name
      }));
      setSchoolOptions(options);
    }
  }, [schools]);

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleSaveTeacher = async () => {
    try {
      const values = await form.validateFields()
      const teacherData: CreateTeacherType = {
            ...values,
            schoolId: values.schoolId,
            startDate: dayjs(values.startDate).isValid() 
            ? dayjs(values.startDate).toISOString() 
            : null,
          };

      if (teacherToEdit) {
        const action = await dispatch(
          updateTeacher({
            id: teacherToEdit.id,
            data: values
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
        form={form}  // Passando a instância do form aqui
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

        {!teacherToEdit && <Form.Item
          name="email"
          label="E-mail do Professor"
          rules={[
            { required: true, message: 'Por favor, insira o e-mail do professor' }
          ]}
        >
          <Input placeholder="E-mail do Professor" />
        </Form.Item>}

        {!teacherToEdit && <Form.Item
          name="password"
          label="Senha do Professor"
          rules={[
            { required: true, message: 'Por favor, insira a senha do professor' }
          ]}
        >
          <Input placeholder="Senha do Professor" />
        </Form.Item>}

        <Form.Item
          name="numberOfClasses"
          label="Quantidade de turmas"
          rules={[
            { required: true, message: 'Por favor, insira a quantidade de turmas' },
            { type: 'number'}
          ]}
        >
          <InputNumber min={0} className="w-full" placeholder="Quantidade de turmas" />
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
          />
        </Form.Item>

        {!teacherToEdit && <Form.Item
          name="schoolId"
          label="Selecione a Escola"
          rules={[{ required: true, message: 'Por favor, selecione a escola' }]}
        >
          <Select
            placeholder="Selecione a Escola"
            options={schoolOptions} 
          />
        </Form.Item>}

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
