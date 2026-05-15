"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { revokeMobileSessionAction } from "./actions";

export default function RevokeSessionButton({
    sessionId,
    status,
}: {
    sessionId: string;
    status: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [busy, setBusy] = useState(false);

    const active = String(status || "").toLowerCase() === "active";

    function revoke() {
        if (!active) return;

        if (!confirm("Revoke this session?")) return;

        setBusy(true);

        startTransition(async () => {
            try {
                const res = await revokeMobileSessionAction(sessionId);
                alert(res.message || "Session revoked");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to revoke session");
            } finally {
                setBusy(false);
            }
        });
    }

    return (
        <button
            type="button"
            disabled={!active || pending || busy}
            onClick={revoke}
            className={`rounded px-3 py-1.5 text-[12px] font-bold ${active
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
        >
            {busy ? "..." : active ? "Revoke" : "Closed"}
        </button>
    );
}