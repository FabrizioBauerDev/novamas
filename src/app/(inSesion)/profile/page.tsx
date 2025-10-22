import UserProfile from "@/components/profile/userProfile"
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function ProfilePage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }
    return <UserProfile id={session.user.id}/>
}