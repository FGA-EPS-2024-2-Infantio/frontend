'use client'

import { createPayment, updateMonthlyPayment } from '@/store/slices/paymentSlice'
import { fetchStudentById } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { MonthlyPaymentDto, MonthlyPaymentResponseDto } from '@/types/Payment'
import { Button, DatePicker, Form, InputNumber, Modal, Switch } from 'antd'
import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
type Props = {
  isModalOpen: boolean
  setIsModalOpen: (state: boolean) => void
  setPayment: (state: MonthlyPaymentResponseDto | undefined) => void
  monthlyPaymentToEdit?: MonthlyPaymentResponseDto
  studentId : string
}

export default function ModalCreatePayment({
  isModalOpen,
  setIsModalOpen,
  setPayment,
  monthlyPaymentToEdit,
  studentId
}: Readonly<Props>) {
  const [form] = Form.useForm<MonthlyPaymentDto>()

  const handleCancel = () => {
    form.resetFields()
    setPayment(undefined)
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (isModalOpen && monthlyPaymentToEdit) {
      form.setFieldsValue({
        studentId: monthlyPaymentToEdit.studentId,
        month: monthlyPaymentToEdit.month,
        year: monthlyPaymentToEdit.year,
        payed: monthlyPaymentToEdit.payed,
        value: monthlyPaymentToEdit.value,
        date: monthlyPaymentToEdit.year && monthlyPaymentToEdit.month 
        ? moment(`${monthlyPaymentToEdit.year}-${monthlyPaymentToEdit.month}`, 'YYYY-MM') 
        : null,
      })
    }
  }, [form, isModalOpen, monthlyPaymentToEdit])

  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.payment)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreatePayment = async (values: any) => {
    try {
      const { date, ...rest } =  values
      const payment : MonthlyPaymentDto = {
        ...rest,
        studentId: studentId,
        month: date.month()+1,
        year: date.year(),

      }
      
      const action = monthlyPaymentToEdit ? 
      await dispatch(updateMonthlyPayment({ monthlyPaymentId: monthlyPaymentToEdit.id, data: payment })) : 
      await dispatch(createPayment(payment))
      
      if (createPayment.rejected.match(action) || updateMonthlyPayment.rejected.match(action)) {
        toast.error(
          monthlyPaymentToEdit ? `Erro ao atualizar o Pagamento: ${action.payload || 'Erro ao atualizar Pagamento'}` 
          : `Erro ao criar Pagamento: ${action.payload || 'Erro ao criar Pagamento'}`
        )
      } else {
        setIsModalOpen(false)
        dispatch(fetchStudentById(studentId))
        toast.success(monthlyPaymentToEdit ? `Pagamento atualizado com sucesso` : `Pagamento criado com sucesso`)
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
      onClose={handleCancel}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleCreatePayment}
        className='space-y-4'
        initialValues={{
          payed: true, 
        }}
      >
        <Form.Item
          name='value'
          label='Valor'
          rules={[
            { required: true, message: 'Por favor, insira o valor pagamento' },
            { type: 'number', min: 0, message: 'O valor deve ser positivo' }
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '50%' }}
            placeholder="Digite o valor"
            addonAfter={'R$'}
          />
        </Form.Item>

        <Form.Item 
          name='date'
          label='Mês/Ano'
          rules={[{
            required: !monthlyPaymentToEdit, message: 'Necessário indicar a data de pagamento'
          }]}
         >
          <DatePicker 
            format={{
              format: 'YYYY/MM',
              type: 'mask'
            }}
            disabled={!!monthlyPaymentToEdit}
            picker='month'
          />
        </Form.Item>

        <Form.Item
          name='payed'
          label='Pago'
          valuePropName='checked'
          rules={[{
            required: true, message: 'Necessário indicar se foi pago'
          }]}
         >
          <Switch
            defaultChecked={true}
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
            Cadastrar
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
