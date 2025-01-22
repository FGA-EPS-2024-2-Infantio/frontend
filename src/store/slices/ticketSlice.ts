import axiosInstance from '@/config/AxiosInstance'
import { TicketDTO } from '@/types/Tickets'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface TicketState {
  loading: boolean
  error: string | null
  tickets: TicketDTO[],
  ticket: TicketDTO | null,
}

const initialState: TicketState = {
    loading: false,
    error: null,
    tickets: [],
    ticket: null
    
  }


const getAxiosErrorMessage = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data.message || defaultMessage
  }
  return defaultMessage
}

export const fetchTickets = createAsyncThunk(
  'ticket/fetchTickets',
  async () => {
    const response = await axiosInstance.get('/tickets')
    return response.data
  }
)


export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: TicketDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tickets', ticketData)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro')
      )
    }
  }
)

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async (
    { id, data }: { id: string; data: TicketDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/tickets/${id}`, data)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao atualizar dados do chamado')
      )
    }
  }
)

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      // POST
      .addCase(createTicket.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false
        state.tickets.push(action.payload)
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // GET Tickets
      .addCase(fetchTickets.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = action.payload
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar chamados'
      })


      //Update
      .addCase(updateTicket.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false
        const updatedTicketIndex = state.tickets.findIndex(
          ticket => ticket.id === action.payload.id
        )

        if (updatedTicketIndex !== -1) {
          state.tickets[updatedTicketIndex] = action.payload
        }

        if (state.ticket?.id === action.payload.id) {
          state.ticket = action.payload
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao atualizar chamado'
      })

  }
})

export default ticketSlice.reducer
