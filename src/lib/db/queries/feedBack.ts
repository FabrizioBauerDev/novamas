import {db} from "@/db";
import {eq} from "drizzle-orm";
import {FeedBack} from "@/types/types";
import {chatFeedbacks} from "@/db/schema";

export async function getFeedBackByChatId(id: string): Promise<FeedBack|null> {
    try {
        const formResult = await db
            .select()
            .from(chatFeedbacks)
            .where(eq(chatFeedbacks.chatSessionId, id))
            .limit(1)

        const feedBack = formResult[0]
        if (!feedBack) {
            return null
        }

        return feedBack;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}

export async function getAllFeedBack(): Promise<FeedBack[]|null> {
    try {
        const formResult = await db
            .select()
            .from(chatFeedbacks)

        if (!formResult) {
            return null
        }

        return formResult;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}