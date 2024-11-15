export type CreateTeacherType = {
  name: string
  age: number
  cpf: string
  startDate: Date;
}

export type TeacherResponseDto = {
  id: string
  name: string
  age: number
  cpf: string
  startDate: Date;
  createdAt: Date
}
