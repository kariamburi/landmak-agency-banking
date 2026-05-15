import { cookies } from "next/headers";
import Link from "next/link";

const modules = [
    {
        title: "Agency Banking",
        description:
            "Manage agents, transactions, withdrawal approvals, fraud alerts, reconciliation, settlements, commissions and audit logs.",
        href: "/admin/agency",
        icon: "🧾",
        tag: "Agents",
    },
    {
        title: "Mobile Banking",
        description:
            "Monitor member app activity, STK deposits, withdrawals, OTP security, mobile users, failed transactions and reports.",
        href: "/admin/mobile",
        icon: "📱",
        tag: "Members",
    },
];

export default async function AdminDashboardPage() {
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
        <main className="min-h-screen bg-[#F8FAFC] font-sans">
            <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0F3D2E] to-[#145A43] px-6 py-4 text-white shadow">
                <div className="flex items-center justify-between gap-4">
                    <div>

                        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#D8C46C]">
                            Landmak Digital Banking
                        </p>
                        <h1 className="mt-1 text-2xl font-black">
                            SACCO Digital Banking Admin
                        </h1>
                        <p className="text-sm text-white/80">
                            Agency Banking • Mobile Banking • M-Pesa • Security
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">
                            <p className="font-black">{username}</p>
                            <p className="text-xs font-bold text-white/75">{email}</p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-black text-[#0F3D2E]">
                            {initials}
                        </div>

                        <form action="/logout" method="GET">
                            <button className="rounded-xl bg-white px-4 py-2 font-black text-[#0F3D2E] hover:bg-[#F8FAFC]">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <section className="p-5 md:p-8">
                <div className="rounded-2xl bg-gradient-to-r from-[#0F3D2E] to-[#145A43] px-6 py-6 text-white shadow">
                    <p className="text-sm font-semibold text-white/80">
                        Digital Banking Platform
                    </p>
                    <h2 className="mt-1 text-3xl font-black">
                        Select Admin Module
                    </h2>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {modules.map((module) => (
                        <Link
                            key={module.href}
                            href={module.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0F3D2E]">
                                        {module.tag}
                                    </p>
                                    <h3 className="mt-3 text-3xl font-black text-slate-950">
                                        {module.title}
                                    </h3>
                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F3D2E]/10 text-2xl">
                                    {module.icon}
                                </div>
                            </div>

                            <p className="mt-5 text-lg leading-8 text-slate-600">
                                {module.description}
                            </p>

                            <div className="mt-8 inline-flex rounded-xl bg-[#0F3D2E] px-6 py-3 font-black text-white group-hover:bg-[#145A43]">
                                Open Module →
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}