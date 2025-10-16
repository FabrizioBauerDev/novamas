import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// splitter para dividir el texto, prefereblemente en los separadores dados "\n\n" y "."
const generateChunks = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
    separators: ["\n\n", "."],
});

const model = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    modelName: "embedding-001",
});


// funcion para generar los embeddings del markdownw dado, genera los chunks y los embeddings para cada uno
export const generateEmbeddingsMd = async (value: string): Promise<Array<{
    embedding: number[]; content: string }>> => {
    const cleanedContent = value.replace(/[\n]+/g, ' ');
    const chunks = await generateChunks.splitText(cleanedContent);

    const embeddings = await model.embedDocuments(chunks);

    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// funcion para la cual dada la query genera su embedding
export const generateEmbeddingsQuery = async (query: string): Promise<number[]> => {
    return model.embedQuery(query);
}