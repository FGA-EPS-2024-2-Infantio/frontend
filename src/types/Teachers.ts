
export type CreateTeacherType = {
  name: string
  email: string
  password: string
  numberOfClasses: number
  cpf: string
  startDate: Date;
  userId: string;
}

export type TeacherResponseDto = {
  id: string
  name: string
  numberOfClasses: number
  cpf: string
  startDate: Date;
  createdAt: Date
  disabled: boolean
  schoolId: string;
}
