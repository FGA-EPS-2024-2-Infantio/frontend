export type MonthlyPaymentDto = {
    studentId: string;
    month: number;
    year: number;
    payed: boolean;
    value: number;
}

export type MonthlyPaymentResponseDto = {
    id: string;
    studentId: string;
    month: number;
    year: number;
    value: number;
    payed: boolean;
    disabled: boolean;
  }
  