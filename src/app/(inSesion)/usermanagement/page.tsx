import {Metadata} from "next";
import {auth} from "@/auth";
import {UserManagement} from "@/components/usermanagement/UserListView";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: 'Gestión de usuarios - NoVa+',
    description: 'Panel de gestión de usuarios, donde se pueden crear, modificar o eliminar. Acceso unicamente para administrador.',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function userManagementPage() {
    const session = await auth()
    const userRole = session?.user?.role
    const isAdmin = userRole === "ADMINISTRADOR"

    if (!isAdmin) {
        redirect("/dashboard");
    }

    return <UserManagement userEmail={session?.user?.email}/>
}