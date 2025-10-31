import { removeStopwords, spa } from 'stopword'

// Funcion para calcular la relevancia que tienen las respuestas dadas por el bibliography
// Parametros:
//      responses: arreglo de respuestas del contexto recuperado del RAG
//      query: pregunta/mensaje del usuario
export function calculate_relevancy(responses: string[], query: string) {
    const queryWords = query.toLowerCase().split(' ');
    const queryRelevant = removeStopwords(queryWords, spa);

    let countRelevant = 0;
    for (let response of responses) {
        response = response.toLowerCase();
        const containsRelevant = queryRelevant.some((word: string) => response.includes(word));
        if (containsRelevant) {
            countRelevant += 1;
        }
    }
    return countRelevant / responses.length;
}

export function rag_usage(modelResponse: string, ragResponse: string) {
    const ragResponseRelevant = removeStopwords(ragResponse.toLowerCase().split(' '), spa);

    const containsRag = ragResponseRelevant.some((word: string) => modelResponse.includes(word));
    if(containsRag) {
        return true;
    }
    return false;
}