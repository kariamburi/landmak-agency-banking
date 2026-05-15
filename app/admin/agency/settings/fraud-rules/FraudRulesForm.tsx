"use client";

import { useState, useTransition } from "react";
import { saveFraudRulesAction } from "./actions";

export default function FraudRulesForm({ initialSettings }: any) {
    const [form, setForm] = useState({
        maxWithdrawalsPerAgentPerHour:
            initialSettings?.maxWithdrawalsPerAgentPerHour ?? 10,

        maxWithdrawalsPerMemberPerHour:
            initialSettings?.maxWithdrawalsPerMemberPerHour ?? 3,

        maxFailedOtpAttemptsPerDay:
            initialSettings?.maxFailedOtpAttemptsPerDay ?? 10,

        flagRepeatedSameAmountWithdrawals:
            initialSettings?.flagRepeatedSameAmountWithdrawals ?? true,

        flagTransactionsNearDailyLimit:
            initialSettings?.flagTransactionsNearDailyLimit ?? true,

        flagDeviceResetHighTransaction:
            initialSettings?.flagDeviceResetHighTransaction ?? true,

        requireAdminApprovalAboveAmount:
            initialSettings?.requireAdminApprovalAboveAmount ?? 100000,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    function updateField(name: string, value: any) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function saveSettings() {
        setMessage("");
        setError("");

        startTransition(async () => {
            try {
                const res = await saveFraudRulesAction(form);
                setMessage(res.message || "Fraud rules saved successfully");
            } catch (e: any) {
                setError(e.message || "Failed to save fraud rules");
            }
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                Fraud Detection Rules
            </div>

            <p className="mb-5 text-sm text-slate-500">
                Control withdrawal velocity, suspicious patterns, and approval
                thresholds for agency transactions.
            </p>

            <SectionTitle title="Velocity Limits" />

            <div className="grid gap-4 md:grid-cols-3">
                <Input
                    label="Max Withdrawals Per Agent Per Hour"
                    name="maxWithdrawalsPerAgentPerHour"
                    value={form.maxWithdrawalsPerAgentPerHour}
                    onChange={updateField}
                />

                <Input
                    label="Max Withdrawals Per Member Per Hour"
                    name="maxWithdrawalsPerMemberPerHour"
                    value={form.maxWithdrawalsPerMemberPerHour}
                    onChange={updateField}
                />

                <Input
                    label="Max Failed OTP Attempts Per Day"
                    name="maxFailedOtpAttemptsPerDay"
                    value={form.maxFailedOtpAttemptsPerDay}
                    onChange={updateField}
                />
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="Suspicious Pattern Flags" />

                <div className="grid gap-4 md:grid-cols-3">
                    <Toggle
                        label="Flag Repeated Same Amount Withdrawals"
                        value={form.flagRepeatedSameAmountWithdrawals}
                        onChange={(v: boolean) =>
                            updateField("flagRepeatedSameAmountWithdrawals", v)
                        }
                    />

                    <Toggle
                        label="Flag Transactions Near Daily Limit"
                        value={form.flagTransactionsNearDailyLimit}
                        onChange={(v: boolean) =>
                            updateField("flagTransactionsNearDailyLimit", v)
                        }
                    />

                    <Toggle
                        label="Flag Device Reset Followed By High Transaction"
                        value={form.flagDeviceResetHighTransaction}
                        onChange={(v: boolean) =>
                            updateField("flagDeviceResetHighTransaction", v)
                        }
                    />
                </div>
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="Approval Control" />

                <div className="grid gap-4 md:grid-cols-3">
                    <Input
                        label="Require Admin Approval Above Amount"
                        name="requireAdminApprovalAboveAmount"
                        value={form.requireAdminApprovalAboveAmount}
                        onChange={updateField}
                    />
                </div>
            </div>

            {message && (
                <div className="mt-5 rounded-md bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
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
                    {pending ? "Saving..." : "Save Fraud Rules"}
                </button>
            </div>
        </div>
    );
}

function SectionTitle({ title }: any) {
    return (
        <h3 className="mb-4 text-lg font-black text-slate-900">
            {title}
        </h3>
    );
}

function Input({ label, name, value, onChange }: any) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">
                {label}
            </span>

            <input
                type="number"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            />
        </label>
    );
}

function Toggle({ label, value, onChange }: any) {
    return (
        <label className="flex min-h-[76px] items-center justify-between gap-4 rounded-md border border-slate-300 bg-slate-50 px-4 py-3">
            <div>
                <div className="text-sm font-black text-slate-900">
                    {label}
                </div>

                <div
                    className={`mt-1 text-xs font-bold ${value ? "text-[#0F3D2E]" : "text-slate-500"
                        }`}
                >
                    {value ? "Enabled" : "Disabled"}
                </div>
            </div>

            <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
            />
        </label>
    );
}