"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
    approveMobileWithdrawalAction,
    rejectMobileWithdrawalAction,
} from "./actions";

function canApprove(status: string) {
    const s = String(status || "").toLowerCase();

    return s === "pending" || s === "pending_approval";
}

type ModalAction = "approve" | "reject" | null;

export default function MobileWithdrawalActions({
    id,
    status,
}: {
    id: number;
    status: string;
}) {
    const router = useRouter();

    const [pending, startTransition] = useTransition();
    const [busy, setBusy] = useState<"" | "approve" | "reject">("");

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<ModalAction>(null);
    const [reason, setReason] = useState("Rejected by mobile banking admin");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const actionable = canApprove(status);

    function openModal(nextAction: ModalAction) {
        if (!actionable) return;

        setAction(nextAction);
        setReason("Rejected by mobile banking admin");
        setError("");
        setSuccess("");
        setOpen(true);
    }

    function closeModal() {
        if (pending) return;

        setOpen(false);
        setAction(null);
        setError("");
        setSuccess("");
    }

    function handleConfirm() {
        if (!action || !actionable) return;

        setError("");
        setSuccess("");

        if (action === "reject" && !reason.trim()) {
            setError("Please enter rejection reason");
            return;
        }

        setBusy(action);

        startTransition(async () => {
            try {
                let res: any;

                if (action === "approve") {
                    res = await approveMobileWithdrawalAction(id);
                }

                if (action === "reject") {
                    res = await rejectMobileWithdrawalAction(id, reason.trim());
                }

                setSuccess(
                    res?.message ||
                    (action === "approve"
                        ? "Withdrawal approved successfully"
                        : "Withdrawal rejected successfully")
                );

                setTimeout(() => {
                    setOpen(false);
                    setAction(null);
                    setSuccess("");
                    router.refresh();
                }, 700);
            } catch (e: any) {
                console.log("MOBILE WITHDRAWAL ACTION ERROR:", e);
                setError(
                    e?.message ||
                    (action === "approve"
                        ? "Failed to approve withdrawal"
                        : "Failed to reject withdrawal")
                );
            } finally {
                setBusy("");
            }
        });
    }

    if (!actionable) {
        return (
            <span className="text-[11px] font-bold text-slate-400">
                Closed
            </span>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => openModal("approve")}
                    className="rounded-md bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#145A43] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {busy === "approve" ? "Processing..." : "Approve"}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => openModal("reject")}
                    className="rounded-md bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {busy === "reject" ? "Rejecting..." : "Reject"}
                </button>
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
                                    {action === "approve"
                                        ? "Approve Mobile Withdrawal"
                                        : "Reject Mobile Withdrawal"}
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    {action === "approve"
                                        ? `Approve withdrawal #${id}?`
                                        : `Reject withdrawal #${id}?`}
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
                                    disabled={pending}
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
                                disabled={pending}
                                onClick={closeModal}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={pending}
                                onClick={handleConfirm}
                                className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${action === "approve"
                                    ? "bg-[#0F3D2E] hover:bg-[#145A43]"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {pending
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