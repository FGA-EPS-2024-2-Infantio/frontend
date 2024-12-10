import axiosInstance from '@/config/AxiosInstance'
import { CreateSchoolType, SchoolResponseDto } from '@/types/Schools'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface SchoolState {
  loading: boolean
  error: string | null
  schools: SchoolResponseDto[]
  school: SchoolResponseDto | null
}

const initialState: SchoolState = {
  loading: false,
  error: null,
  schools: [],
  school: null
}

const setLoadingAndError = (
  state: SchoolState,
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

// Thunks
export const fetchSchools = createAsyncThunk(
  'schools/fetchSchools',
  async () => {
    const response = await axiosInstance.get('/schools')
    return response.data
  }
)

export const fetchSchoolById = createAsyncThunk(
  'schools/fetchSchoolById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/schools/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar escola')
      )
    }
  }
)

export const deleteSchoolById = createAsyncThunk(
  'schools/deleteSchoolById',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/schools/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar escola')
      )
    }
  }
)

export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (schoolData: CreateSchoolType, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/schools', schoolData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro ao criar a escola')
      )
    }
  }
)

export const updateSchool = createAsyncThunk(
  'school/updateSchool',
  async (
    { id, data }: { id: string; data: CreateSchoolType },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/schools/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar escola')
      )
    }
  }
)

const schoolSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create School
      .addCase(createSchool.pending, state => setLoadingAndError(state, true))
      .addCase(createSchool.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.schools.push(action.payload)
      })
      .addCase(createSchool.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // List Schools
      .addCase(fetchSchools.pending, state => setLoadingAndError(state, true))
      .addCase(fetchSchools.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.schools = action.payload
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        setLoadingAndError(
          state,
          false,
          action.error.message || 'Erro ao buscar escolas'
        )
      })

      // Get School
      .addCase(fetchSchoolById.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        console.log(action.payload)
        state.school = action.payload
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // Delete School
      .addCase(deleteSchoolById.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(deleteSchoolById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.schools = state.schools.filter(
          school => school.id !== action.payload
        )
      })
      .addCase(deleteSchoolById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // Update School
      .addCase(updateSchool.pending, state => setLoadingAndError(state, true))
      .addCase(updateSchool.fulfilled, (state, action) => {
        setLoadingAndError(state, false)

        const updatedSchoolIndex = state.schools.findIndex(
          school => school.id === action.payload.id
        )

        if (updatedSchoolIndex !== -1) {
          state.schools[updatedSchoolIndex] = action.payload
        }

        if (state.school?.id === action.payload.id) {
          state.school = action.payload
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })
  }
})

export default schoolSlice.reducer
