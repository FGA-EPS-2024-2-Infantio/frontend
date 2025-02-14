export type CreateAttendanceType = {
    studentId: string,
    classId: string,
    date: Date,
    hasAttended: boolean,
    entryTime: Date | null,
    exitTime: Date | null,
  }
  
  export type AttendanceResponseDto = {
    id: string
    studentId: string
    studentName: string
    date: Date;
    hasAttended: boolean
    entryTime: Date | null;
    exitTime: Date | null;
  }