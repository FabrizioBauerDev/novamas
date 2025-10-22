import {db} from "@/db";
import {users} from "@/db/schema";
import {eq} from "drizzle-orm";
import {UserData} from "@/types/types";

export async function updateUser(id: string, name: string, image: string|undefined): Promise<UserData | null> {
    try{
        const user = await db
            .update(users)
            .set({
                name,
                image: image || null,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                status: users.status,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
                image: users.image,
            });
        if(user.length === 0)
            return null;

        return user[0];
    }catch (error) {
        console.error("Error updating user:", error)
        throw new Error("Failed to update user")
    }
}
