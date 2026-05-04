import IdleLogout from "@/app/components/IdleLogout";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AgencyAdminLayout({ children }: { children: React.ReactNode }) {
    const links = [
        ["Overview", "/admin/agency"],
        ["Agents", "/admin/agency/agents"],
        ["Transactions", "/admin/agency/transactions"],
        ["Reconciliation", "/admin/agency/reconciliation"],
        ["Settlements", "/admin/agency/settlements"],
        ["Commissions", "/admin/agency/commissions"],
        ["Audit Logs", "/admin/agency/audit"],
        ["Settings", "/admin/agency/settings"],

    ];

    const cookieStore = await cookies();
    const rawUser = cookieStore.get("agency_admin_user")?.value;

    let user: any = {};
    try {
        user = rawUser ? JSON.parse(rawUser) : {};
    } catch { }

    const username = user?.username || "Agency Admin";
    const email = user?.email || "";
    const role = user?.roles?.[0] || "AGENCY_ADMIN";
    const initials = String(username).slice(0, 1).toUpperCase();

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "Arial, sans-serif" }}>
            <IdleLogout minutes={15} />

            <aside
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 256,
                    height: "100vh",
                    background: "#0F3D2E",
                    color: "white",
                    padding: 24,
                    boxSizing: "border-box",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Agency Admin</h1>
                <p style={{ marginTop: 10, color: "rgba(255,255,255,.75)" }}>Landmak Finance</p>

                <nav style={{ marginTop: 10, display: "grid", gap: 5 }}>
                    {links.map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                borderRadius: 14,
                                color: "white",
                                textDecoration: "none",
                                fontWeight: 800,
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <p
                    style={{
                        position: "absolute",
                        left: 24,
                        right: 24,
                        bottom: 24,
                        margin: 0,
                        color: "rgba(255,255,255,.65)",
                        fontSize: 13,
                        textAlign: "center",
                    }}
                >
                    Auto logout after 15 minutes idle
                </p>
            </aside>

            <div style={{ marginLeft: 256 }}>
                <header
                    style={{
                        height: 82,
                        background: "rgba(255,255,255,.96)",
                        borderBottom: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 32px",
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                    }}
                >
                    <div>
                        <p style={{ margin: 0, fontSize: 13, color: "#64748B", fontWeight: 800 }}>
                            Status
                        </p>
                        <p style={{ margin: "4px 0 0", color: "#0F172A", fontWeight: 900 }}>
                            🟢 Logged in securely
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, color: "#0F172A", fontWeight: 900 }}>{username}</p>
                            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13, fontWeight: 700 }}>

                                {email ? ` ${email}` : ""}
                            </p>
                        </div>

                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "#0F3D2E",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 900,
                                fontSize: 18,
                            }}
                        >
                            {initials}
                        </div>

                        <form action="/logout" method="GET">
                            <button
                                type="submit"
                                style={{
                                    border: "none",
                                    borderRadius: 14,
                                    padding: "12px 16px",
                                    background: "#FEE2E2",
                                    color: "#991B1B",
                                    fontWeight: 900,
                                    cursor: "pointer",
                                }}
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                <main style={{ padding: 32 }}>{children}</main>
            </div>
        </div>
    );
}