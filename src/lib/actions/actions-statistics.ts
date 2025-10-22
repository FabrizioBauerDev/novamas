"use server"

import {
    getConversationInfo,
    getGeneralStats, getGeneralStatsByGroups,
    getNumberStats,
    getStatsByChatGroupId,
    getStatsByChatId
} from "@/lib/db/queries/statistic";
import {ExcelGeneralStats, GeneralStats} from "@/types/statistics";


export async function callAPI() {
    const res = await fetch(`${process.env.FAST_API_URL}/stats`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.FAST_API_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    if(res.status === 204){
        return{ ok: true, message: "No hay sesiones nuevas para calcular." }
    }

    if (!res.ok) {
        const error = await res.text();
        return {ok: false, message: error};
    }

    const data : {message:string} = await res.json();
    return {ok: true, message: data.message};
}


export async function convertStatsAction(generalStats: GeneralStats[]): Promise<ExcelGeneralStats> {
    const country: { [key: string]: number } = {}
    const province: { [key: string]: number } = {}
    const neighbourhood: { [key: string]: number } = {}
    const gender = { Femenino: 0, Masculino: 0, Otro: 0 }
    const changeTheme = { Si: 0, No: 0}
    const betType = {
        "Casino presencial": 0,
        "Casino online": 0,
        "Videojuego": 0,
        "Lotería": 0,
        "Apuesta deportiva": 0,
        "No especifica": 0,
    }
    const sentiment = { Positivo: 0, Negativo: 0, Neutral: 0 }
    const age = { "13-16": 0, "17-20": 0, "21-25": 0, "26-40": 0, "41-99": 0 }
    const risk = { Alto: 0, Medio: 0, Bajo: 0 }
    const average = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
    const rating = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
    for (const stat of generalStats) {
        if(stat.country){
            if(!(stat.country in country)) {
                country[stat.country] = 0
            }
            country[stat.country]++;
        }

        if(stat.province){
            if(!(stat.province in province)) {
                province[stat.province] = 0
            }
            province[stat.province]++;
        }

        if(stat.neighbourhood){
            if(!(stat.neighbourhood in neighbourhood)) {
                neighbourhood[stat.neighbourhood] = 0
            }
            neighbourhood[stat.neighbourhood]++;
        }

        if(stat.changeTheme){
            changeTheme["Si"]++;
        }else{
            changeTheme["No"]++;
        }

        switch (stat.gender) {
            case "FEMENINO": gender["Femenino"]++; break
            case "MASCULINO": gender["Masculino"]++; break
            case "OTRO": gender["Otro"]++; break
        }

        switch (stat.betType) {
            case "CASINO_PRESENCIAL": betType["Casino presencial"]++; break
            case "CASINO_ONLINE": betType["Casino online"]++; break
            case "VIDEOJUEGO": betType["Videojuego"]++; break
            case "LOTERIA": betType["Lotería"]++; break
            case "DEPORTIVA": betType["Apuesta deportiva"]++; break
            case "NO_ESPECIFICA": betType["No especifica"]++; break
        }

        switch (stat.mostFrequentSentiment) {
            case "POS": sentiment["Positivo"]++; break
            case "NEG": sentiment["Negativo"]++; break
            case "NEU": sentiment["Neutral"]++; break
        }

        const ageValue = stat.age
        if (ageValue >= 13 && ageValue <= 16) age["13-16"]++
        else if (ageValue >= 17 && ageValue <= 20) age["17-20"]++
        else if (ageValue >= 21 && ageValue <= 25) age["21-25"]++
        else if (ageValue >= 26 && ageValue <= 40) age["26-40"]++
        else if (ageValue >= 41 && ageValue <= 99) age["41-99"]++

        const averageValue = stat.average
        if (averageValue){
            if(averageValue<1.5) average["1"]++
            else if (averageValue <2.5) average["2"]++
            else if (averageValue <3.5) average["3"]++
            else if (averageValue <4.5) average["4"]++
            else average["5"]++
        }

        const ratingValue = stat.rating
        if (ratingValue){
            switch (ratingValue) {
                case 1: rating["1"]++; break
                case 2: rating["2"]++; break
                case 3: rating["3"]++; break
                case 4: rating["4"]++; break
                case 5: rating["5"]++; break
            }
        }

        const score = stat.score
        if ([0, 1, 2].includes(score)) risk.Bajo++
        else if ([3, 4].includes(score)) risk.Medio++
        else if ([5, 6].includes(score)) risk.Alto++
    }
    return {
        country,
        province,
        gender,
        average,
        betType,
        sentiment,
        age,
        risk,
        changeTheme,
        rating,
    }
}

export async function getGeneralStatisticsAction(chatGroupId: string|null) {
    try {
        const generalStats = await getGeneralStats(chatGroupId)
        return { success: true, data: generalStats }
    } catch (error) {
        console.error("Error in getGeneralStatisticsAction:", error)
        return { success: false, error: "Error al cargar las estadisticas generales" }
    }
}

export async function getGeneralStatisticsByGroupsAction() {
    try {
        const generalStats = await getGeneralStatsByGroups();
        return { success: true, data: generalStats }
    } catch (error) {
        console.error("Error in getGeneralStatisticsAction:", error)
        return { success: false, error: "Error al cargar las estadisticas generales" }
    }
}

export async function getStatsConversationInfoAction(chatGroupId: string) {
    try {
        const conv = await getConversationInfo(chatGroupId)
        return { success: true, data: conv }
    } catch (error) {
        console.error("Error in getConversationInfoAction:", error)
        return { success: false, error: "Error al cargar las estadisticas de las conversaciones" }
    }
}

export async function getStatsbyChatGroupIdAction(chatGroupId: string) {
    try {
        const statsByChatGroupId = await getStatsByChatGroupId(chatGroupId)
        return { success: true, data: statsByChatGroupId }
    } catch (error) {
        console.error("Error in getStatsbySlugAction:", error)
        return { success: false, error: "Error al cargar las estadisticas por slug" }
    }
}

export async function getStatsbyIdAction(id: string) {
    try {
        const statsById = await getStatsByChatId(id)
        return { success: true, data: statsById }
    } catch (error) {
        console.error("Error in getStatsbyIdAction:", error)
        return { success: false, error: "Error al cargar las estadisticas por id" }
    }
}

export async function getNumberStatsAction(){
    try{
        const result = await getNumberStats()
        return {success: true, data: result}
    }catch (error){
        console.error("Error in getNumberStatsAction:", error)
        return { success: false, error: "Error al cargar las estadisticas de arriba" }
    }
}