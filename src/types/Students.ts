import { MonthlyPaymentResponseDto } from "./Payment";

export type StudentDTO = {
    name?: string;
    isFilled?: boolean;
    categorie?: CategorieType;
    class?: ClassType;
    turn?: TurnType;
    dataNascimento?: string;
    naturalidadeAluno?: string;
    endereco?: string;
    cep?: string;
    mae?: ParentDataDTO;
    pai?: ParentDataDTO;
    responsaveis?: ResponsavelDTO[];
    observacoes?: observacaoDTO[];
    observacoesMedicas?: ObservacoesMedicasDto;
    userId: string;
}
export type ParentDataDTO = {
    nome?: string;
    telefone?: string;
    cpf?: string;
    rg?: string;
    naturalidade?: string;
}
export type ResponsavelDTO = {
    nome?: string;
    parentesco?: string;
    telefone?: string;
}

export type observacaoDTO = {
    titulo?: string;
    descricao?: string;
}

export type ObservacoesMedicasDto  = {
    hospital?: string;
    telefoneHospital?: string;
    medico?: string;
    telefoneMedico?: string;
    enderecoHospital?: string;
    possuiConvenio?: boolean;
    alergias?: string;
    medicamentosFebre?: string;
    medicamentosVomito?: string;
    observacoesGerais?: string;
  }


export type StudentsResponseDTO = {
    id: string;
    name: string;
    isFilled?: boolean;
    categorie: CategorieType;
    class: ClassType;
    turn: TurnType;
    dataNascimento?: string;
    naturalidadeAluno?: string;
    endereco?: string;
    cep?: string;
    mae?: ParentDataDTO;
    pai?: ParentDataDTO;
    responsaveis?: ResponsavelDTO[];
    observacoes?: observacaoDTO[];
    observacoesMedicas?: ObservacoesMedicasDto;
    payments: MonthlyPaymentResponseDto[];
    disabled: boolean;
    userId: string;
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