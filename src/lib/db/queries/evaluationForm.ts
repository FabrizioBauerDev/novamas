import {db} from "@/db";
import {evaluationForms, geoLocations, statistics} from "@/db/schema";
import {asc, desc, eq} from "drizzle-orm";
import {EvaluationFormResult} from "@/types/statistics";

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
    id: string,
    gender: "MASCULINO" | "FEMENINO" | "OTRO",
    age: number,
    onlineGaming: boolean,
    couldntStop: "NO" | "NO_ES_SEG" | "SI",
    personalIssues: "NO" | "SI" | "NO_AP",
    triedToQuit: boolean,
    score: number,
    createdAt:Date,
    address: string | null,
    isGeoLocation: string | null}): EvaluationFormResult {
    if (!evaluationForm.address) {
        return {
            id: evaluationForm.id,
            gender: evaluationForm.gender,
            age: evaluationForm.age,
            onlineGaming: evaluationForm.onlineGaming,
            couldntStop: evaluationForm.couldntStop,
            personalIssues: evaluationForm.personalIssues,
            triedToQuit: evaluationForm.triedToQuit,
            score: evaluationForm.score,
            createdAt: evaluationForm.createdAt,
            country: null,
            neighbourhood: null,
            province: null
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
            neighbourhood = addressSplit[0];
        }
        return{
            id: evaluationForm.id,
            gender: evaluationForm.gender,
            age: evaluationForm.age,
            onlineGaming: evaluationForm.onlineGaming,
            couldntStop: evaluationForm.couldntStop,
            personalIssues: evaluationForm.personalIssues,
            triedToQuit: evaluationForm.triedToQuit,
            score: evaluationForm.score,
            createdAt: evaluationForm.createdAt,
            country: country,
            neighbourhood: neighbourhood,
            province: province
        }
    }
}

export async function getEvaluationFormByChatId(id: string): Promise<EvaluationFormResult|null> {
    try {
        const formResult = await db
            .select({
                id: evaluationForms.id,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                onlineGaming: evaluationForms.onlineGaming,
                couldntStop: evaluationForms.couldntStop,
                personalIssues: evaluationForms.personalIssues,
                triedToQuit: evaluationForms.triedToQuit,
                score: evaluationForms.score,
                createdAt: evaluationForms.createdAt,
                address: evaluationForms.address,
                isGeoLocation: geoLocations.id
            })
            .from(evaluationForms)
            .where(eq(evaluationForms.id, id))
            .leftJoin(geoLocations, eq(geoLocations.evaluationFormId, evaluationForms.id))
            .limit(1)

        const evaluationForm = formResult[0]
        if (!evaluationForm) {
            return null
        }
        return convertAddress(evaluationForm);
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}

export async function getEvaluationFormByGroupId(group_id: string): Promise<EvaluationFormResult[]|null> {
    try {
        const evaluationForm = await db
            .select({
                id: evaluationForms.id,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                onlineGaming: evaluationForms.onlineGaming,
                couldntStop: evaluationForms.couldntStop,
                personalIssues: evaluationForms.personalIssues,
                triedToQuit: evaluationForms.triedToQuit,
                score: evaluationForms.score,
                createdAt: evaluationForms.createdAt,
                address: evaluationForms.address,
                isGeoLocation: geoLocations.id
            })
            .from(evaluationForms)
            .innerJoin(statistics, eq(evaluationForms.id, statistics.chatId))
            .leftJoin(geoLocations, eq(geoLocations.evaluationFormId, evaluationForms.id))
            .where(eq(statistics.chatGroupId, group_id))
            .orderBy(desc(statistics.createdAt))

        if (!evaluationForm) {
            return null
        }
        const evaluationArray: EvaluationFormResult[] = [];
        for (let i=0; i<evaluationForm.length; ++i) {
            evaluationArray.push(convertAddress(evaluationForm[i]))
        }
        return evaluationArray;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}

export async function getAllEvaluationForms(): Promise<EvaluationFormResult[]> {
    try {
        const evaluationForm = await db
            .select({
                id: evaluationForms.id,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                onlineGaming: evaluationForms.onlineGaming,
                couldntStop: evaluationForms.couldntStop,
                personalIssues: evaluationForms.personalIssues,
                triedToQuit: evaluationForms.triedToQuit,
                score: evaluationForms.score,
                createdAt: evaluationForms.createdAt,
                address: evaluationForms.address,
                isGeoLocation: geoLocations.id
            })
            .from(evaluationForms)
            .leftJoin(geoLocations, eq(geoLocations.evaluationFormId, evaluationForms.id))
            .orderBy(asc(evaluationForms.createdAt))

        const evaluationArray: EvaluationFormResult[] = [];
        for (let i=0; i<evaluationForm.length; ++i) {
            evaluationArray.push(convertAddress(evaluationForm[i]))
        }
        return evaluationArray;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}