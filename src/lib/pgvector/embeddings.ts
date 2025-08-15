import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

// splitter para dividir el texto, prefereblemente en los separadores dados "\n\n" y "."
const generateChunks = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ["\n\n", "."],
});

const model = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
});


// funcion para generar los embeddings del markdownw dado, genera los chunks y los embeddings para cada uno
export const generateEmbeddingsMd = async (value: string): Promise<Array<{
    embedding: number[]; content: string }>> => {
    const chunks = await generateChunks.splitText(value);

    const embeddings = await model.embedDocuments(chunks);

    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// funcion para la cual dada la query genera su embedding
export const generateEmbeddingsQuery = async (query: string): Promise<number[]> => {
    return model.embedQuery(query);
}