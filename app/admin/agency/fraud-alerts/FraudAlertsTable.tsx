"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resolveFraudAlertAction } from "./actions";

function formatDate(v: any) {
    if (!v) return "—";
    return new Date(v).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function FraudAlertsTable({ alerts }: any) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    function resolve(id: number) {
        if (!confirm("Mark this fraud alert as resolved?")) return;

        setPendingId(id);

        startTransition(async () => {
            try {
                const res = await resolveFraudAlertAction(id);
                alert(res.message || "Fraud alert resolved");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to resolve alert");
            } finally {
                setPendingId(null);
            }
        });
    }

    return (
        <div style={card}>
            <div style={header}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                    Alert Queue
                </h2>
                <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    Open and resolved fraud alerts from agency transactions.
                </p>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={table}>
                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            {["Date", "Severity", "Type", "Agent", "Message", "Status", "Action"].map(
                                (h) => (
                                    <th key={h} style={th}>
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {alerts.map((a: any) => {
                            const busy = isPending && pendingId === Number(a.id);

                            return (
                                <tr key={a.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                                    <td style={td}>{formatDate(a.created_at)}</td>

                                    <td style={td}>
                                        <span style={severityBadge(a.severity)}>{a.severity}</span>
                                    </td>

                                    <td style={td}>
                                        <strong>
                                            {String(a.alert_type || "—").replaceAll("_", " ")}
                                        </strong>
                                    </td>

                                    <td style={td}>
                                        <strong>{a.agent_name || "—"}</strong>
                                        <div style={{ color: "#64748b", fontSize: 13 }}>
                                            {a.agent_code || (a.agent_id ? `Agent #${a.agent_id}` : "—")}
                                        </div>
                                    </td>

                                    <td style={{ ...td, whiteSpace: "normal", minWidth: 260 }}>
                                        {a.message || "—"}
                                    </td>

                                    <td style={td}>
                                        <span style={statusBadge(a.status)}>{a.status}</span>
                                    </td>

                                    <td style={td}>
                                        {a.status === "open" ? (
                                            <button
                                                onClick={() => resolve(Number(a.id))}
                                                disabled={busy}
                                                style={resolveBtn}
                                            >
                                                {busy ? "..." : "Resolve"}
                                            </button>
                                        ) : (
                                            <span style={{ color: "#94a3b8" }}>Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {!alerts.length && (
                            <tr>
                                <td colSpan={7} style={empty}>
                                    No fraud alerts found.
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

const resolveBtn = {
    border: "none",
    background: "#0f172a",
    color: "white",
    padding: "9px 12px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
};

function severityBadge(severity: string) {
    const s = String(severity || "").toLowerCase();

    return {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        background: s === "high" ? "#fee2e2" : s === "low" ? "#dcfce7" : "#fef3c7",
        color: s === "high" ? "#991b1b" : s === "low" ? "#166534" : "#92400e",
        fontWeight: 900,
        textTransform: "capitalize" as const,
    };
}

function statusBadge(status: string) {
    const s = String(status || "").toLowerCase();

    return {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        background: s === "resolved" ? "#dcfce7" : "#fef3c7",
        color: s === "resolved" ? "#166534" : "#92400e",
        fontWeight: 900,
        textTransform: "capitalize" as const,
    };
}