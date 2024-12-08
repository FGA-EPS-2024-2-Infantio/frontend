export type CreateTeacherType = {
  name: string
  numberOfClasses: number
  cpf: string
  startDate: Date;
  schoolId: string;
}

export type TeacherResponseDto = {
  id: string
  name: string
  numberOfClasses: number
  cpf: string
  startDate: Date;
  createdAt: Date
  schoolId: string;
}
