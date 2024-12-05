import axiosInstance from '@/config/AxiosInstance'
import { MonthlyPaymentDto, MonthlyPaymentResponseDto } from '@/types/Payment'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface PaymentState {
  loading: boolean
  error: string | null
  payments: MonthlyPaymentResponseDto[]
  payment: MonthlyPaymentResponseDto | null
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  payments: [],
  payment: null
}

const getAxiosErrorMessage = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data.message || defaultMessage
  }
  return defaultMessage
}


export const createPayment = createAsyncThunk(
  'Payments/createPayment',
  async (paymentData: MonthlyPaymentDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/monthlyPayment', paymentData)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro')
      )
    }
  }
)

export const updateMonthlyPayment = createAsyncThunk(
  'students/updateMonthlyPayment',
  async (
    { monthlyPaymentId, data }: { monthlyPaymentId: string; data: MonthlyPaymentDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/monthlyPayment/${monthlyPaymentId}`, data)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao atualizar dados de pagamento')
      )
    }
  }
)

const paymentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      // POST
      .addCase(createPayment.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false
        state.payments.push(action.payload)
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //Update
      .addCase(updateMonthlyPayment.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMonthlyPayment.fulfilled, (state, action) => {
        state.loading = false
        const updatedPaymentIndex = state.payments.findIndex(
          payment => payment.id === action.payload.id
        )

        if (updatedPaymentIndex !== -1) {
          state.payments[updatedPaymentIndex] = action.payload
        }

        if (state.payment?.id === action.payload.id) {
          state.payment = action.payload
        }
      })
      .addCase(updateMonthlyPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao atualizar pagamento'
      })

  }
})

export default paymentSlice.reducer
