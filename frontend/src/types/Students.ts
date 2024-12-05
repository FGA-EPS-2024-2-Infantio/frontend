import { MonthlyPaymentResponseDto } from "./Payment";

export type StudentDTO = {
    name: string;
    categorie: CategorieType;
    class: ClassType;
    turn: TurnType;
}

export type StudentsResponseDTO = {
    id: string;
    name: string;
    categorie: CategorieType;
    class: ClassType;
    turn: TurnType;
    payments: MonthlyPaymentResponseDto[];
    disabled: boolean;
}

export enum CategorieType {
    PARCIAL = "PARCIAL",
    INTEGRAL = "INTEGRAL"
}
  
export enum ClassType {
    BERCARIO = "BERCARIO",
    CRECHE = "CRECHE",
    ESCOLA = "ESCOLA",
    REFORCO = "REFORCO",
}
  
export enum TurnType {
    MATUTINO = "MATUTINO",
    VESPERTINO = "VESPERTINO" 
}
