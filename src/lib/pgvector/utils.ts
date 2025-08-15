import {db} from '@/rag/index'
import {bibliography, chunk} from '@/rag/schema'
import { generateEmbeddingsQuery, generateEmbeddingsMd }from '@/lib/pgvector/embeddings'
import {cosineDistance, eq, sql, gt, desc} from "drizzle-orm";
import { BibliographyItem } from "@/types/bibliography";


export const getBibliography = async () : Promise<BibliographyItem[]> => {
    const biblio = await db.select().from(bibliography);
    return biblio.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        description: b.description,
        createdat: b.createdat
    }))
}

// funcion para cargar un markdown en la base de datos vectorial
export async function loadMarkdown(markdown: string, title: string, author: string, description: string): Promise<BibliographyItem[]> {
    const [resource] = await db
        .insert(bibliography)
        .values({
            title: title,
            author: author,
            description: description
        })
        .returning();

    const embeddings = await generateEmbeddingsMd(markdown);
    await db.insert(chunk).values(
        embeddings.map(embedding => ({
            resource_id: resource.id,
            ...embedding
        })),
    );

    return getBibliography();
}

// funcion para borrar un markdown de la bd vectorial
export async function deleteMarkdown(id: string) {
    try{
        await db.delete(chunk).where(eq(chunk.resource_id, id));
        await db.delete(bibliography).where(eq(bibliography.id, id));
    }catch(e){
        console.log(e);
    }

    return getBibliography();
}

// funcion para obtener un arreglo de los contenidos mas relevantes sobre la query dada
export async function getRelevantInformation(query: string): Promise<string[]> {
    const queryEmbed = await generateEmbeddingsQuery(query)

    // con esto calcula la similitud entre la columna de embedding y la queryEmbed
    const similarity = sql<number>`1 - (${cosineDistance(chunk.embedding, queryEmbed)})`;

    const similarGuides = await db
        .select({ content: chunk.content, similarity })
        .from(chunk)
        .where(gt(similarity, 0.1))
        .orderBy((t) => desc(t.similarity))
        .limit(3);
    console.log(similarGuides);
    return similarGuides.map(content => content.content);
}
