"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    approveWithdrawalAction,
    rejectWithdrawalAction,
} from "./actions";
import ExportWithdrawalApprovalsButton from "@/app/components/ExportWithdrawalApprovalsButton";

function money(v: any) {
    return `KES ${Number(v || 0).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function date(v: any) {
    if (!v) return "—";

    return new Date(v).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function WithdrawalApprovalsTable({
    approvals,
    exportApprovals,
    total,
    safePage,
    totalPages,
    prevHref,
    nextHref,
}: any) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    function approve(id: number) {
        if (!confirm("Approve and process this withdrawal?")) return;

        setPendingId(id);

        startTransition(async () => {
            try {
                const res = await approveWithdrawalAction(id);
                alert(res.message || "Withdrawal approved");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Approval failed");
            } finally {
                setPendingId(null);
            }
        });
    }

    function reject(id: number) {
        const reason = prompt("Reason for rejection:", "Rejected by admin");
        if (reason === null) return;

        setPendingId(id);

        startTransition(async () => {
            try {
                const res = await rejectWithdrawalAction(id, reason);
                alert(res.message || "Withdrawal rejected");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Rejection failed");
            } finally {
                setPendingId(null);
            }
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
                <ExportWithdrawalApprovalsButton approvals={exportApprovals || approvals} />

                <p className="text-sm text-slate-500">
                    Total {total} • Page {safePage} of {totalPages}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-[12px]">
                    <thead>
                        <tr className="bg-slate-100 text-slate-900">
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Date
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Agent
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Client
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Savings
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Phone
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                                Amount
                            </th>
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Status
                            </th>
                            <th className="px-2 py-2 text-left font-bold">
                                Operation
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {approvals.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                                    No withdrawal approvals found.
                                </td>
                            </tr>
                        ) : (
                            approvals.map((a: any) => {
                                const busy = isPending && pendingId === Number(a.id);
                                const status = String(a.status || "").toLowerCase();

                                return (
                                    <tr key={a.id} className="border-b hover:bg-slate-50">
                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {date(a.created_at)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <div className="font-semibold">{a.agent_name || "—"}</div>
                                            <div className="text-[11px] text-slate-500">
                                                {a.agent_code || `Agent #${a.agent_id}`}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            #{a.client_id}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            #{a.savings_id}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {a.phone || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                                            {money(a.amount)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${status === "approved"
                                                    ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                                                    : status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {a.status || "pending"}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {status === "pending" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => approve(Number(a.id))}
                                                        disabled={busy}
                                                        className="rounded bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#145A43] disabled:opacity-50"
                                                    >
                                                        {busy ? "..." : "Approve"}
                                                    </button>

                                                    <button
                                                        onClick={() => reject(Number(a.id))}
                                                        disabled={busy}
                                                        className="rounded bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
                <span className="text-slate-600">Total {total}</span>

                <Link
                    href={prevHref}
                    className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
                        }`}
                >
                    Prev
                </Link>

                <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
                    {safePage}
                </span>

                <Link
                    href={nextHref}
                    className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages ? "pointer-events-none opacity-40" : ""
                        }`}
                >
                    Next
                </Link>
            </div>
        </div>
    );
}