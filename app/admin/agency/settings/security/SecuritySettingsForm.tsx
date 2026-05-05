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
        <div style={card}>
            <div style={header}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                    Security Controls
                </h2>
                <p style={{ margin: "6px 0 0", color: "#CBD5E1" }}>
                    Configure OTP, sessions, PIN lock, device binding, and access limits.
                </p>
            </div>

            <div style={section}>
                <SectionTitle title="OTP Settings" />
                <div style={grid}>
                    <Input label="Agent OTP Expiry Minutes" name="agentOtpExpiryMinutes" value={form.agentOtpExpiryMinutes} onChange={updateField} />
                    <Input label="Agent OTP Max Attempts" name="agentOtpMaxAttempts" value={form.agentOtpMaxAttempts} onChange={updateField} />
                    <Input label="Admin OTP Expiry Minutes" name="adminOtpExpiryMinutes" value={form.adminOtpExpiryMinutes} onChange={updateField} />
                    <Input label="Admin OTP Max Attempts" name="adminOtpMaxAttempts" value={form.adminOtpMaxAttempts} onChange={updateField} />
                </div>
            </div>

            <div style={section}>
                <SectionTitle title="Session & PIN Rules" />
                <div style={grid}>
                    <Input label="Admin Session Timeout Minutes" name="adminSessionTimeoutMinutes" value={form.adminSessionTimeoutMinutes} onChange={updateField} />
                    <Input label="Agent Session Timeout Days" name="agentSessionTimeoutDays" value={form.agentSessionTimeoutDays} onChange={updateField} />
                    <Input label="PIN Max Attempts" name="pinMaxAttempts" value={form.pinMaxAttempts} onChange={updateField} />
                    <Input label="PIN Lock Minutes" name="pinLockMinutes" value={form.pinLockMinutes} onChange={updateField} />
                </div>
            </div>

            <div style={section}>
                <SectionTitle title="Access Protection" />
                <div style={grid}>
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

                    <Input label="OTP Resend Cooldown Seconds" name="otpResendCooldownSeconds" value={form.otpResendCooldownSeconds} onChange={updateField} />
                    <Input label="Max OTP Requests Per Phone Per 5 Min" name="maxOtpRequestsPerPhonePer5Min" value={form.maxOtpRequestsPerPhonePer5Min} onChange={updateField} />
                </div>
            </div>

            <div style={{ padding: 24, borderTop: "1px solid #E2E8F0" }}>
                {message && <div style={success}>{message}</div>}
                {error && <div style={danger}>{error}</div>}

                <button onClick={saveSettings} disabled={pending} style={button(pending)}>
                    {pending ? "Saving..." : "Save Security Settings"}
                </button>
            </div>
        </div>
    );
}

function SectionTitle({ title }: any) {
    return (
        <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 900, color: "#0F172A" }}>
            {title}
        </h3>
    );
}

function Input({ label, name, value, onChange }: any) {
    return (
        <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 800, color: "#334155" }}>{label}</span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                style={input}
            />
        </label>
    );
}

function Toggle({ label, value, onChange }: any) {
    return (
        <label style={toggleBox}>
            <div>
                <div style={{ fontWeight: 900, color: "#0F172A" }}>{label}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                    {value ? "Enabled" : "Disabled"}
                </div>
            </div>

            <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: 22, height: 22 }}
            />
        </label>
    );
}

const card = {
    maxWidth: 1000,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 22,
    boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
    overflow: "hidden",
};

const header = {
    padding: "22px 26px",
    background: "linear-gradient(135deg, #0F172A, #1E293B)",
    color: "#FFFFFF",
};

const section = {
    padding: 24,
    borderTop: "1px solid #E2E8F0",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
};

const input = {
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    fontSize: 15,
    outline: "none",
};

const toggleBox = {
    border: "1px solid #CBD5E1",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    background: "#F8FAFC",
};

const success = {
    color: "#166534",
    background: "#DCFCE7",
    padding: 12,
    borderRadius: 12,
    fontWeight: 800,
    marginBottom: 12,
};

const danger = {
    color: "#991B1B",
    background: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    fontWeight: 800,
    marginBottom: 12,
};

const button = (pending: boolean) => ({
    padding: "13px 22px",
    borderRadius: 12,
    border: "none",
    background: pending ? "#94A3B8" : "#0F172A",
    color: "#FFFFFF",
    fontWeight: 900,
    cursor: pending ? "not-allowed" : "pointer",
});