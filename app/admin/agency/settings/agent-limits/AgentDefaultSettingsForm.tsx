"use client";

import { useState, useTransition } from "react";
import { saveAgentDefaultSettingsAction } from "./actions";
import Link from "next/link";

export default function AgentDefaultSettingsForm({ initialSettings }: any) {
    const [form, setForm] = useState({
        dailyDepositLimit: initialSettings?.dailyDepositLimit ?? 500000,
        dailyWithdrawalLimit: initialSettings?.dailyWithdrawalLimit ?? 300000,
        singleTransactionLimit: initialSettings?.singleTransactionLimit ?? 100000,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    function updateField(name: string, value: string) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function saveSettings() {
        setMessage("");
        setError("");

        startTransition(async () => {
            try {
                const res = await saveAgentDefaultSettingsAction(form);
                setMessage(res.message || "Agent limits saved successfully");
            } catch (e: any) {
                setError(e.message || "Failed to save agent limits");
            }
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                Agent Transaction Limits
            </div>

            <p className="mb-5 text-sm text-slate-500">
                These limits will be used when creating agents if custom limits are not
                provided.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
                <Input
                    label="Default Daily Deposit Limit"
                    name="dailyDepositLimit"
                    value={form.dailyDepositLimit}
                    onChange={updateField}
                />

                <Input
                    label="Default Daily Withdrawal Limit"
                    name="dailyWithdrawalLimit"
                    value={form.dailyWithdrawalLimit}
                    onChange={updateField}
                />

                <Input
                    label="Default Single Transaction Limit"
                    name="singleTransactionLimit"
                    value={form.singleTransactionLimit}
                    onChange={updateField}
                />
            </div>

            {message && (
                <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-5 flex justify-end border-t pt-4">
                <button
                    onClick={saveSettings}
                    disabled={pending}
                    className={`h-10 rounded-md px-5 text-sm font-black text-white ${pending
                        ? "cursor-not-allowed bg-slate-400"
                        : "cursor-pointer bg-[#0F3D2E] hover:bg-[#145A43]"
                        }`}
                >
                    {pending ? "Saving..." : "Save Agent Limits"}
                </button>
            </div>
        </div>
    );
}

function Input({ label, name, value, onChange }: any) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>

            <input
                type="number"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            />
        </label>
    );
}