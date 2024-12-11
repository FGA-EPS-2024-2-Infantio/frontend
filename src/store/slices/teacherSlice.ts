import axiosInstance from '@/config/AxiosInstance'
import { ClassResponseDto } from '@/types/Classes'
import { CreateTeacherType, TeacherResponseDto } from '@/types/Teachers'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

type School = {
  id: number
  name: string
}

interface TeacherState {
  loading: boolean
  error: string | null
  schools: School[]
  teachers: TeacherResponseDto[]
  teacher: TeacherResponseDto | null
  teacherClasses: ClassResponseDto[]
}

const initialState: TeacherState = {
  loading: false,
  error: null,
  schools: [],
  teachers: [],
  teacher: null,
  teacherClasses: []
}


export const fetchSchools = createAsyncThunk(
  'teacher/fetchSchools',
  async () => {
    const response = await axiosInstance.get('/schools')
    return response.data
  }
)

const setLoadingAndError = (
  state: TeacherState,
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

export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async () => {
    const response = await axiosInstance.get('/teachers')
    return response.data
  }
)

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchTeacherById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/teachers/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar professor')
      )
    }
  }
)

// export const deleteTeacherById = createAsyncThunk(
//   'teachers/deleteTeacherById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/teachers/${id}`)
//       return id
//     } catch (error) {
//       return rejectWithValue(
//         getAxiosErrorMessage(error, 'Erro ao desativar professor')
//       )
//     }
//   }
// )

export const createTeacher = createAsyncThunk(
  'teachers/createTeacher',
  async (teacherData: CreateTeacherType, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/teachers', teacherData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro ao criar o professor')
      )
    }
  }
)

export const updateTeacher = createAsyncThunk(
  'teacher/updateTeacher',
  async (
    { id, data }: { id: string; data: CreateTeacherType },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/teachers/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar professor')
      )
    }
  }
)

export const fetchTeacherClasses = createAsyncThunk(
  'teachers/fetchTeacherClasses',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/teachers/${teacherId}/classes`)
      return response.data
    } catch {
      return rejectWithValue('Erro ao buscar turmas do professor')
    }
  }
)

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create Teacher
      .addCase(createTeacher.pending, state => setLoadingAndError(state, true))
      .addCase(createTeacher.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.teachers.push(action.payload)
      })
      .addCase(createTeacher.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // List Teachers
      .addCase(fetchTeachers.pending, state => setLoadingAndError(state, true))
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.teachers = action.payload
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        setLoadingAndError(
          state,
          false,
          action.error.message || 'Erro ao buscar professores'
        )
      })

      // Get Teacher
      .addCase(fetchTeacherById.pending, state =>
        setLoadingAndError(state, true)
      )
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        console.log(action.payload)
        state.teacher = action.payload
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      // // Delete Teacher
      // .addCase(deleteTeacherById.pending, state =>
      //   setLoadingAndError(state, true)
      // )
      // .addCase(deleteTeacherById.fulfilled, (state, action) => {
      //   setLoadingAndError(state, false)
      //   state.teachers = state.teachers.filter(
      //     teacher => teacher.id !== action.payload
      //   )
      // })
      // .addCase(deleteTeacherById.rejected, (state, action) => {
      //   setLoadingAndError(state, false, action.payload as string)
      // })

      // Update Teacher
      .addCase(updateTeacher.pending, state => setLoadingAndError(state, true))
      .addCase(updateTeacher.fulfilled, (state, action) => {
        setLoadingAndError(state, false)

        const updatedTeacherIndex = state.teachers.findIndex(
          teacher => teacher.id === action.payload.id
        )

        if (updatedTeacherIndex !== -1) {
          state.teachers[updatedTeacherIndex] = action.payload
        }

        if (state.teacher?.id === action.payload.id) {
          state.teacher = action.payload
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })

      .addCase(fetchTeacherClasses.pending, state => {
        setLoadingAndError(state, true)
      })
      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        setLoadingAndError(state, false)
        state.teacherClasses = action.payload // Aqui atualizamos o estado com as turmas obtidas
      })
      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        setLoadingAndError(state, false, action.payload as string)
      })
      //Fetch Schools
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.schools = action.payload;
      })
      
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar escolas'
      })
  }
})

export default teacherSlice.reducer
