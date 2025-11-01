import { removeStopwords, spa } from 'stopword'

// Funcion para calcular la relevancia que tienen las respuestas dadas por el bibliography
// Parametros:
//      responses: arreglo de respuestas del contexto recuperado del RAG
//      query: pregunta/mensaje del usuario
export function calculate_relevancy(responses: string, query: string) {
    const queryWords = query.toLowerCase().split(' ');
    const queryRelevant = removeStopwords(queryWords, spa);
    const responseLower = responses.toLowerCase();
    const responseRelevant = (removeStopwords(responseLower.split(' '), spa)).join(' ');
    let countRelevant = 0;
    for (const word of queryRelevant) {
        const containsRelevant = responseRelevant.includes(word);
        if (containsRelevant) {
            countRelevant += 1;
        }
    }
    return countRelevant / queryRelevant.length;
}

export function rag_usage(modelResponse: string, ragResponse: string) {
    const ragResponseRelevant = removeStopwords(ragResponse.toLowerCase().split(' '), spa);

    const containsRag = ragResponseRelevant.some((word: string) => modelResponse.includes(word));
    if(containsRag) {
        return true;
    }
    return false;
}