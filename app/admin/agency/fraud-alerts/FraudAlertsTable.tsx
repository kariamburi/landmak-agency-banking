"use client";

import ExportFraudAlertsButton from "@/app/components/ExportFraudAlertsButton";
import Link from "next/link";
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

export default function FraudAlertsTable({
    alerts,
    exportAlerts,
    total,
    safePage,
    totalPages,
    prevHref,
    nextHref,
}: any) {
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
                <ExportFraudAlertsButton alerts={exportAlerts || alerts} />

                <p className="text-sm text-slate-500">
                    Total {total} • Page {safePage} of {totalPages}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-[12px]">
                    <thead>
                        <tr className="bg-slate-100 text-slate-900">
                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Date
                            </th>

                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Severity
                            </th>

                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Type
                            </th>

                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Agent
                            </th>

                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Message
                            </th>

                            <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                Status
                            </th>

                            <th className="px-2 py-2 text-left font-bold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {alerts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-8 text-center text-slate-500"
                                >
                                    No fraud alerts found.
                                </td>
                            </tr>
                        ) : (
                            alerts.map((a: any) => {
                                const busy =
                                    isPending && pendingId === Number(a.id);

                                const severity = String(
                                    a.severity || ""
                                ).toLowerCase();

                                const status = String(
                                    a.status || ""
                                ).toLowerCase();

                                return (
                                    <tr
                                        key={a.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                                            {formatDate(a.created_at)}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${severity === "high"
                                                    ? "bg-red-100 text-red-700"
                                                    : severity === "low"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {a.severity}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2 font-semibold capitalize">
                                            {String(
                                                a.alert_type || "—"
                                            ).replaceAll("_", " ")}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <div className="font-semibold">
                                                {a.agent_name || "—"}
                                            </div>

                                            <div className="text-[11px] text-slate-500">
                                                {a.agent_code ||
                                                    (a.agent_id
                                                        ? `Agent #${a.agent_id}`
                                                        : "—")}
                                            </div>
                                        </td>

                                        <td className="min-w-[260px] px-2 py-2 text-slate-700">
                                            {a.message || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            <span
                                                className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${status === "resolved"
                                                    ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {a.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-2 py-2">
                                            {status === "open" ? (
                                                <button
                                                    onClick={() => resolve(Number(a.id))}
                                                    disabled={busy}
                                                    className="rounded bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#145A43] disabled:opacity-50"
                                                >
                                                    {busy ? "..." : "Resolve"}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400">
                                                    Resolved
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
                <span className="text-slate-600">
                    Total {total}
                </span>

                <Link
                    href={prevHref}
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
    );
}