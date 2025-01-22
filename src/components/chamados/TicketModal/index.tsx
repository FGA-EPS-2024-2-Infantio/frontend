'use client'

import { Button, Form, Input, Modal, message } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { TicketDTO } from '@/types/Tickets'
import { updateTicket } from '@/store/slices/ticketSlice'

interface TicketModalProps {
  ticket: TicketDTO
  isModalOpen: boolean
  onClose: () => void
}

const TicketModal: React.FC<TicketModalProps> = ({ ticket, isModalOpen, onClose }) => {
  const [responseMessage, setResponseMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    if (!responseMessage) {
      message.error('Por favor, insira uma resposta.')
      return
    }

    setLoading(true)

    try {
      const responseTicket: TicketDTO = {
        ...ticket,
        response: responseMessage,
        status: 'CLOSED', 
      }

      await dispatch(updateTicket({id: ticket.id, data: responseTicket})).unwrap()
      message.success('Resposta enviada com sucesso!')
      form.resetFields()
      setResponseMessage('')
      onClose() 
    } catch (error) {
      message.error('Erro ao enviar a resposta. Tente novamente!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Detalhes do Chamado"
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{ticket.title}</h3>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${
              ticket.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {ticket.status === 'OPEN' ? 'Aberto' : 'Fechado'}
          </span>
        </div>

        <p
          className="text-gray-600 text-sm mb-4 break-words overflow-hidden text-ellipsis"
          style={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {ticket.message}
        </p>
        <div className="text-sm space-y-1">
          <div>
            <span className="font-bold">Data:</span>{' '}
            {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div>
            <span className="font-bold">Criado por:</span> {ticket.directorName}
          </div>
        </div>
      </div>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        
      {ticket.response ? (
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
            <h4 className="text-sm font-medium text-gray-500">Resposta:</h4>
            <p className="mt-2 text-gray-800 text-sm leading-relaxed">
            {ticket.response}
            </p>
        </div>
        ) : (
        <Form.Item
            label="Resposta"
            name="response"
            rules={[{ required: true, message: 'Por favor, insira uma resposta!' }]}
        >
            <Input.TextArea
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Digite sua resposta"
            rows={4}
            />
        </Form.Item>
        )}
          
        {!ticket.response && <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Enviar Resposta
          </Button>
        </Form.Item>}
      </Form>
    </Modal>
  )
}

export default TicketModal
