import Link from "next/link";
import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import ExportMobileWithdrawalsButton from "@/app/components/ExportMobileWithdrawalsButton";
import MobileWithdrawalActions from "./MobileWithdrawalActions";

const PAGE_SIZE = 10;

function money(value: any) {
    return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

function statusClass(status: string) {
    const s = String(status || "").toLowerCase();

    if (s.includes("approved") || s.includes("paid")) {
        return "bg-[#0F3D2E]/10 text-[#0F3D2E]";
    }

    if (s.includes("pending")) {
        return "bg-yellow-100 text-yellow-700";
    }

    if (s.includes("failed") || s.includes("rejected")) {
        return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
}

export default async function MobileWithdrawalsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        phone?: string;
        status?: string;
    }>;
}) {
    const params = await searchParams;

    const currentPage = Math.max(Number(params?.page || 1), 1);
    const phone = String(params?.phone || "").trim();
    const status = String(params?.status || "").trim().toLowerCase();

    const res = await mobileAdminGet("/api/admin/mobile/withdrawals");
    const withdrawals = res.withdrawals || [];

    const filteredWithdrawals = withdrawals.filter((w: any) => {
        const wPhone = String(w.phone || "");
        const wStatus = String(w.status || "").toLowerCase();

        return (
            (!phone || wPhone.includes(phone)) &&
            (!status || wStatus.includes(status))
        );
    });

    const total = filteredWithdrawals.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    const paginatedWithdrawals = filteredWithdrawals.slice(
        start,
        start + PAGE_SIZE
    );

    const pendingCount = filteredWithdrawals.filter((w: any) =>
        String(w.status || "").toLowerCase().includes("pending")
    ).length;

    const paidCount = filteredWithdrawals.filter((w: any) =>
        String(w.status || "").toLowerCase().includes("paid")
    ).length;

    const failedCount = filteredWithdrawals.filter((w: any) => {
        const s = String(w.status || "").toLowerCase();
        return s.includes("failed") || s.includes("rejected");
    }).length;

    const query = new URLSearchParams();

    if (phone) query.set("phone", phone);
    if (status) query.set("status", status);

    const prevQuery = new URLSearchParams(query);
    prevQuery.set("page", String(Math.max(safePage - 1, 1)));

    const nextQuery = new URLSearchParams(query);
    nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Mobile Banking
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Withdrawal Requests
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Track mobile withdrawal requests, member details, approval status, and
                    M-Pesa payout results.
                </p>
            </div>

            <form
                action="/admin/mobile/withdrawals"
                className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Search Withdrawals
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[180px_200px_auto]">
                    <input
                        name="phone"
                        defaultValue={params?.phone || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Phone"
                    />

                    <select
                        name="status"
                        defaultValue={params?.status || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="mpesa_pending">M-Pesa Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div className="flex min-w-0 gap-2">
                        <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
                            Search
                        </button>

                        <Link
                            href="/admin/mobile/withdrawals"
                            className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Total Requests" value={total} />
                <SummaryCard label="Pending Approval" value={pendingCount} />
                <SummaryCard label="Paid" value={paidCount} />
                <SummaryCard label="Failed / Rejected" value={failedCount} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <ExportMobileWithdrawalsButton withdrawals={filteredWithdrawals} />

                    <p className="text-sm text-slate-500">
                        Total {total} • Page {safePage} of {totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px] border-collapse text-[12px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Phone
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                                    Amount
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Member
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Account
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Status
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    M-Pesa Result
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Date
                                </th>
                                <th className="px-2 py-2 text-left font-bold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedWithdrawals.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-8 text-center text-slate-500"
                                    >
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedWithdrawals.map((w: any) => (
                                    <tr key={w.id} className="border-b hover:bg-slate-50">
                                        <td className="whitespace-nowrap px-2 py-2 font-semibold text-slate-900">
                                            {w.phone || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-right font-semibold text-slate-700">
                                            {money(w.amount)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {w.member_name || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {w.account_no || w.savings_id || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${statusClass(
                                                    w.status
                                                )}`}
                                            >
                                                {w.status || "-"}
                                            </span>
                                        </td>

                                        <td className="min-w-[220px] px-2 py-2 text-slate-600">
                                            {w.mpesa_result_desc || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {w.created_at
                                                ? new Date(w.created_at).toLocaleString("en-KE")
                                                : "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <MobileWithdrawalActions
                                                id={Number(w.id)}
                                                status={w.status || ""}
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
                        href={`/admin/mobile/withdrawals?${prevQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
                            }`}
                    >
                        Prev
                    </Link>

                    <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
                        {safePage}
                    </span>

                    <Link
                        href={`/admin/mobile/withdrawals?${nextQuery.toString()}`}
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