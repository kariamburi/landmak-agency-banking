import Link from "next/link";
import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import RevokeSessionButton from "./RevokeSessionButton";

const PAGE_SIZE = 10;

function formatDate(v: any) {
    if (!v) return "—";

    return new Date(v).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function statusClass(status: string) {
    const s = String(status || "").toLowerCase();

    if (s === "active") return "bg-[#0F3D2E]/10 text-[#0F3D2E]";
    if (s === "revoked") return "bg-red-100 text-red-700";
    if (s === "expired") return "bg-slate-100 text-slate-700";

    return "bg-yellow-100 text-yellow-700";
}

export default async function MobileSessionsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        phone?: string;
        member?: string;
        status?: string;
    }>;
}) {
    const params = await searchParams;

    const currentPage = Math.max(Number(params?.page || 1), 1);
    const phone = String(params?.phone || "").trim();
    const member = String(params?.member || "").trim().toLowerCase();
    const status = String(params?.status || "").trim().toLowerCase();

    const res = await mobileAdminGet("/api/admin/mobile/sessions");
    const sessions = res.sessions || [];

    const filteredSessions = sessions.filter((s: any) => {
        const sPhone = String(s.phone || "");
        const sMember = String(s.member_name || "").toLowerCase();
        const sStatus = String(s.status || "").toLowerCase();

        return (
            (!phone || sPhone.includes(phone)) &&
            (!member || sMember.includes(member)) &&
            (!status || sStatus === status)
        );
    });

    const total = filteredSessions.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const paginatedSessions = filteredSessions.slice(start, start + PAGE_SIZE);

    const active = filteredSessions.filter((s: any) => s.status === "active").length;
    const revoked = filteredSessions.filter((s: any) => s.status === "revoked").length;
    const expired = filteredSessions.filter((s: any) => s.status === "expired").length;

    const query = new URLSearchParams();
    if (phone) query.set("phone", phone);
    if (member) query.set("member", member);
    if (status) query.set("status", status);

    const prevQuery = new URLSearchParams(query);
    prevQuery.set("page", String(Math.max(safePage - 1, 1)));

    const nextQuery = new URLSearchParams(query);
    nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">Mobile Banking</p>

                <h1 className="mt-1 text-3xl text-slate-900">Mobile Sessions</h1>

                <p className="mt-2 text-sm text-slate-500">
                    Monitor active mobile sessions, expiry, device access, and revoke sessions.
                </p>
            </div>

            <form
                action="/admin/mobile/sessions"
                className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Search Sessions
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[180px_minmax(0,1fr)_150px_auto]">
                    <input
                        name="phone"
                        defaultValue={params?.phone || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Phone"
                    />

                    <input
                        name="member"
                        defaultValue={params?.member || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Member name"
                    />

                    <select
                        name="status"
                        defaultValue={params?.status || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="revoked">Revoked</option>
                        <option value="expired">Expired</option>
                    </select>

                    <div className="flex min-w-0 gap-2">
                        <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
                            Search
                        </button>

                        <Link
                            href="/admin/mobile/sessions"
                            className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Total Sessions" value={total} />
                <SummaryCard label="Active" value={active} />
                <SummaryCard label="Revoked" value={revoked} />
                <SummaryCard label="Expired" value={expired} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <button className="cursor-pointer text-sm font-semibold text-[#008A3D]">
                        Export ⌄
                    </button>

                    <p className="text-sm text-slate-500">
                        Total {total} • Page {safePage} of {totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px] border-collapse text-[12px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Member</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Phone</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Device</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">IP</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Created</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Last Seen</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Expires</th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">Status</th>
                                <th className="px-2 py-2 text-left font-bold">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedSessions.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                                        No mobile sessions found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSessions.map((s: any) => (
                                    <tr key={s.id} className="border-b hover:bg-slate-50">
                                        <td className="whitespace-nowrap px-2 py-2 font-semibold">
                                            {s.member_name || `Client #${s.client_id || "—"}`}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {s.phone || "—"}
                                        </td>

                                        <td className="px-2 py-2">
                                            <div className="font-semibold">
                                                {s.device_model || "Unknown Device"}
                                            </div>
                                            <div className="max-w-[220px] truncate text-[11px] text-slate-500">
                                                {s.device_id || "—"}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {s.ip_address || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {formatDate(s.created_at)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {formatDate(s.last_seen_at)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {formatDate(s.expires_at)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${statusClass(
                                                    s.status
                                                )}`}
                                            >
                                                {s.status || "active"}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <RevokeSessionButton
                                                sessionId={s.session_id}
                                                status={s.status || "active"}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
                    <span className="text-slate-600">Total {total}</span>

                    <Link
                        href={`/admin/mobile/sessions?${prevQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
                            }`}
                    >
                        Prev
                    </Link>

                    <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
                        {safePage}
                    </span>

                    <Link
                        href={`/admin/mobile/sessions?${nextQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages ? "pointer-events-none opacity-40" : ""
                            }`}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ label, value }: any) {
    return (
        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
            <p className="text-sm font-semibold text-white/70">{label}</p>
            <h2 className="mt-2 text-xl font-black">{value}</h2>
        </div>
    );
}