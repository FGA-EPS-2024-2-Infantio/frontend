export type CreateClassType = {
  name: string
  teacherId: string
  disabled?: boolean
  userId: string
}

export type UpdateClassStudents = {
  studentIds: string[]
}

export type ClassResponseDto = {
  id: string
  name: string
  teacher: {
    id: string
    name: string
  }
  students: {
    id: string
    name: string
  }[]
  disabled: boolean
  disabledAt?: Date
  createdAt: Date
  updatedAt: Date
}
