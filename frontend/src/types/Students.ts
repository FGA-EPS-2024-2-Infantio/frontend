export type StudentDTO = {
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
    dataNascimento?: Date;
    naturalidadeAluno?: string;
    endereco?: string;
    cep?: string;
    mae?: ParentDataDTO;
    pai?: ParentDataDTO;
    responsaveis?: ResponsavelDTO[];
    observacoes?: observacaoDTO[];
    observacoesMedicas?: ObservacoesMedicasDto;
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
