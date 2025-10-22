import {CouldntStopType, GenderType, PersonalIssuesType} from "@/lib/enums";

export interface ExcelGeneralStats {
    country: Record<string, number>;
    province: Record<string, number>;
    gender: {
        Femenino: number;
        Masculino: number;
        Otro: number;
    };
    betType: {
        "Casino presencial": number;
        "Casino online": number;
        "Videojuego": number;
        "Lotería": number;
        "Apuesta deportiva": number;
        "No especifica": number;
    };
    sentiment: {
        Positivo: number;
        Negativo: number;
        Neutral: number;
    };
    age: {
        "13-16": number;
        "17-20": number;
        "21-25": number;
        "26-40": number;
        "41-99": number;
    };
    risk: {
        Alto: number;
        Medio: number;
        Bajo: number;
    };
    changeTheme: {
        Si: number;
        No: number;
    };
    average:{
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    }
    rating:{
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    }
}
export interface ConversationInfo {
    id: string
    summary: string
    gender: GenderType
    risk: number
    negativePercentage: number
    date: Date
}
export interface FinalForm {
    assistantDesign: number,
    assistantPurpose: number,
    assistantResponses: number,
    userFriendly: number,
    usefulToUnderstandRisks: number,
    average: number,
}
export interface EvaluationFormResult {
    id: string
    gender: GenderType
    age: number
    onlineGaming: boolean;
    couldntStop: CouldntStopType;
    personalIssues: PersonalIssuesType;
    triedToQuit: boolean;
    score: number
    createdAt: Date;
    country: string | null
    province: string | null
    neighbourhood: string | null
}

export interface GeneralStats {
    betType?: BetType | null
    gender: GenderType
    age: number
    score: number
    mostFrequentSentiment: SentimentType | null
    country: string | null
    province: string | null
    neighbourhood: string | null
    changeTheme: boolean | null
    average: number | null
    rating: number | null
}


export interface Statistics {
    id: string
    summary: string
    chatId: string
    chatGroupId?: string | null
    amountMessages: number
    minWordsPerMessage: number
    maxWordsPerMessage: number
    hateSpeech: boolean
    ironic: boolean
    positivePercentage: number
    negativePercentage: number
    neutralPercentage: number
    mostFrequentSentiment: SentimentType
    changeTheme: boolean
    betType: BetType
    createdAt: Date
}

export const BetTypeEnum = {
    CASINO_PRESENCIAL: "Casino presencial",
    CASINO_ONLINE: "Casino online",
    DEPORTIVA: "Apuesta deportiva",
    LOTERIA: "Lotería",
    VIDEOJUEGO: "Videojuego",
    NO_ESPECIFICA: "No especifica",
} as const;

export const SentimentEnum = {
    POS: "Positivo",
    NEG: "Negativo",
    NEU: "Neutral",
} as const;

export type SentimentType = keyof typeof SentimentEnum;
export type BetType = keyof typeof BetTypeEnum;
