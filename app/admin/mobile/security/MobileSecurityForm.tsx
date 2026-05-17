"use client";

import { useState, useTransition } from "react";
import { saveMobileSecuritySettingsAction } from "./actions";

export default function MobileSecurityForm({ initialSettings }: any) {
    const [form, setForm] = useState({
        mobileOtpExpiryMinutes: initialSettings?.mobileOtpExpiryMinutes ?? 5,
        mobileOtpMaxAttempts: initialSettings?.mobileOtpMaxAttempts ?? 3,
        mobileOtpResendCooldownSeconds:
            initialSettings?.mobileOtpResendCooldownSeconds ?? 60,
        mobileMaxOtpRequestsPerPhonePer5Min:
            initialSettings?.mobileMaxOtpRequestsPerPhonePer5Min ?? 3,

        mobilePinMaxAttempts: initialSettings?.mobilePinMaxAttempts ?? 5,
        mobilePinLockMinutes: initialSettings?.mobilePinLockMinutes ?? 15,
        mobileSessionTimeoutDays: initialSettings?.mobileSessionTimeoutDays ?? 30,

        mobileDeviceBindingRequired:
            initialSettings?.mobileDeviceBindingRequired ?? true,
        mobileRequireOtpForWithdrawals:
            initialSettings?.mobileRequireOtpForWithdrawals ?? true,
        mobileRequireBiometricForWithdrawals:
            initialSettings?.mobileRequireBiometricForWithdrawals ?? false,

        mobileDailyWithdrawalLimit:
            initialSettings?.mobileDailyWithdrawalLimit ?? 100000,
        mobileHighRiskApprovalAmount:
            initialSettings?.mobileHighRiskApprovalAmount ?? 50000,

        b2cBalanceAlertThreshold:
            initialSettings?.b2cBalanceAlertThreshold ?? 50000,
        b2cAlertPhone:
            initialSettings?.b2cAlertPhone ?? "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    function updateField(name: string, value: any) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function saveSettings() {
        setMessage("");
        setError("");

        startTransition(async () => {
            try {
                const res = await saveMobileSecuritySettingsAction(form);
                setMessage(res.message || "Mobile security settings saved successfully");
            } catch (e: any) {
                setError(e.message || "Failed to save mobile security settings");
            }
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                Mobile Banking Security Controls
            </div>

            <SectionTitle title="OTP Protection" />

            <div className="grid gap-4 md:grid-cols-4">
                <Input label="OTP Expiry Minutes" name="mobileOtpExpiryMinutes" value={form.mobileOtpExpiryMinutes} onChange={updateField} />
                <Input label="OTP Max Attempts" name="mobileOtpMaxAttempts" value={form.mobileOtpMaxAttempts} onChange={updateField} />
                <Input label="OTP Cooldown Seconds" name="mobileOtpResendCooldownSeconds" value={form.mobileOtpResendCooldownSeconds} onChange={updateField} />
                <Input label="Max OTP Requests / 5 Min" name="mobileMaxOtpRequestsPerPhonePer5Min" value={form.mobileMaxOtpRequestsPerPhonePer5Min} onChange={updateField} />
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="PIN, Session & Device Security" />

                <div className="grid gap-4 md:grid-cols-4">
                    <Input label="PIN Max Attempts" name="mobilePinMaxAttempts" value={form.mobilePinMaxAttempts} onChange={updateField} />
                    <Input label="PIN Lock Minutes" name="mobilePinLockMinutes" value={form.mobilePinLockMinutes} onChange={updateField} />
                    <Input label="Session Timeout Days" name="mobileSessionTimeoutDays" value={form.mobileSessionTimeoutDays} onChange={updateField} />

                    <Toggle
                        label="Require Device Binding"
                        value={form.mobileDeviceBindingRequired}
                        onChange={(v: boolean) => updateField("mobileDeviceBindingRequired", v)}
                    />
                </div>
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="Withdrawal Protection" />

                <div className="grid gap-4 md:grid-cols-4">
                    <Toggle
                        label="Require OTP For Withdrawals"
                        value={form.mobileRequireOtpForWithdrawals}
                        onChange={(v: boolean) => updateField("mobileRequireOtpForWithdrawals", v)}
                    />

                    <Toggle
                        label="Require Biometric For Withdrawals"
                        value={form.mobileRequireBiometricForWithdrawals}
                        onChange={(v: boolean) => updateField("mobileRequireBiometricForWithdrawals", v)}
                    />

                    <Input label="Daily Withdrawal Limit" name="mobileDailyWithdrawalLimit" value={form.mobileDailyWithdrawalLimit} onChange={updateField} />
                    <Input label="High Risk Approval Amount" name="mobileHighRiskApprovalAmount" value={form.mobileHighRiskApprovalAmount} onChange={updateField} />
                </div>
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="B2C Float Alerts" />

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="B2C Balance Alert Threshold"
                        name="b2cBalanceAlertThreshold"
                        value={form.b2cBalanceAlertThreshold}
                        onChange={updateField}
                    />

                    <TextInput
                        label="B2C Alert Phone"
                        name="b2cAlertPhone"
                        value={form.b2cAlertPhone}
                        onChange={updateField}
                        placeholder="2547XXXXXXXX"
                    />
                </div>

                <p className="mt-3 text-xs font-semibold text-slate-500">
                    Admin will receive SMS warning when B2C utility balance falls below this threshold.
                </p>
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
                    {pending ? "Saving..." : "Save Mobile Security"}
                </button>
            </div>
        </div>
    );
}

function SectionTitle({ title }: any) {
    return <h3 className="mb-4 text-lg font-black text-slate-900">{title}</h3>;
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

function TextInput({ label, name, value, onChange, placeholder }: any) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
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
                <div className="text-sm font-black text-slate-900">{label}</div>
                <div className={`mt-1 text-xs font-bold ${value ? "text-[#0F3D2E]" : "text-slate-500"}`}>
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