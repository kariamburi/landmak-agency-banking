"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    approveWithdrawalAction,
    rejectWithdrawalAction,
} from "./actions";

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

export default function WithdrawalApprovalsTable({ approvals }: any) {
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
        <div style={card}>
            <div style={header}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                    Approval Queue
                </h2>
                <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    Pending and processed high-value withdrawal requests.
                </p>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={table}>
                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            {[
                                "Date",
                                "Agent",
                                "Client",
                                "Savings",
                                "Phone",
                                "Amount",
                                "Status",
                                "Actions",
                            ].map((h) => (
                                <th key={h} style={th}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {approvals.map((a: any) => {
                            const busy = isPending && pendingId === Number(a.id);

                            return (
                                <tr key={a.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                                    <td style={td}>{date(a.created_at)}</td>
                                    <td style={td}>
                                        <strong>{a.agent_name || "—"}</strong>
                                        <div style={{ color: "#64748b", fontSize: 13 }}>
                                            {a.agent_code || `Agent #${a.agent_id}`}
                                        </div>
                                    </td>
                                    <td style={td}>#{a.client_id}</td>
                                    <td style={td}>#{a.savings_id}</td>
                                    <td style={td}>{a.phone || "—"}</td>
                                    <td style={{ ...td, fontWeight: 900 }}>{money(a.amount)}</td>
                                    <td style={td}>
                                        <span style={statusBadge(a.status)}>{a.status}</span>
                                    </td>
                                    <td style={td}>
                                        {a.status === "pending" ? (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => approve(Number(a.id))}
                                                    disabled={busy}
                                                    style={approveBtn}
                                                >
                                                    {busy ? "..." : "Approve"}
                                                </button>

                                                <button
                                                    onClick={() => reject(Number(a.id))}
                                                    disabled={busy}
                                                    style={rejectBtn}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: "#94a3b8" }}>Processed</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {!approvals.length && (
                            <tr>
                                <td colSpan={8} style={empty}>
                                    No withdrawal approvals found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const card = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    overflow: "hidden",
    boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
};

const header = {
    padding: 24,
    borderBottom: "1px solid #e2e8f0",
};

const table = {
    width: "100%",
    minWidth: 1050,
    borderCollapse: "collapse" as const,
    fontSize: 14,
};

const th = {
    textAlign: "left" as const,
    padding: 14,
    color: "#475569",
    whiteSpace: "nowrap" as const,
};

const td = {
    padding: 14,
    verticalAlign: "top" as const,
    whiteSpace: "nowrap" as const,
};

const empty = {
    padding: 40,
    textAlign: "center" as const,
    color: "#64748b",
};

const approveBtn = {
    border: "none",
    background: "#166534",
    color: "white",
    padding: "9px 12px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
};

const rejectBtn = {
    border: "none",
    background: "#991b1b",
    color: "white",
    padding: "9px 12px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
};

function statusBadge(status: string) {
    const s = String(status || "").toLowerCase();

    const bg =
        s === "approved" ? "#dcfce7" : s === "rejected" ? "#fee2e2" : "#fef3c7";

    const color =
        s === "approved" ? "#166534" : s === "rejected" ? "#991b1b" : "#92400e";

    return {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 900,
        textTransform: "capitalize" as const,
    };
}