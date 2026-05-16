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

type ModalAction = "approve" | "reject" | null;

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

    const [isPending, startTransition] = useTransition();

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [action, setAction] = useState<ModalAction>(null);

    const [reason, setReason] = useState("Rejected by admin");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function openModal(id: number, nextAction: ModalAction) {
        setSelectedId(id);
        setAction(nextAction);
        setReason("Rejected by admin");
        setError("");
        setSuccess("");
        setOpen(true);
    }

    function closeModal() {
        if (isPending) return;

        setOpen(false);
        setSelectedId(null);
        setAction(null);
        setError("");
        setSuccess("");
    }

    function handleConfirm() {
        if (!selectedId || !action) return;

        setError("");
        setSuccess("");

        if (action === "reject" && !reason.trim()) {
            setError("Please enter rejection reason");
            return;
        }

        startTransition(async () => {
            try {
                let res: any;

                if (action === "approve") {
                    res = await approveWithdrawalAction(selectedId);
                }

                if (action === "reject") {
                    res = await rejectWithdrawalAction(selectedId, reason.trim());
                }

                setSuccess(
                    res?.message ||
                    (action === "approve"
                        ? "Withdrawal approved successfully"
                        : "Withdrawal rejected successfully")
                );

                setTimeout(() => {
                    setOpen(false);
                    setSelectedId(null);
                    setAction(null);
                    setSuccess("");
                    router.refresh();
                }, 700);
            } catch (e: any) {
                console.log("WITHDRAWAL APPROVAL ERROR:", e);
                setError(
                    e?.message ||
                    (action === "approve"
                        ? "Approval failed"
                        : "Rejection failed")
                );
            }
        });
    }

    const modalTitle =
        action === "approve"
            ? "Approve Withdrawal"
            : "Reject Withdrawal";

    return (
        <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <ExportWithdrawalApprovalsButton
                        approvals={exportApprovals || approvals}
                    />

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
                                    <td
                                        colSpan={8}
                                        className="px-5 py-8 text-center text-slate-500"
                                    >
                                        No withdrawal approvals found.
                                    </td>
                                </tr>
                            ) : (
                                approvals.map((a: any) => {
                                    const busy =
                                        isPending && selectedId === Number(a.id);

                                    const status = String(
                                        a.status || ""
                                    ).toLowerCase();

                                    return (
                                        <tr
                                            key={a.id}
                                            className="border-b hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                                {date(a.created_at)}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                <div className="font-semibold">
                                                    {a.agent_name || "—"}
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    {a.agent_code ||
                                                        `Agent #${a.agent_id}`}
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
                                                            onClick={() =>
                                                                openModal(
                                                                    Number(a.id),
                                                                    "approve"
                                                                )
                                                            }
                                                            disabled={busy}
                                                            className="rounded bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#145A43] disabled:opacity-50"
                                                        >
                                                            {busy && action === "approve"
                                                                ? "..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                openModal(
                                                                    Number(a.id),
                                                                    "reject"
                                                                )
                                                            }
                                                            disabled={busy}
                                                            className="rounded bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
                                                        >
                                                            {busy && action === "reject"
                                                                ? "..."
                                                                : "Reject"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        Processed
                                                    </span>
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
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages
                            ? "pointer-events-none opacity-40"
                            : ""
                            }`}
                    >
                        Next
                    </Link>
                </div>
            </div>

            {open && action && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${action === "approve"
                                    ? "bg-[#0F3D2E]/10"
                                    : "bg-red-100"
                                    }`}
                            >
                                {action === "approve" ? "✅" : "⚠️"}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-900">
                                    {modalTitle}
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    {action === "approve"
                                        ? "This withdrawal will be approved and processed."
                                        : "This withdrawal request will be rejected."}
                                </p>

                                <p
                                    className={`mt-2 text-sm font-semibold ${action === "approve"
                                        ? "text-[#0F3D2E]"
                                        : "text-red-600"
                                        }`}
                                >
                                    {action === "approve"
                                        ? "Confirm only after reviewing the withdrawal details."
                                        : "Please provide a clear reason for rejection."}
                                </p>
                            </div>
                        </div>

                        {action === "reject" ? (
                            <div className="mt-4">
                                <label className="mb-1 block text-sm font-bold text-slate-700">
                                    Rejection Reason
                                </label>

                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    disabled={isPending}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/20"
                                />
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        {success ? (
                            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        ) : null}

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={closeModal}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleConfirm}
                                className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${action === "approve"
                                    ? "bg-[#0F3D2E] hover:bg-[#145A43]"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {isPending
                                    ? action === "approve"
                                        ? "Approving..."
                                        : "Rejecting..."
                                    : action === "approve"
                                        ? "Yes, Approve"
                                        : "Yes, Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}