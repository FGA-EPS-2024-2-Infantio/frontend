'use client'

import { Button, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createTicket } from '@/store/slices/ticketSlice'
import { TicketDTO } from '@/types/Tickets'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'

export default function Suporte() {
  const [title, setTitle] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()


  const session = useSession()


 useEffect(() => {
    console.log(session)
  }, [])

  // Função para enviar o suporte
  const handleSubmit = async () => {
    if (!title || !messageContent) {
      message.error('Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)

    try {
      const ticket: TicketDTO = {
        title : title,
        message : messageContent,
        status : "OPEN",
        directorId : session.data?.user.id || " ",
        directorName: session.data?.user.name || " "

      }

       await dispatch(createTicket(ticket)).unwrap();
        message.success('Chamado de suporte enviado com sucesso!')
        form.resetFields()
  
    } catch (error) {
        message.error('Erro ao enviar o chamado. Tente novamente!')
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

      <Form layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          label='Título'
          name='title'
          rules={[{ required: true, message: 'Por favor, insira um título!' }]}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Digite o título do chamado'
          />
        </Form.Item>

        <Form.Item
          label='Mensagem'
          name='message'
          rules={[{ required: true, message: 'Por favor, insira uma mensagem!' }]}
        >
          <Input.TextArea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder='Digite a mensagem do chamado'
            rows={4}
          />
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
