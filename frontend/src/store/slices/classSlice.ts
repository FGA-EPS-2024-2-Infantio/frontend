import axiosInstance from '@/config/AxiosInstance'
import {
  ClassResponseDto,
  CreateClassType,
  UpdateClassStudents
} from '@/types/Classes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface TeacherData {
  id: string
  name: string
}

interface Student {
  id: string
  name: string
}

interface ClassData {
  id: string
  name: string
  teacher: TeacherData
  disabled: boolean
  createdAt: string
  updatedAt: string
}

interface ClassState {
  loading: boolean
  error: string | null
  classes: ClassResponseDto[]
  classObj: ClassResponseDto | null
  classData: ClassData | null
  students: Student[]
}

const initialState: ClassState = {
  loading: false,
  error: null,
  classes: [],
  classObj: null,
  classData: null,
  students: []
}

const setLoadingAndError = (
  state: ClassState,
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
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async () => {
    const response = await axiosInstance.get('/classes')
    return response.data
  }
)

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassesById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/classes/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar turma')
      )
    }
  }
)

export const deleteClassById = createAsyncThunk(
  'classes/deleteClassById',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/classes/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar turma')
      )
    }
  }
)

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: CreateClassType, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/classes', classData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro ao criar a turma')
      )
    }
  }
)

export const updateClassStudents = createAsyncThunk(
  'classes/updateClassStudents',
  async (
    { id, data }: { id: string; data: UpdateClassStudents },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(`/classes/${id}/students`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(
          error,
          'Ocorreu um erro ao atualizar os estudantes na turma'
        )
      )
    }
  }
)

export const updateClass = createAsyncThunk(
  'classObj/updateClass',
  async (
    { id, data }: { id: string; data: CreateClassType },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/classes/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar turma')
      )
    }
  }
)

export const fetchClassDetails = createAsyncThunk(
  'class/fetchClassDetails',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/classes/${classId}`)
      console.log(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue('Erro ao buscar detalhes da turma')
    }
  }
)

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create Class
      .addCase(createClass.pending, state => setLoadingAndError(state, true))
      .addCase(createClass.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.classes.push(action.payload)
      })
      .addCase(createClass.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // List Classes
      .addCase(fetchClasses.pending, state => setLoadingAndError(state, true))
      .addCase(fetchClasses.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.classes = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        setLoadingAndError(
          state,
          false,
          action.error.message || 'Erro ao buscar turmas'
        )
      })

      // Get Class
      .addCase(fetchClassById.pending, state => setLoadingAndError(state, true))
      .addCase(fetchClassById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.classObj = action.payload
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // Delete Class
      .addCase(deleteClassById.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(deleteClassById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.classes = (state.classes).filter(
          classObj => classObj.id !== action.payload
        )
      })
      .addCase(deleteClassById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // Update Class
      .addCase(updateClass.pending, state => setLoadingAndError(state, true))
      .addCase(updateClass.fulfilled, (state, action) => {
        setLoadingAndError(state, false)

        const updatedClassIndex = state.classes.findIndex(
          classObj => classObj.id === action.payload.id
        )

        if (updatedClassIndex !== -1) {
          state.classes[updatedClassIndex] = action.payload
        }

        if (state.classObj?.id === action.payload.id) {
          state.classObj = action.payload
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })
      // Update Students class
      .addCase(updateClassStudents.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(updateClassStudents.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.classObj = action.payload
      })
      .addCase(updateClassStudents.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })
      .addCase(fetchClassDetails.pending, state => setLoadingAndError(state, true))
      .addCase(fetchClassDetails.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        const { id, name, teacher, students, disabled, createdAt, updatedAt } = action.payload
        state.classData = {
          id,
          name,
          teacher,
          disabled,
          createdAt,
          updatedAt
        }
        state.students = students
      })
      .addCase(fetchClassDetails.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })
  }
})

export default classSlice.reducer
