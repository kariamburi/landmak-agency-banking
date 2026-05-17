"use client";

import { useState, useTransition } from "react";
import { saveGlobalSettingsAction } from "./actions";

export default function GlobalSettingsForm({ initialSettings }: any) {
    const [form, setForm] = useState({
        globalAdminOtpExpiryMinutes:
            initialSettings?.globalAdminOtpExpiryMinutes ?? 5,
        globalAdminOtpMaxAttempts:
            initialSettings?.globalAdminOtpMaxAttempts ?? 3,
        globalAdminSessionTimeoutMinutes:
            initialSettings?.globalAdminSessionTimeoutMinutes ?? 15,
        globalMaintenanceMode:
            initialSettings?.globalMaintenanceMode ?? false,

        globalSmsEnabled:
            initialSettings?.globalSmsEnabled ?? true,
        globalMinPasswordLength:
            initialSettings?.globalMinPasswordLength ?? 8,
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
            const res = await saveGlobalSettingsAction(form);

            if (!res?.ok) {
                setError(res?.error || "Failed to save global settings");
                return;
            }

            setMessage(res.message || "Global settings saved successfully");
        });
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                Global Dashboard Controls
            </div>

            <p className="mb-5 text-sm text-slate-500">
                These settings affect the admin dashboard, agency app, and member mobile app.
            </p>

            <SectionTitle title="Admin Login Security" />

            <div className="grid gap-4 md:grid-cols-3">
                <Input
                    label="Admin OTP Expiry Minutes"
                    name="globalAdminOtpExpiryMinutes"
                    value={form.globalAdminOtpExpiryMinutes}
                    onChange={updateField}
                />

                <Input
                    label="Admin OTP Max Attempts"
                    name="globalAdminOtpMaxAttempts"
                    value={form.globalAdminOtpMaxAttempts}
                    onChange={updateField}
                />

                <Input
                    label="Admin Session Timeout Minutes"
                    name="globalAdminSessionTimeoutMinutes"
                    value={form.globalAdminSessionTimeoutMinutes}
                    onChange={updateField}
                />
            </div>

            <div className="mt-6 border-t pt-5">
                <SectionTitle title="System Availability" />

                <Toggle
                    label="Maintenance Mode"
                    value={form.globalMaintenanceMode}
                    onChange={(v: boolean) => updateField("globalMaintenanceMode", v)}
                />
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
                    type="button"
                    onClick={saveSettings}
                    disabled={pending}
                    className={`h-10 rounded-md px-5 text-sm font-black text-white ${pending
                        ? "cursor-not-allowed bg-slate-400"
                        : "cursor-pointer bg-[#0F3D2E] hover:bg-[#145A43]"
                        }`}
                >
                    {pending ? "Saving..." : "Save Global Settings"}
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

function Toggle({ label, value, onChange }: any) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    function handleClick() {
        if (!value) {
            setConfirmOpen(true);
            return;
        }

        onChange(false);
    }

    return (
        <>
            <div className="flex min-h-[86px] items-center justify-between gap-4 rounded-md border border-slate-300 bg-slate-50 px-4 py-3">
                <div>
                    <div className="text-sm font-black text-slate-900">{label}</div>

                    <div
                        className={`mt-1 text-xs font-bold ${value ? "text-red-600" : "text-[#0F3D2E]"
                            }`}
                    >
                        {value
                            ? "Enabled - Apps temporarily unavailable"
                            : "Disabled - System live"}
                    </div>

                    {value && (
                        <div className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                            Maintenance Mode is ON. Users cannot access app services.
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleClick}
                    className={`relative h-7 w-14 shrink-0 cursor-pointer rounded-full transition ${value ? "bg-red-600" : "bg-slate-300"
                        }`}
                >
                    <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? "left-8" : "left-1"
                            }`}
                    />
                </button>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
                            ⚠️
                        </div>

                        <h2 className="mt-4 text-xl font-black text-slate-950">
                            Enable Maintenance Mode?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            This will make the Agency App and Member Mobile App temporarily unavailable.
                            Admin dashboard will remain accessible.
                        </p>

                        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                            Only enable this when doing upgrades, fixes, or emergency maintenance.
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(false)}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-black hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    onChange(true);
                                    setConfirmOpen(false);
                                }}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700"
                            >
                                Enable Maintenance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}