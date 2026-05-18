import { cookies } from "next/headers";
import { adminApiGet } from "@/app/lib/agencyAdminApi";
import AdminShell from "./AdminShell";
import AdminIdleLogout from "./AdminIdleLogout";

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

    let timeoutMinutes = 15;

    try {
        const res = await adminApiGet("/api/admin/settings/global");
        timeoutMinutes = Number(
            res?.settings?.globalAdminSessionTimeoutMinutes || 15
        );
    } catch { }

    const username = user?.username || "Agency Admin";
    const email = user?.email || "";
    const initials = String(username).slice(0, 1).toUpperCase();

    return (
        <AdminShell username={username} email={email} initials={initials}>
            <AdminIdleLogout timeoutMinutes={timeoutMinutes} />
            {children}
        </AdminShell>
    );
}