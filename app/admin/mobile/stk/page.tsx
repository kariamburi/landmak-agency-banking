import Link from "next/link";
import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import ExportMobileStkButton from "@/app/components/ExportMobileStkButton";

const PAGE_SIZE = 10;

function money(value: any) {
    return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

function statusClass(status: string) {
    const s = String(status || "").toLowerCase();

    if (
        s.includes("success") ||
        s.includes("posted") ||
        s.includes("completed")
    ) {
        return "bg-[#0F3D2E]/10 text-[#0F3D2E]";
    }

    if (s.includes("pending")) {
        return "bg-yellow-100 text-yellow-700";
    }

    if (s.includes("fail") || s.includes("cancel")) {
        return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
}

export default async function MobileStkPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        phone?: string;
        status?: string;
        type?: string;
        accountRef?: string;
    }>;
}) {
    const params = await searchParams;

    const currentPage = Math.max(Number(params?.page || 1), 1);
    const phone = String(params?.phone || "").trim();
    const status = String(params?.status || "").trim().toLowerCase();
    const type = String(params?.type || "").trim().toLowerCase();
    const accountRef = String(params?.accountRef || "")
        .trim()
        .toLowerCase();

    const res = await mobileAdminGet(
        "/api/admin/mobile/stk-transactions"
    );

    const transactions = res.transactions || [];

    const filteredTransactions = transactions.filter((tx: any) => {
        const txPhone = String(tx.phone || "");
        const txStatus = String(tx.status || "").toLowerCase();
        const txType = String(tx.fineract_type || "").toLowerCase();
        const txAccountRef = String(tx.account_ref || "").toLowerCase();

        return (
            (!phone || txPhone.includes(phone)) &&
            (!status || txStatus.includes(status)) &&
            (!type || txType.includes(type)) &&
            (!accountRef || txAccountRef.includes(accountRef))
        );
    });

    const total = filteredTransactions.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    const paginatedTransactions = filteredTransactions.slice(
        start,
        start + PAGE_SIZE
    );

    const query = new URLSearchParams();

    if (phone) query.set("phone", phone);
    if (status) query.set("status", status);
    if (type) query.set("type", type);
    if (accountRef) query.set("accountRef", accountRef);

    const prevQuery = new URLSearchParams(query);

    prevQuery.set(
        "page",
        String(Math.max(safePage - 1, 1))
    );

    const nextQuery = new URLSearchParams(query);

    nextQuery.set(
        "page",
        String(Math.min(safePage + 1, totalPages))
    );

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Mobile Banking
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    STK Deposits
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Monitor M-Pesa STK requests, account references,
                    transaction status, and posting results.
                </p>
            </div>

            <form
                action="/admin/mobile/stk"
                className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Search STK Transactions
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[160px_160px_160px_minmax(0,1fr)_auto]">
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
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESS">Success</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="POSTED">Posted</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        name="type"
                        defaultValue={params?.type || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                    >
                        <option value="">All Types</option>
                        <option value="savings">Savings</option>
                        <option value="loan">Loan</option>
                    </select>

                    <input
                        name="accountRef"
                        defaultValue={params?.accountRef || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Account Ref"
                    />

                    <div className="flex min-w-0 gap-2">
                        <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
                            Search
                        </button>

                        <Link
                            href="/admin/mobile/stk"
                            className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <ExportMobileStkButton transactions={filteredTransactions} />

                    <p className="text-sm text-slate-500">
                        Total {total} • Page {safePage} of {totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse text-[12px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Phone
                                </th>

                                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                                    Amount
                                </th>

                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Account Ref
                                </th>

                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Type
                                </th>

                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Status
                                </th>

                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Result
                                </th>

                                <th className="px-2 py-2 text-left font-bold">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedTransactions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-8 text-center text-slate-500"
                                    >
                                        No STK transactions found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedTransactions.map((tx: any) => (
                                    <tr
                                        key={tx.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-2 py-2 font-semibold">
                                            {tx.phone}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                                            {money(tx.amount)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {tx.account_ref || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {tx.fineract_type || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${statusClass(
                                                    tx.status
                                                )}`}
                                            >
                                                {tx.status || "-"}
                                            </span>
                                        </td>

                                        <td className="min-w-[220px] px-2 py-2 text-slate-600">
                                            {tx.result_desc || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {tx.created_at
                                                ? new Date(tx.created_at).toLocaleString(
                                                    "en-KE"
                                                )
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
                    <span className="text-slate-600">
                        Total {total}
                    </span>

                    <Link
                        href={`/admin/mobile/stk?${prevQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1
                            ? "pointer-events-none opacity-40"
                            : ""
                            }`}
                    >
                        Prev
                    </Link>

                    <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
                        {safePage}
                    </span>

                    <Link
                        href={`/admin/mobile/stk?${nextQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages
                            ? "pointer-events-none opacity-40"
                            : ""
                            }`}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}