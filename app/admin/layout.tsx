import { cookies } from "next/headers";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const rawUser = cookieStore.get("agency_admin_user")?.value;

    let user: any = {};
    try {
        user = rawUser ? JSON.parse(rawUser) : {};
    } catch { }

    const username = user?.username || "Agency Admin";
    const email = user?.email || "";
    const initials = String(username).slice(0, 1).toUpperCase();

    return (
        <AdminShell username={username} email={email} initials={initials}>
            {children}
        </AdminShell>
    );
}