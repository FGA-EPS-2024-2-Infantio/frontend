'use client'

import { createTicket } from '@/store/slices/ticketSlice'
import { AppDispatch } from '@/store/store'
import { TicketDTO } from '@/types/Tickets'
import { Button, Form, Input, message } from 'antd'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function Suporte() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()
  const session = useSession()

  useEffect(() => {
    console.log(session)
  }, [session])

  // Função para enviar o suporte
  const handleSubmit = async () => {
    try {
      await form.validateFields() // Valida os campos antes de prosseguir

      setLoading(true)

      const ticket: TicketDTO = {
        title: form.getFieldValue('title'),
        message: form.getFieldValue('message'),
        status: "OPEN",
        directorId: session.data?.user.id || " ",
        directorName: session.data?.user.name || " "
      }

      await dispatch(createTicket(ticket)).unwrap()
      message.success('Chamado de suporte enviado com sucesso!')
      form.resetFields() // Limpa os campos do formulário após o envio bem-sucedido

    } catch (error) {
      message.error(error + 'Erro ao enviar o chamado. Tente novamente!')
    } finally {
      setLoading(false)
    }
  }

  if (session.data?.user.role !== 'DIRECTOR') {
    return (
      <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>
          Você não possui autorização para visualizar essa tela!
        </div>
      </div>
    )
  }

  return (
    <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Suporte</h2>
      </div>

      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          label='Título'
          name='title'
          rules={[{ required: true, message: 'Por favor, insira um título!' }]}
        >
          <Input placeholder='Digite o título do chamado' />
        </Form.Item>

        <Form.Item
          label='Mensagem'
          name='message'
          rules={[{ required: true, message: 'Por favor, insira uma mensagem!' }]}
        >
          <Input.TextArea placeholder='Digite a mensagem do chamado' rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            className='w-full'
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}