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

export default function MobileWithdrawalActions({
    id,
    status,
}: {
    id: number;
    status: string;
}) {
    const router = useRouter();

    const [pending, startTransition] = useTransition();

    const [busy, setBusy] = useState<
        "" | "approve" | "reject"
    >("");

    const actionable = canApprove(status);

    async function handleApprove() {
        if (!actionable) return;

        const confirmed = confirm(
            `Approve withdrawal #${id}?`
        );

        if (!confirmed) return;

        setBusy("approve");

        startTransition(async () => {
            try {
                const res = await approveMobileWithdrawalAction(id);

                alert(
                    res?.message ||
                    "Withdrawal approved successfully"
                );

                router.refresh();
            } catch (e: any) {
                alert(
                    e?.message ||
                    "Failed to approve withdrawal"
                );
            } finally {
                setBusy("");
            }
        });
    }

    async function handleReject() {
        if (!actionable) return;

        const reason = prompt(
            "Reason for rejection:",
            "Rejected by mobile banking admin"
        );

        if (reason === null) return;

        setBusy("reject");

        startTransition(async () => {
            try {
                const res = await rejectMobileWithdrawalAction(
                    id,
                    reason
                );

                alert(
                    res?.message ||
                    "Withdrawal rejected successfully"
                );

                router.refresh();
            } catch (e: any) {
                alert(
                    e?.message ||
                    "Failed to reject withdrawal"
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
        <div className="flex items-center gap-2">
            <button
                type="button"
                disabled={pending}
                onClick={handleApprove}
                className="rounded-md bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#145A43] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {busy === "approve"
                    ? "Processing..."
                    : "Approve"}
            </button>

            <button
                type="button"
                disabled={pending}
                onClick={handleReject}
                className="rounded-md bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {busy === "reject"
                    ? "Rejecting..."
                    : "Reject"}
            </button>
        </div>
    );
}