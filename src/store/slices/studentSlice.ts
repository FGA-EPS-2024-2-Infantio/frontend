import axiosInstance from '@/config/AxiosInstance'
import { StudentDTO, StudentsResponseDTO } from '@/types/Students'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


type School = {
  id: number
  name: string
}
interface StudentState {
  loading: boolean
  error: string | null
  schools: School[]
  students: StudentsResponseDTO[]
  student: StudentsResponseDTO | null
}

const initialState: StudentState = {
  loading: false,
  error: null,
  students: [],
  schools: [],
  student: null
}



const getAxiosErrorMessage = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data.message || defaultMessage
  }
  return defaultMessage
}

export const fetchSchools = createAsyncThunk(
  'students/fetchSchools',
  async () => {
    const response = await axiosInstance.get('/schools')
    return response.data
  }
)


export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    const response = await axiosInstance.get('/students')
    return response.data
  }
)

export const deleteStudentById = createAsyncThunk(
  'students/deleteStudentById',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/students/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao desativar estudante')
      )
    }
  }
)

export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao buscar estudante')
      )
    }
  }
)


export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData: StudentDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/students', studentData)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Ocorreu um erro')
      )
    }
  }
)

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async (
    { id, data }: { id: string; data: StudentDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/students/${id}`, data)
      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getAxiosErrorMessage(error, 'Erro ao atualizar dados do aluno')
      )
    }
  }
)

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      // POST
      .addCase(createStudent.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false
        state.students.push(action.payload)
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // GET Students
      .addCase(fetchStudents.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar estudantes'
      })

      // GET StudentByID
      .addCase(fetchStudentById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false
        state.student = action.payload
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar estudante'
      })

      //Delete
      .addCase(deleteStudentById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteStudentById.fulfilled, (state, action) => {
        state.loading = false
        state.students = state.students.filter(
          student => student.id !== action.payload
        )
      })
      .addCase(deleteStudentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao deletar estudante'
      })

      //Update
      .addCase(updateStudent.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false
        const updatedStudentIndex = state.students.findIndex(
          student => student.id === action.payload.id
        )

        if (updatedStudentIndex !== -1) {
          state.students[updatedStudentIndex] = action.payload
        }

        if (state.student?.id === action.payload.id) {
          state.student = action.payload
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao atualizar estudante'
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

export default studentSlice.reducer
