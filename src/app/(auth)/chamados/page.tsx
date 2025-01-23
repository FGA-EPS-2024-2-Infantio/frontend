'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchTickets } from '@/store/slices/ticketSlice'
import { toast } from 'react-toastify'
import { TicketDTO } from '@/types/Tickets'
import TicketModal from '@/components/chamados/TicketModal'
import { Select } from 'antd'


export default function Suporte() {
  const dispatch = useDispatch<AppDispatch>()
  const { tickets, loading, error } = useSelector(
    (state: RootState) => state.ticket
  )
  const [selectedTicket, setSelectedTicket] = useState<TicketDTO>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<"dateUp" | "dateDown" | "titleUp" | "titleDown">("dateDown")
  const [stateFilter, setStateFilter] = useState<"open" | "closed" | "all">("all")
  const [sortedTickets, setSortedTickets] = useState<TicketDTO[]>([])

  const session = useSession()

  const handleCardClick = async (ticket : TicketDTO) => {
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    }

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch, session.data?.user.id])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    let arrayForSort = [...tickets]
    switch (orderFilter) {
      case "dateDown":
        arrayForSort.sort((a, b) => a.createdAt && b.createdAt ?  (a.createdAt > b.createdAt ? 1 : -1) : 0)
        break;
    
      case "dateUp":
        arrayForSort.sort((a, b) => a.createdAt && b.createdAt ?  (a.createdAt < b.createdAt ? 1 : -1) : 0)
        break;

      case "titleDown":
        arrayForSort.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);
        break;

      case "titleUp":
        arrayForSort.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1)
        break;

      default:
        setSortedTickets(arrayForSort)
        break;
    }

    switch (stateFilter) {
      case "all":
        break;
        case "closed":
        arrayForSort = arrayForSort.filter(ticket => ticket.status === "CLOSED");
        break;
      case "open":
        arrayForSort = arrayForSort.filter(ticket => ticket.status === "OPEN");
      default:
        break;
    }

    setSortedTickets(arrayForSort)
  }, [orderFilter, tickets, stateFilter])

  if (session.data?.user.role !== 'ADMIN') {
    return (
      <div className="mx-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          Você não possui autorização para visualizar essa tela!
        </div>
      </div>
    )
  }

  return (
    <div className="mx-6 rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suporte</h2>
        <div className='space-x-5'>
        <Select
      defaultValue="all"
      style={{ width: 160 }}
      onChange={setStateFilter}
      options={[
        { value: 'all', label: 'Todos' },
        { value: 'open', label: 'Abertos' },
        { value: 'closed', label: 'Fechados' },
      ]}
      />
        <Select
      defaultValue="dateDown"
      style={{ width: 160 }}
      onChange={setOrderFilter}
      options={[
        { value: 'titleDown', label: 'Alfabética (a-z)' },
        { value: 'titleUp', label: 'Alfabética (z-a)' },
        { value: 'dateUp', label: 'Data crescente' },
        { value: 'dateDown', label: 'Data decrescente' },
      ]}
      />
      </div>
      </div>

      {isModalOpen && selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            isModalOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTicket(undefined); 
              dispatch(fetchTickets()); 
            }}
          />
        )}
      {loading && <p>Carregando tickets...</p>}

      {!loading && tickets.length === 0 && <p>Nenhum ticket encontrado.</p>}

      {!loading && sortedTickets.length > 0 && (
        <ul className="space-y-4">
          {sortedTickets.map((ticket) => (
           <li
           onClick={ () => handleCardClick(ticket)}
           key={ticket.id}
           className="rounded-lg border border-gray-300 p-6 shadow-md hover:shadow-lg transition-shadow hover:border-green-400 active:bg-gray-200 active:scale-95 cursor-pointer"
         >
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold ">{ticket.title}</h3>
             <span
               className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${
                 ticket.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
               }`}
             >
               {ticket.status === 'OPEN' ? 'Aberto' : 'Fechado'}
             </span>
           </div>
         
           <p
                className="line-clamp-2 text-gray-600 text-sm mb-4 break-words overflow-hidden text-ellipsis"
                style={{ wordWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              >
                {ticket.message}
            </p>
         
           <div className="text-sm  space-y-1">
             <div>
               <span className="font-bold">Data:</span>{' '}
               {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
             </div>
             <div>
               <span className="font-bold">Criado por:</span> {ticket.directorName}
             </div>
           </div>
         </li>
          ))}
        </ul>
      )}
    </div>
  )
}
