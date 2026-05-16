"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { revokeAgentSessionAction } from "./actions";

export default function RevokeSessionButton({
    sessionId,
    status,
}: {
    sessionId: string;
    status: string;
}) {
    const router = useRouter();

    const [pending, startTransition] = useTransition();

    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const active =
        String(status || "").toLowerCase() === "active";

    async function handleRevoke() {
        setError("");

        startTransition(async () => {
            try {
                const res = await revokeAgentSessionAction(sessionId);

                if (!res?.ok) {
                    throw new Error(
                        res?.error || "Failed to revoke session"
                    );
                }

                setOpen(false);

                router.refresh();
            } catch (e: any) {
                console.log("REVOKE ERROR:", e);

                setError(
                    e?.message || "Failed to revoke session"
                );
            }
        });
    }

    return (
        <>
            <button
                type="button"
                disabled={!active || pending}
                onClick={() => setOpen(true)}
                className={`rounded px-3 py-1.5 text-[12px] font-bold transition ${active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                    }`}
            >
                {pending
                    ? "Please wait..."
                    : active
                        ? "Revoke"
                        : "Closed"}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                                ⚠️
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-900">
                                    Revoke Agent Session
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    This device session will be immediately logged out
                                    from the Agency Mobile App.
                                </p>

                                <p className="mt-2 text-sm font-semibold text-red-600">
                                    The agent will need to login again using OTP.
                                </p>
                            </div>
                        </div>

                        {error ? (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={pending}
                                onClick={() => setOpen(false)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={pending}
                                onClick={handleRevoke}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {pending
                                    ? "Revoking..."
                                    : "Yes, Revoke"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}