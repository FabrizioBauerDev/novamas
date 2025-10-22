'use server'
import ExcelJS from 'exceljs';
import {Worksheet} from "exceljs";
import {ExcelGeneralStats} from "@/types/statistics";
import {getAllStats, getGeneralStatsByGroups} from "@/lib/db/queries/statistic";
import {getGroupConversationInfoAction} from "@/lib/actions/actions-chatgroup";
import {convertStatsAction} from "@/lib/actions/actions-statistics";
import {getAllFinalForms} from "@/lib/db/queries/finalForm";
import {getAllEvaluationForms} from "@/lib/db/queries/evaluationForm";
import {getCouldntStopLabel, getGenderLabel, getPersonalIssuesLabel, ScaleEnum} from "@/lib/enums";
import {getAllFeedBack} from "@/lib/db/queries/feedBack";

const FILA_COLORS = ['F2F2F2','FFFFFF'];
const getBetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        CASINO_PRESENCIAL: "Casino Presencial",
        CASINO_ONLINE: "Casino Online",
        DEPORTIVA: "Apuesta Deportiva",
        LOTERIA: "Lotería",
        VIDEOJUEGO: "Videojuego",
        NO_ESPECIFICA: "No Especifica",
    }
    return labels[type] || type
}

export async function createExcel(currentUser: string, generalStats: ExcelGeneralStats, chatGrupId: string|null) {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Creado por: NoVa+, Solicitado por: ' + currentUser;
    workbook.created = new Date();

    // Hoja de estadísticas generales
    const sheetGeneral = workbook.addWorksheet('Estadisticas generales', {properties:{tabColor:{argb:'C5D9F1'}}});
    handleGeneral(sheetGeneral, generalStats);

    if(!chatGrupId){
        // Hoja de estadísticas por grupos
        const sheetGroups = workbook.addWorksheet('Estadisticas por grupos', {properties: {tabColor: {argb:'CEC0F6'}}, views: [{state: 'frozen',  ySplit: 1}]});
        await handleGroupStats(sheetGroups);
    }

    // Hoja de estadísticas individuales
    const sheetIndividual = workbook.addWorksheet('Estadisticas individuales', {properties: {tabColor: {argb:'F1C5EC'}}, views: [{state: 'frozen',  ySplit: 1}]});
    await handleIndividualStats(sheetIndividual, chatGrupId);

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

function handleGeneral(sheet: Worksheet, generalStats: ExcelGeneralStats) {
    sheet.columns = [
        {header: 'Cantidad de sesiones', key: 'cant', width: 15}, // A
        {header: 'Sexo', key: 'sex', width: 12}, // B
        {header: '', key: 'sexCant'}, // C
        {header: 'Rango de edad', key: 'age'}, // D
        {header: '', key: 'ageCant'}, // E
        {header: 'Nivel de riesgo', key: 'risk'}, // F
        {header: '', key: 'riskCant'}, // G
        {header: 'Sentimiento más frecuente', key: 'sentiment'}, // H
        {header: '', key: 'sentimentCant'}, // I
        {header: 'Tipo de apuesta', key: 'betType', width: 15}, // J
        {header: '', key: 'betTypeCant'}, // K
        {header: 'Cambió tema de conversación', key: 'changeTheme'}, // L
        {header: '', key: 'changeThemeCant'}, // M
        {header: 'Promedio evaluación del asistente', key: 'rating', width: 15}, // N
        {header: '', key: 'ratingCant'}, // O
        {header: 'País', key: 'country', width:15}, // P
        {header: '', key: 'countryCant'}, // Q
        {header: 'Provincia', key: 'province'}, // R
        {header: '', key: 'provinceCant'}, // S
        {header: 'Feedback del asistente', key: 'feedBackRating'}, // T
        {header: '', key: 'feedBackCant'}, // U
    ]

    sheet.mergeCells('B1:C1'); // Merge de Sexo
    sheet.mergeCells('D1:E1'); // Merge de Rango de edad
    sheet.mergeCells('F1:G1'); // Merge de Nivel de riesgo
    sheet.mergeCells('H1:I1'); // Merge de Sentimiento mas frecuente
    sheet.mergeCells('J1:K1'); // Merge de Tipo de apuesta
    sheet.mergeCells('L1:M1'); // Merge de Cambio de tema
    sheet.mergeCells('N1:O1'); // Merge de Promedio evaluacion del asistente
    sheet.mergeCells('P1:Q1'); // Merge de Pais
    sheet.mergeCells('R1:S1'); // Merge de Provincia
    sheet.mergeCells('T1:U1'); // Merge de FeedBack

    const countriesEntries = Object.entries(generalStats.country);
    const gendersEntries = Object.entries(generalStats.gender);
    const escalasEntries = Object.entries(generalStats.average);
    const sentimentsEntries = Object.entries(generalStats.sentiment);
    const changeThemesEntries = Object.entries(generalStats.changeTheme);
    const agesEntries = Object.entries(generalStats.age);
    const risksEntries = Object.entries(generalStats.risk);
    const provincesEntries = Object.entries(generalStats.province);
    const betTypesEntries = Object.entries(generalStats.betType);
    const ratingEntries = Object.entries(generalStats.rating);

    let length = betTypesEntries.length; // cantidad de valores en betType

    if(provincesEntries.length > length){
        length = provincesEntries.length;
    }
    if(countriesEntries.length > length){
        length = countriesEntries.length;
    }

    const cant = Object.values(generalStats.changeTheme || {}).reduce((a, b) => a + b, 0);


    for (let i = 0; i < length; i++) {

        sheet.addRow({
            cant: i === 0 ? cant : '',
            sex: gendersEntries[i]?.[0] ?? '',
            sexCant: gendersEntries[i]?.[1] ?? '',
            age: agesEntries[i]?.[0] ?? '',
            ageCant: agesEntries[i]?.[1] ?? '',
            risk: risksEntries[i]?.[0] ?? '',
            riskCant: risksEntries[i]?.[1] ?? '',
            sentiment: sentimentsEntries[i]?.[0] ?? '',
            sentimentCant: sentimentsEntries[i]?.[1] ?? '',
            betType: betTypesEntries[i]?.[0] ?? '',
            betTypeCant: betTypesEntries[i]?.[1] ?? '',
            changeTheme: changeThemesEntries[i]?.[0] ?? '',
            changeThemeCant: changeThemesEntries[i]?.[1] ?? '',
            rating: escalasEntries[i]?.[0] !== undefined ? Number(escalasEntries[i][0]) : '',
            ratingCant: escalasEntries[i]?.[1] ?? '',
            country: countriesEntries[i]?.[0] ?? '',
            countryCant: countriesEntries[i]?.[1] ?? '',
            province: provincesEntries[i]?.[0] ?? '',
            provinceCant: provincesEntries[i]?.[1] ?? '',
            feedBackRating: ratingEntries[i]?.[0] !== undefined ? Number(ratingEntries[i][0]) : '',
            feedBackCant: ratingEntries[i]?.[1] ?? '',
        })
    }
    applyStyles(sheet);
    return sheet;
}

function applyStyles(sheet: Worksheet) {
    // Headers principales
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F7BFF4' }
        };
    });

    // Filas de datos
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        }
    });
}

const formatPercentage = (value?: number) =>
    value !== undefined ? (value * 100).toFixed(1) + '%' : '';


async function handleGroupStats(sheet: Worksheet) {
    const groupStats = await getGeneralStatsByGroups();
    sheet.columns = [
        {header: 'Nombre del grupo', key: 'groupName', width: 11}, // A
        {header: 'Fecha de prueba', key: 'date', width: 12}, // B
        {header: 'Cantidad de sesiones', key: 'cant', width: 12}, // C
        {header: 'Sexo', key: 'sex', width: 12}, // D
        {header: '', key: 'sexCant'}, // E
        {header: 'Rango de edad', key: 'age'}, // F
        {header: '', key: 'ageCant'}, // G
        {header: 'Nivel de riesgo', key: 'risk'}, // H
        {header: '', key: 'riskCant'}, // I
        {header: 'Sentimiento más frecuente', key: 'sentiment', width: 20}, // J
        {header: '', key: 'sentimentCant'}, // K
        {header: 'Tipo de apuesta', key: 'betType', width: 20}, // L
        {header: '', key: 'betTypeCant'}, // M
        {header: 'Cambió tema de conversación', key: 'changeTheme', width: 20}, // N
        {header: '', key: 'changeThemeCant'}, // O
        {header: 'Promedio evaluación del asistente', key: 'rating', width: 20}, // P
        {header: '', key: 'ratingCant'}, // Q
        {header: 'País', key: 'country', width:15}, // R
        {header: '', key: 'countryCant'}, // S
        {header: 'Provincia', key: 'province'}, // T
        {header: '', key: 'provinceCant'}, // U
        {header: 'Feedback del asistente', key: 'feedBackRating'}, // v
        {header: '', key: 'feedBackCant'}, // w
    ]

    sheet.mergeCells('D1:E1'); // Merge de Sexo
    sheet.mergeCells('F1:G1'); // Merge de Rango de edad
    sheet.mergeCells('H1:I1'); // Merge de Nivel de riesgo
    sheet.mergeCells('J1:K1'); // Merge de Sentimiento mas frecuente
    sheet.mergeCells('L1:M1'); // Merge de Tipo de apuesta
    sheet.mergeCells('N1:O1'); // Merge de Cambio de tema
    sheet.mergeCells('P1:Q1'); // Merge de Promedio evaluacion del asistente
    sheet.mergeCells('R1:S1'); // Merge de Pais
    sheet.mergeCells('T1:U1'); // Merge de Provincia
    sheet.mergeCells('V1:W1'); // Merge de Feedback

    let i= 0;
    const groupIds = Object.keys(groupStats);
    for(const id of groupIds) {
        const groupData = await getGroupConversationInfoAction(id);
        if(!groupData.data) {
            continue;
        }
        const stats = await convertStatsAction(groupStats[id])
        const countriesEntries = Object.entries(stats.country);
        const gendersEntries = Object.entries(stats.gender);
        const escalasEntries = Object.entries(stats.average);
        const ratingEntries = Object.entries(stats.rating);
        const sentimentsEntries = Object.entries(stats.sentiment);
        const changeThemesEntries = Object.entries(stats.changeTheme);
        const agesEntries = Object.entries(stats.age);
        const risksEntries = Object.entries(stats.risk);
        const provincesEntries = Object.entries(stats.province);
        const betTypesEntries = Object.entries(stats.betType);
        let length = betTypesEntries.length; // cantidad de valores en betType

        if(provincesEntries.length > length){
            length = provincesEntries.length;
        }
        if(countriesEntries.length > length){
            length = countriesEntries.length;
        }
        const cant = Object.values(stats.changeTheme || {}).reduce((a, b) => a + b, 0);

        const color = i % 2 == 0 ? FILA_COLORS[0] : FILA_COLORS[1];

        const startRow = sheet.lastRow?.number? sheet.lastRow.number + 1 : 1;
        for (let i = 0; i < length; i++) {
            sheet.addRow({
                groupName: i === 0 ? groupData.data.name : '',
                date: i === 0 ? groupData.data.startDate.getDate()+'/'+(groupData.data.startDate.getMonth()+1)+'/'+groupData.data.startDate.getFullYear() : '',
                cant: i === 0 ? cant : '',
                sex: gendersEntries[i]?.[0] ?? '',
                sexCant: gendersEntries[i]?.[1] ?? '',
                age: agesEntries[i]?.[0] ?? '',
                ageCant: agesEntries[i]?.[1] ?? '',
                risk: risksEntries[i]?.[0] ?? '',
                riskCant: risksEntries[i]?.[1] ?? '',
                sentiment: sentimentsEntries[i]?.[0] ?? '',
                sentimentCant: sentimentsEntries[i]?.[1] ?? '',
                betType: betTypesEntries[i]?.[0] ?? '',
                betTypeCant: betTypesEntries[i]?.[1] ?? '',
                changeTheme: changeThemesEntries[i]?.[0] ?? '',
                changeThemeCant: changeThemesEntries[i]?.[1] ?? '',
                rating: escalasEntries[i]?.[0] !== undefined ? Number(escalasEntries[i][0]) : '',
                ratingCant: escalasEntries[i]?.[1] ?? '',
                country: countriesEntries[i]?.[0] ?? '',
                countryCant: countriesEntries[i]?.[1] ?? '',
                province: provincesEntries[i]?.[0] ?? '',
                provinceCant: provincesEntries[i]?.[1] ?? '',
                feedBackRating: ratingEntries[i]?.[0] !== undefined ? Number(ratingEntries[i][0]) : '',
                feedBackCant: ratingEntries[i]?.[1] ?? '',
            })
            sheet.lastRow?.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: color }
                };
            });
        }
        const endRow = sheet.lastRow?.number;
        if (endRow && startRow < endRow) {
            sheet.mergeCells(`A${startRow}:A${endRow}`);
            sheet.mergeCells(`B${startRow}:B${endRow}`);
            sheet.mergeCells(`C${startRow}:C${endRow}`);
        }
        i++;
    }
    applyStyles(sheet);
    return sheet;
}

async function handleIndividualStats(sheet: Worksheet, chatGrupId: string|null) {
    const stats = await getAllStats(chatGrupId);
    const finalForms = await getAllFinalForms();
    const feedBacks = await getAllFeedBack();
    const evaluationForms = await getAllEvaluationForms();
    sheet.columns = [
        {header: 'Id de conversación', key: 'chatId', width: 20},
        {header: 'Nombre de la prueba', key: 'chatGroupName', width: 15},
        {header: 'Fecha', key: 'date', width: 15},
        {header: 'Nivel de Riesgo', key: 'risk', width: 15},
        {header: 'Resumen', key: 'resume', width: 20},
        {header: 'Sexo', key: 'sex', width: 15},
        {header: 'Edad', key: 'age', width: 12},
        {header: 'Cantidad de mensajes', key: 'cantMessages', width: 12},
        {header: 'Participa en juegos en línea', key: 'onlineGaming', width: 20},
        {header: 'Tipo de apuesta', key: 'betType', width: 20},
        {header: 'No pudo parar de apostar', key: 'cantStopBetting', width: 20},
        {header: 'Le causó problemas personales', key: 'personalProblems', width: 20},
        {header: 'Intentó dejarlo', key: 'triedStop', width: 20},
        {header: 'Utilizó lenguajes ofensivo', key: 'offensiveLanguage', width: 20},
        {header: 'Utilizó lenguaje irónico', key: 'ironicLanguage', width: 20},
        {header: 'Intentó cambiar de tema', key: 'changeTheme', width: 20},
        {header: 'Promedio de Evaluacion del asistente', key: 'average', width: 20},
        {header: 'El diseño del asistente fue realista y atractivo', key: 'assistantDesign', width: 20},
        {header: 'El asistente explicó bien su alcance y propósito', key: 'assistantPurpose', width: 20},
        {header: 'Las respuestas del asistente fueron útiles, adecuadas e informativas', key: 'assistantResponses', width: 26},
        {header: 'El asistente resulta fácil de usar', key: 'assistantUse', width: 20},
        {header: 'El asistente te fue de utilidad para comprender los riesgos asociados al uso excesivo del juego online', key: 'assistantUseful', width: 26},
        {header: 'Pais', key: 'country', width: 15},
        {header: 'Provincia', key: 'province', width: 15},
        {header: 'Barrio', key: 'neighbourhood', width: 15},
        {header: 'Mínima cant. palabras por mensajes', key: 'minWords', width: 20},
        {header: 'Máximas cant. palabras por mensajes', key: 'maxWords', width: 20},
        {header: 'Porcentaje de mensajes positivos', key: 'positivePercentage', width: 20},
        {header: 'Porcentaje de mensajes negativos', key: 'negativePercentage', width: 20},
        {header: 'Porcentaje de mensajes neutrales', key: 'neutralPercentage', width: 20},
        {header: 'Calificación del asistente', key: 'rating', width: 15},
        {header: 'Comentario de la calificación', key: 'feedBackComment', width: 20},
    ]
    let feedBackMap = null;
    if(feedBacks){
        feedBackMap = new Map(
            feedBacks.map(form => [form.chatSessionId, form])
        );
    }

    const finalFormsMap = new Map(
        finalForms.map(form => [form.chatId, form])
    );

    const evaluationFormsMap = new Map(
        evaluationForms.map(form => [form.id, form])
    );
    const chatGroup: { [p: string]: {id:string,name:string,startDate:Date}} ={};
    let i=0;

    for (const stat of stats) {
        const evaluationForm = evaluationFormsMap.get(stat.chatId);
        const finalForm = finalFormsMap.get(stat.chatId);
        let feedBack = null;
        if(feedBackMap){
            feedBack = feedBackMap.get(stat.chatId);
        }
        const color = i % 2 == 0 ? FILA_COLORS[0] : FILA_COLORS[1];

        if (!evaluationForm) {
            console.warn(`No evaluation form found for stat ${stat.chatId}`);
            continue;
        }

        if(stat.chatGroupId && !(stat.chatGroupId in chatGroup)){
            const result = await getGroupConversationInfoAction(stat.chatGroupId);
            if(result.success && result.data){
                chatGroup[stat.chatGroupId] = result.data;
            }
        }
        sheet.addRow({
            chatId: evaluationForm.id,
            chatGroupName: stat.chatGroupId && chatGroup[stat.chatGroupId]? chatGroup[stat.chatGroupId].name: "No tiene grupo",
            date: evaluationForm.createdAt.getDate()+'/'+(evaluationForm.createdAt.getMonth()+1)+'/'+evaluationForm.createdAt.getFullYear(),
            risk: evaluationForm.score > 5 ? "Alto" : evaluationForm.score > 4 ? "Medio" : "Bajo",
            resume: stat.summary,
            sex: getGenderLabel(evaluationForm.gender),
            age: evaluationForm.age,
            cantMessages: stat.amountMessages,
            onlineGaming: evaluationForm.onlineGaming? "Si" : "No",
            betType: getBetTypeLabel(stat.betType),
            cantStopBetting: getCouldntStopLabel(evaluationForm.couldntStop),
            personalProblems: getPersonalIssuesLabel(evaluationForm.personalIssues),
            triedStop: evaluationForm.triedToQuit ? "Si" : "No",
            offensiveLanguage: stat.hateSpeech? "Si" : "No",
            ironicLanguage: stat.ironic? "Si" : "No",
            changeTheme: stat.changeTheme? "Si" : "No",
            average: finalForm? finalForm.average: "No contestó",
            assistantDesign: finalForm? ScaleEnum[finalForm.assistantDesign as keyof typeof ScaleEnum]: "No contestó",
            assistantPurpose: finalForm? ScaleEnum[finalForm.assistantPurpose as keyof typeof ScaleEnum]: "No contestó",
            assistantResponses: finalForm? ScaleEnum[finalForm.assistantResponses as keyof typeof ScaleEnum]: "No contestó",
            assistantUse: finalForm? ScaleEnum[finalForm.userFriendly as keyof typeof ScaleEnum]: "No contestó",
            assistantUseful: finalForm? ScaleEnum[finalForm.usefulToUnderstandRisks as keyof typeof ScaleEnum]: "No contestó",
            country: evaluationForm.country? evaluationForm.country: "No se encontró",
            province: evaluationForm.province? evaluationForm.province: "No se encontró",
            neighbourhood: evaluationForm.neighbourhood? evaluationForm.neighbourhood: "No se encontró",
            minWords: stat.minWordsPerMessage,
            maxWords: stat.maxWordsPerMessage,
            positivePercentage: formatPercentage(stat.positivePercentage),
            negativePercentage: formatPercentage(stat.negativePercentage),
            neutralPercentage: formatPercentage(stat.neutralPercentage),
            rating: feedBack? feedBack.rating: "No contestó",
            feedBackComment: feedBack? feedBack.comment? feedBack.comment : "No contestó": "No contestó",
        })
        sheet.lastRow?.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color }
            };
        });
        i++;
    }

    applyStyles(sheet);
    return sheet;
}

