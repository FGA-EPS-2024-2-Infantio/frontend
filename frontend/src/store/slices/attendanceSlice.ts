import axiosInstance from '@/config/AxiosInstance'
import { CreateAttendanceType, AttendanceResponseDto } from '@/types/Attendances'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface AttendanceState {
  loading: boolean
  error: string | null
  attendances: AttendanceResponseDto[]
  attendance: AttendanceResponseDto | null
  attendancesByDate: AttendanceResponseDto[]
}

const initialState: AttendanceState = {
  loading: false,
  error: null,
  attendances: [],
  attendance: null,
  attendancesByDate: []
}

const setLoadingAndError = (
  state: AttendanceState,
  isLoading: boolean,
  error: string | null = null
) => {
  state.loading = isLoading
  state.error = error
}

const getAxiosErrorMessage = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data.message || defaultMessage
  }
  return defaultMessage
}

export const fetchAttendances = createAsyncThunk(
  'attendances/fetchAttendances',
  async () => {
    const response = await axiosInstance.get('/attendances')
    return response.data
  }
)

export const fetchAttendanceById = createAsyncThunk(
  'attendances/fetchAttendanceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/attendances/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar chamada')
      )
    }
  }
)

export const fetchAttendanceByDate = createAsyncThunk(
  'attendances/fetchAttendanceByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      console.log(date)
      const response = await axiosInstance.get(`/attendances/date/${date}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar chamada')
      )
    }
  }
)

export const createAttendance = createAsyncThunk(
  'attendances/createAttendance',
  async (attendanceData: CreateAttendanceType[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/attendances', attendanceData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro ao criar a chamada')
      )
    }
  }
)

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async (
    { data }: { data: CreateAttendanceType[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/attendances/attendanceList/List`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao atualizar chamada')
      )
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create Attendance
      .addCase(createAttendance.pending, state => setLoadingAndError(state, true))
      .addCase(createAttendance.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.attendances.push(action.payload)
      })
      .addCase(createAttendance.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // List Attendances
      .addCase(fetchAttendances.pending, state => setLoadingAndError(state, true))
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.attendances = action.payload
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        setLoadingAndError(
          state,
          false,
          action.error.message || 'Erro ao buscar chamadas'
        )
      })

      // Get Attendance
      .addCase(fetchAttendanceById.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        console.log(action.payload)
        state.attendance = action.payload
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // Update Attendance
      .addCase(updateAttendance.pending, state => setLoadingAndError(state, true))
      .addCase(updateAttendance.fulfilled, (state, action) => {
        setLoadingAndError(state, false)

        const updatedAttendanceIndex = state.attendances.findIndex(
          attendance => attendance.id === action.payload.id
        )

        if (updatedAttendanceIndex !== -1) {
          state.attendances[updatedAttendanceIndex] = action.payload
        }

        if (state.attendance?.id === action.payload.id) {
          state.attendance = action.payload
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      //Fetch attendance By date
      .addCase(fetchAttendanceByDate.pending, (state) => {
        setLoadingAndError(state, true);
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        console.log('Payload recebido no fulfilled:', action.payload); 
        console.log('Estado antes da atualização:', state.attendancesByDate); 
        
        setLoadingAndError(state, false);
        state.attendancesByDate = action.payload; 
        
        console.log('Estado após a atualização:', state.attendancesByDate);
      })
      .addCase(fetchAttendanceByDate.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string);
      });
  }
})

export default attendanceSlice.reducer
