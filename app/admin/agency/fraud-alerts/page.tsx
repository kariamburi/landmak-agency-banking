import { adminApiGet } from "@/app/lib/agencyAdminApi";
import Link from "next/link";
import FraudAlertsTable from "./FraudAlertsTable";

const PAGE_SIZE = 10;

export default async function FraudAlertsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        agent?: string;
        severity?: string;
        status?: string;
        type?: string;
        from?: string;
        to?: string;
    }>;
}) {
    const params = await searchParams;

    const currentPage = Math.max(Number(params?.page || 1), 1);

    const agent = String(params?.agent || "").trim().toLowerCase();
    const severity = String(params?.severity || "").trim().toLowerCase();
    const status = String(params?.status || "").trim().toLowerCase();
    const type = String(params?.type || "").trim().toLowerCase();
    const from = String(params?.from || "").trim();
    const to = String(params?.to || "").trim();

    const res = await adminApiGet("/api/admin/agency/fraud-alerts");
    const alerts = res.alerts || [];

    const filteredAlerts = alerts.filter((a: any) => {
        const agentName = String(a.agent_name || "").toLowerCase();
        const agentCode = String(a.agent_code || "").toLowerCase();

        const alertSeverity = String(a.severity || "").toLowerCase();
        const alertStatus = String(a.status || "").toLowerCase();
        const alertType = String(a.alert_type || "").toLowerCase();

        const alertDate = a.created_at ? new Date(a.created_at) : null;

        const fromDate = from ? new Date(`${from}T00:00:00`) : null;
        const toDate = to ? new Date(`${to}T23:59:59`) : null;

        return (
            (!agent ||
                agentName.includes(agent) ||
                agentCode.includes(agent)) &&
            (!severity || alertSeverity === severity) &&
            (!status || alertStatus === status) &&
            (!type || alertType.includes(type)) &&
            (!fromDate || (alertDate && alertDate >= fromDate)) &&
            (!toDate || (alertDate && alertDate <= toDate))
        );
    });

    const total = filteredAlerts.length;

    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

    const safePage = Math.min(currentPage, totalPages);

    const start = (safePage - 1) * PAGE_SIZE;

    const paginatedAlerts = filteredAlerts.slice(start, start + PAGE_SIZE);

    const openCount = filteredAlerts.filter(
        (a: any) => a.status === "open"
    ).length;

    const resolvedCount = filteredAlerts.filter(
        (a: any) => a.status === "resolved"
    ).length;

    const highCount = filteredAlerts.filter(
        (a: any) => a.severity === "high"
    ).length;

    const query = new URLSearchParams();

    if (agent) query.set("agent", agent);
    if (severity) query.set("severity", severity);
    if (status) query.set("status", status);
    if (type) query.set("type", type);
    if (from) query.set("from", from);
    if (to) query.set("to", to);

    const prevQuery = new URLSearchParams(query);

    prevQuery.set("page", String(Math.max(safePage - 1, 1)));

    const nextQuery = new URLSearchParams(query);

    nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Agency Banking
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Fraud Alerts
                </h1>
            </div>

            <form
                action="/admin/agency/fraud-alerts"
                className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Search Fraud Alerts
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_150px_150px_150px_150px_150px_auto]">
                    <input
                        name="agent"
                        defaultValue={params?.agent || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Agent name / code"
                    />

                    <input
                        name="type"
                        defaultValue={params?.type || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Alert type"
                    />

                    <input
                        type="date"
                        name="from"
                        defaultValue={params?.from || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    />

                    <input
                        type="date"
                        name="to"
                        defaultValue={params?.to || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    />

                    <select
                        name="severity"
                        defaultValue={params?.severity || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    >
                        <option value="">All Severity</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <select
                        name="status"
                        defaultValue={params?.status || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <div className="flex min-w-0 gap-2">
                        <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
                            Search
                        </button>

                        <Link
                            href="/admin/agency/fraud-alerts"
                            className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
                    <p className="text-sm font-semibold text-white/70">
                        Open Alerts
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                        {openCount}
                    </h2>
                </div>

                <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
                    <p className="text-sm font-semibold text-white/70">
                        Resolved Alerts
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                        {resolvedCount}
                    </h2>
                </div>

                <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
                    <p className="text-sm font-semibold text-white/70">
                        High Severity
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                        {highCount}
                    </h2>
                </div>
            </div>

            <FraudAlertsTable
                alerts={paginatedAlerts}
                exportAlerts={filteredAlerts}
                total={total}
                safePage={safePage}
                totalPages={totalPages}
                prevHref={`/admin/agency/fraud-alerts?${prevQuery.toString()}`}
                nextHref={`/admin/agency/fraud-alerts?${nextQuery.toString()}`}
            />
        </div>
    );
}