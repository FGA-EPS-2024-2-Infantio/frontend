export type CreateSchoolType = {
  name: string
  directorEmail: string
  numberStudents: number
}

export type SchoolResponseDto = {
  id: string
  name: string
  directorEmail: string
  numberStudents: number
  disabled: boolean
  createdAt: Date
}
