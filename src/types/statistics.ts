import {CouldntStopType, GenderType, PersonalIssuesType, ScaleType} from "@/lib/enums";

export interface FinalForm {
    assistantDesign: number,
    assistantPurpose: number,
    assistantResponses: number,
    userFriendly: number,
    usefulToUnderstandRisks: number,
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
}

export interface GeneralStats {
    betType?: BetType | null
    gender: GenderType
    age: number
    score: number
    mostFrequentSentiment: SentimentType | null
    usefulToUnderstandRisks: number | null
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
