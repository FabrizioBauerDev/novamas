import {db} from '@/db'
import {bibliography, chunk, bibliographyCategoryEnum } from '@/db/schema'
import { generateEmbeddingsQuery, generateEmbeddingsMd }from '@/lib/pgvector/embeddings'
import {cosineDistance, eq, sql, gt, desc, and, SQL} from "drizzle-orm";
import {BibliographyItem, BibliographyCategory} from "@/types/bibliography";


export const getBibliography = async () : Promise<BibliographyItem[]> => {
    try{
        const biblio = await db.select().from(bibliography);
        return biblio.map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            description: b.description,
            category: b.category,
            createdat: b.createdAt
        }))
    }catch(e){
        console.log(e);
        return [];
    }

}

// funcion para cargar un markdown en la base de datos vectorial
export async function loadMarkdown(markdown: string, title: string, author: string, description: string, category: BibliographyCategory): Promise<BibliographyItem[]> {
    console.log("Ingresando a LoadMarkdown\n");
    try{
        await db.transaction(async (tx) => {

            const [resource] = await tx
                .insert(bibliography)
                .values({
                    title: title,
                    author: author,
                    description: description,
                    category: category
                })
                .returning();

            console.log("Generando embeddings");
            const embeddings = await generateEmbeddingsMd(markdown);
            console.log("Termina de generar embeddings");

            const batchSize = 500;
            for (let i = 0; i < embeddings.length; i += batchSize) {
                console.log(`Inserting chunk ${i} to ${i + batchSize}`);
                await tx.insert(chunk).values(
                    embeddings.slice(i, i + batchSize).map(embedding => ({
                        resource_id: resource.id,
                        ...embedding
                    }))
                );
            }

            console.log("Cargo a BD vectorial\n");
        })
    }catch (e) {
        console.log(e);
    }


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
export async function getRelevantInformation(query: string, category: string): Promise<string> {
    const queryEmbed = await generateEmbeddingsQuery(query)
    console.log("Entre al getRelevantInformation\n");
    // con esto calcula la similitud entre la columna de embedding y la queryEmbed
    const similarity = sql<number>`1 - (${cosineDistance(chunk.embedding, queryEmbed)})`;


    const filters: SQL[] = [];
    filters.push(gt(similarity, 0.5));

    let category_enum;

    if(category && category!="OTRO"){
        switch(category){
            case "ESTADISTICAS": category_enum=bibliographyCategoryEnum.enumValues[0];break;
            case "TECNICAS_CONTROL": category_enum=bibliographyCategoryEnum.enumValues[2];break;
            default: category_enum=bibliographyCategoryEnum.enumValues[1];
        }
        filters.push(eq(bibliography.category, category_enum))
    }
    console.log(filters);

    const similarGuides = await db
        .select({ content: chunk.content, similarity })
        .from(chunk)
        .leftJoin(bibliography, eq(chunk.resource_id, bibliography.id))
        .where(
            and(...filters),
        )
        .orderBy((t) => desc(t.similarity))
        .limit(3);

    console.log(similarGuides);
    const result_array = similarGuides.map(item => item.content);
    return result_array.join("\n");
}
