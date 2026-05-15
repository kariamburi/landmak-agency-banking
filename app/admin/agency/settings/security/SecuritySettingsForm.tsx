"use client";

import { useState, useTransition } from "react";
import { saveSecuritySettingsAction } from "./actions";

export default function SecuritySettingsForm({ initialSettings }: any) {
    const [form, setForm] = useState({
        agentOtpExpiryMinutes: initialSettings?.agentOtpExpiryMinutes ?? 5,
        agentOtpMaxAttempts: initialSettings?.agentOtpMaxAttempts ?? 3,
        adminOtpExpiryMinutes: initialSettings?.adminOtpExpiryMinutes ?? 5,
        adminOtpMaxAttempts: initialSettings?.adminOtpMaxAttempts ?? 3,

        adminSessionTimeoutMinutes: initialSettings?.adminSessionTimeoutMinutes ?? 15,
        agentSessionTimeoutDays: initialSettings?.agentSessionTimeoutDays ?? 30,

        pinMaxAttempts: initialSettings?.pinMaxAttempts ?? 5,
        pinLockMinutes: initialSettings?.pinLockMinutes ?? 15,

        deviceBindingRequired: initialSettings?.deviceBindingRequired ?? true,
        requireOtpForWithdrawals: initialSettings?.requireOtpForWithdrawals ?? true,

        otpResendCooldownSeconds: initialSettings?.otpResendCooldownSeconds ?? 60,
        maxOtpRequestsPerPhonePer5Min:
            initialSettings?.maxOtpRequestsPerPhonePer5Min ?? 3,
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
                const res = await saveSecuritySettingsAction(form);
                setMessage(res.message || "Security settings saved successfully");
            } catch (e: any) {
                setError(e.message || "Failed to save security settings");
            }
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                Security Controls
            </div>

            <p className="mb-5 text-sm text-slate-500">
                Configure OTP, sessions, PIN lock, device binding, and access limits.
            </p>

            <SectionTitle title="OTP Settings" />

            <div className="grid gap-4 md:grid-cols-4">
                <Input
                    label="Agent OTP Expiry Minutes"
                    name="agentOtpExpiryMinutes"
                    value={form.agentOtpExpiryMinutes}
                    onChange={updateField}
                />

                <Input
                    label="Agent OTP Max Attempts"
                    name="agentOtpMaxAttempts"
                    value={form.agentOtpMaxAttempts}
                    onChange={updateField}
                />

                <Input
                    label="Admin OTP Expiry Minutes"
                    name="adminOtpExpiryMinutes"
                    value={form.adminOtpExpiryMinutes}
                    onChange={updateField}
                />

                <Input
                    label="Admin OTP Max Attempts"
                    name="adminOtpMaxAttempts"
                    value={form.adminOtpMaxAttempts}
                    onChange={updateField}
                />
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="Session & PIN Rules" />

                <div className="grid gap-4 md:grid-cols-4">
                    <Input
                        label="Admin Session Timeout Minutes"
                        name="adminSessionTimeoutMinutes"
                        value={form.adminSessionTimeoutMinutes}
                        onChange={updateField}
                    />

                    <Input
                        label="Agent Session Timeout Days"
                        name="agentSessionTimeoutDays"
                        value={form.agentSessionTimeoutDays}
                        onChange={updateField}
                    />

                    <Input
                        label="PIN Max Attempts"
                        name="pinMaxAttempts"
                        value={form.pinMaxAttempts}
                        onChange={updateField}
                    />

                    <Input
                        label="PIN Lock Minutes"
                        name="pinLockMinutes"
                        value={form.pinLockMinutes}
                        onChange={updateField}
                    />
                </div>
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="Access Protection" />

                <div className="grid gap-4 md:grid-cols-4">
                    <Toggle
                        label="Device Binding Required"
                        value={form.deviceBindingRequired}
                        onChange={(v: boolean) => updateField("deviceBindingRequired", v)}
                    />

                    <Toggle
                        label="Require OTP For Withdrawals"
                        value={form.requireOtpForWithdrawals}
                        onChange={(v: boolean) => updateField("requireOtpForWithdrawals", v)}
                    />

                    <Input
                        label="OTP Resend Cooldown Seconds"
                        name="otpResendCooldownSeconds"
                        value={form.otpResendCooldownSeconds}
                        onChange={updateField}
                    />

                    <Input
                        label="Max OTP Requests Per Phone Per 5 Min"
                        name="maxOtpRequestsPerPhonePer5Min"
                        value={form.maxOtpRequestsPerPhonePer5Min}
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
                    {pending ? "Saving..." : "Save Security Settings"}
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