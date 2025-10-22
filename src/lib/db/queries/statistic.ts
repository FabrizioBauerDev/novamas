import {db} from "@/db";
import {chatFeedbacks, chatSessions, evaluationForms, finalForm, geoLocations, statistics} from "@/db/schema";
import {asc, desc, eq, isNotNull, isNull} from "drizzle-orm";
import {EvaluationFormResult, ExcelGeneralStats, GeneralStats} from "@/types/statistics";
import {GenderType} from "@/lib/enums";

const Provinces = [
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
    "Islas Malvinas"
]
function convertAddress(evaluationForm: {
    betType: "CASINO_PRESENCIAL" | "CASINO_ONLINE" | "DEPORTIVA" | "LOTERIA" | "VIDEOJUEGO" | "NO_ESPECIFICA" | null,
    gender: "MASCULINO" | "FEMENINO" | "OTRO",
    age: number,
    score: number,
    mostFrequentSentiment: "POS" | "NEG" | "NEU" | null,
    address: string | null,
    isGeoLocation: string | null,
    average: number | null,
    changeTheme: boolean | null,
    rating: number | null,}) {
    if (!evaluationForm.address) {
        return {
            gender: evaluationForm.gender,
            age: evaluationForm.age,
            betType: evaluationForm.betType,
            mostFrequentSentiment: evaluationForm.mostFrequentSentiment,
            average: evaluationForm.average,
            changeTheme: evaluationForm.changeTheme,
            score: evaluationForm.score,
            country: null,
            neighbourhood: null,
            province: null,
            rating: evaluationForm.rating
        };
    }else{
        const addressSplit = evaluationForm.address.split(",").map(part => part.trim());
        const geoLocation = !!(evaluationForm.isGeoLocation);
        let country = null;
        let province = null;
        let neighbourhood = null;
        if(geoLocation){
            country = addressSplit[addressSplit.length -1];
            neighbourhood = addressSplit[0];
            if(country == "Argentina"){
                for(let i = addressSplit.length - 2;i>=0; i--){
                    const result = Provinces.find((prov)=> prov == addressSplit[i]);
                    if(result){
                        province = result;
                        break;
                    }
                }
            }
        }else{
            country = addressSplit[2];
            const result = Provinces.find((prov)=> prov == addressSplit[1]);
            if(result){
                province = result;
            }
        }
        return{
            gender: evaluationForm.gender,
            age: evaluationForm.age,
            betType: evaluationForm.betType,
            mostFrequentSentiment: evaluationForm.mostFrequentSentiment,
            score: evaluationForm.score,
            average: evaluationForm.average,
            changeTheme: evaluationForm.changeTheme,
            country: country,
            neighbourhood: neighbourhood,
            province: province,
            rating: evaluationForm.rating
        }
    }
}


export async function getGeneralStats(chatGroupId: string | null) {
    try {
        let condition;

        if (chatGroupId === null || chatGroupId === undefined) {
            // Busca todas las estadisticas
            condition = undefined;
        } else if (chatGroupId === "") {
            // Busca sesiones publicas
            condition = isNull(statistics.chatGroupId);
        } else {
            // Busca estadisticas de un grupo en particular
            condition = eq(statistics.chatGroupId, chatGroupId);
        }

        const result = await db
            .select({
                betType: statistics.betType,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                score: evaluationForms.score,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                average: finalForm.average,
                address: evaluationForms.address,
                isGeoLocation: geoLocations.id,
                changeTheme: statistics.changeTheme,
                rating: chatFeedbacks.rating,
            })
            .from(statistics)
            .rightJoin(evaluationForms, eq(statistics.chatId, evaluationForms.id))
            .leftJoin(finalForm, eq(finalForm.chatId, evaluationForms.id))
            .leftJoin(chatFeedbacks, eq(chatFeedbacks.chatSessionId, evaluationForms.id))
            .leftJoin(geoLocations, eq(geoLocations.evaluationFormId, evaluationForms.id))
            .where(condition);


        const evaluationArray: GeneralStats[]= [];
        for (let i=0; i<result.length; ++i) {
            evaluationArray.push(convertAddress(result[i]))
        }
        return evaluationArray;
    } catch (error) {
        console.error("Error fetching general stats:", error);
        throw new Error("Failed to fetch general stats");
    }
}


export async function getGeneralStatsByGroups() {
    try {
        const result = await db
            .select({
                chatGroupId: statistics.chatGroupId,
                betType: statistics.betType,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                score: evaluationForms.score,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                average: finalForm.average,
                address: evaluationForms.address,
                isGeoLocation: geoLocations.id,
                changeTheme: statistics.changeTheme,
                rating: chatFeedbacks.rating,
            })
            .from(statistics)
            .rightJoin(evaluationForms, eq(statistics.chatId, evaluationForms.id))
            .leftJoin(finalForm, eq(finalForm.chatId, evaluationForms.id))
            .leftJoin(chatFeedbacks, eq(chatFeedbacks.chatSessionId, evaluationForms.id))
            .leftJoin(geoLocations, eq(geoLocations.evaluationFormId, evaluationForms.id))
            .where(isNotNull(statistics.chatGroupId))
            .orderBy(desc(statistics.chatGroupId));

        const generalStats: { [key: string]: GeneralStats[] } = {}

        for (let i = 0; i < result.length; i++) {
            const converted = convertAddress(result[i]);
            const chatGroupId = result[i].chatGroupId;

            if (!chatGroupId) continue;

            if (!generalStats[chatGroupId]) {
                generalStats[chatGroupId] = [converted];
            } else {
                generalStats[chatGroupId].push(converted);
            }
        }


        return generalStats;
    } catch (error) {
        console.error("Error fetching general stats:", error);
        throw new Error("Failed to fetch general stats");
    }
}

export async function getConversationInfo(chatGroupId: string) {
    try{
        const result = await db
            .select({
                id: statistics.chatId,
                summary: statistics.summary,
                gender: evaluationForms.gender,
                risk: evaluationForms.score,
                negativePercentage: statistics.negativePercentage,
                date: evaluationForms.createdAt
            })
            .from(statistics)
            .innerJoin(evaluationForms, eq(statistics.chatId, evaluationForms.id))
            .where(eq(statistics.chatGroupId, chatGroupId))
            .orderBy(desc(evaluationForms.createdAt));

        return result
    }catch (error) {
        console.error("Error fetching conversation info by chat group id:", error)
        throw new Error("Failed to fetch conversation info by chat group id")
    }
}


export async function getStatsByChatGroupId(id: string) {
    try {
        const result = await db
            .select({
                id: statistics.id,
                chatId: statistics.chatId,
                chatGroupId: statistics.chatGroupId,
                summary: statistics.summary,
                betType: statistics.betType,
                amountMessages: statistics.amountMessages,
                minWordsPerMessage: statistics.minWordsPerMessage,
                maxWordsPerMessage: statistics.maxWordsPerMessage,
                hateSpeech: statistics.hateSpeech,
                ironic: statistics.ironic,
                positivePercentage: statistics.positivePercentage,
                negativePercentage: statistics.negativePercentage,
                neutralPercentage: statistics.neutralPercentage,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                changeTheme: statistics.changeTheme,
                createdAt: statistics.createdAt,
            })
            .from(statistics)
            .where(eq(statistics.chatGroupId, id))
            .orderBy(desc(statistics.createdAt));

        return result
    } catch (error) {
        console.error("Error fetching stats by chat slug:", error)
        throw new Error("Failed to fetch stats by chat slug")
    }
}

export async function getAllStats(chatGroupId: string | null) {
    try {
        let condition;

        if (chatGroupId === null || chatGroupId === undefined) {
            // Busca todas las estadisticas
            condition = undefined;
        } else {
            // Busca estadisticas de un grupo en particular
            condition = eq(statistics.chatGroupId, chatGroupId);
        }
        const result = await db
            .select()
            .from(statistics)
            .where(condition)
            .orderBy(desc(statistics.createdAt));

        return result;
    } catch (error) {
        console.error("Error fetching all stats:", error)
        throw new Error("Failed to fetch all stats")
    }
}

export async function getStatsByChatId(id: string) {
    try {
        const result = await db
            .select({
                id: statistics.id,
                chatId: statistics.chatId,
                summary: statistics.summary,
                betType: statistics.betType,
                amountMessages: statistics.amountMessages,
                minWordsPerMessage: statistics.minWordsPerMessage,
                maxWordsPerMessage: statistics.maxWordsPerMessage,
                hateSpeech: statistics.hateSpeech,
                ironic: statistics.ironic,
                positivePercentage: statistics.positivePercentage,
                negativePercentage: statistics.negativePercentage,
                neutralPercentage: statistics.neutralPercentage,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                changeTheme: statistics.changeTheme,
                createdAt: statistics.createdAt,
            })
            .from(statistics)
            .where(eq(statistics.chatId, id))
            .limit(1)
            .orderBy(desc(statistics.createdAt));

        return result[0]
    } catch (error) {
        console.error("Error fetching stats by chat id:", error)
        throw new Error("Failed to fetch stats by chat id")
    }
}

export async function getNumberStats() {
    try {
        const results = await db
            .select({
                analyzed: chatSessions.analyzed
            })
            .from(chatSessions)
            .where(isNotNull(chatSessions.sessionEndedAt))

        let analyzedTrue = 0;
        let analyzedFalse = 0;

        for (const result of results){
            if(result.analyzed){
                analyzedTrue++;
            }else{
                analyzedFalse++;
            }
        }

        return {analyzedTrue, analyzedFalse}
    } catch (error) {
        console.error("Error fetching general stats:", error)
        throw new Error("Failed to fetch general stats")
    }
}