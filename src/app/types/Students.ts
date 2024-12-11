export type StudentDTO = {
    name: string;
    categorie: CategorieType;
    class: ClassType;
    turn: TurnType;
}

export type StudentsResponseDTO = {
    id: string;
    name: string;
    dataNascimento: string;
    mae: Mae;
    pai: Pai;
    endereco: string;
    cep: string;
    naturalidadeAluno: string;
    categorie: CategorieType;
    class: ClassType;
    turn: TurnType;
    disabled: boolean;
    responsaveis: Responsaveis;
    observacoes: object;
    observacoesMedicas: ObservacoesMedicas;
}

export type Mae = {
    name: string;
    phone: string;
    rg: string;
    cpf: string;
    naturalidade: string;
}

export type Pai = {
    name: string;
    phone: string;
    rg: string;
    cpf: string;
    naturalidade: string;
}

export type Responsaveis = {
    name: string;
    parentesco: string;
    phone: string;
}

export type ObservacoesMedicas = {
    hospital: string;
    hospitalPhone: string;
    doctor: string;
    doctorPhone: string;
    endereco: string;
    convenio: boolean;
    observacoes: string;
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
