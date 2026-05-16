import { cookies } from "next/headers";
import Link from "next/link";

const channels = [
    {
        title: "Agency Banking",
        description:
            "Manage agents, transactions, withdrawal approvals, fraud alerts, reconciliation, settlements, commissions and audit logs.",
        href: "/admin/agency",
        icon: "🧾",
        tag: "Agents",
        status: "Active",
    },
    {
        title: "Mobile Banking",
        description:
            "Monitor member app activity, STK deposits, withdrawals, OTP security, mobile users, failed transactions and reports.",
        href: "/admin/mobile",
        icon: "📱",
        tag: "Members",
        status: "Active",
    },
    // Future channels
    // {
    //   title: "USSD Banking",
    //   description: "Manage USSD menus, sessions, PINs, balances, mini statements, and mobile transactions.",
    //   href: "/admin/ussd",
    //   icon: "☎️",
    //   tag: "USSD",
    //   status: "Coming Soon",
    // },
    // {
    //   title: "Field Officer",
    //   description: "Manage field collections, officer devices, offline sync, routes, and daily reports.",
    //   href: "/admin/field-officer",
    //   icon: "🧑‍💼",
    //   tag: "Field",
    //   status: "Coming Soon",
    // },
    // {
    //   title: "ATM Channel",
    //   description: "Monitor ATM transactions, limits, reconciliation, disputes, and uptime.",
    //   href: "/admin/atm",
    //   icon: "🏧",
    //   tag: "ATM",
    //   status: "Coming Soon",
    // },
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
        <main className="min-h-screen bg-[#F4F7F6] font-sans">


            <section className="p-5 md:p-8">
                <div className="rounded-3xl bg-gradient-to-r from-[#073D2D] to-[#145A43] px-6 py-7 text-white shadow">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white/75">
                                Digital Banking Platform
                            </p>
                            <h2 className="mt-1 text-3xl font-black">
                                Select Admin Channel
                            </h2>
                            <p className="mt-2 text-sm text-white/75">
                                Choose a channel to manage its operations, users, settings, reports and transactions.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white">
                            Active Channels: {channels.length}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                    {channels.map((channel) => (
                        <Link
                            key={channel.href}
                            href={channel.href}
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0F3D2E] hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0F3D2E]">
                                        {channel.tag}
                                    </p>
                                    <h3 className="mt-3 text-3xl font-black text-slate-950">
                                        {channel.title}
                                    </h3>
                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F3D2E]/10 text-2xl">
                                    {channel.icon}
                                </div>
                            </div>

                            <p className="mt-5 text-base leading-7 text-slate-600">
                                {channel.description}
                            </p>

                            <div className="mt-6 flex items-center justify-between">
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                                    {channel.status}
                                </span>

                                <span className="rounded-xl bg-[#0F3D2E] px-5 py-3 text-sm font-black text-white group-hover:bg-[#145A43]">
                                    Open Channel →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}