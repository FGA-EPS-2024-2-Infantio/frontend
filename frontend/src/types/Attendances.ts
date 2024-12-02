export type CreateAttendanceType = {
    studentId: string,
    classId: string,
    date: Date,
    hasAttended: boolean,
  }
  
  export type AttendanceResponseDto = {
    id: string
    studentId: string
    studentName: string
    date: Date;
    hasAttended: Boolean
  }
  