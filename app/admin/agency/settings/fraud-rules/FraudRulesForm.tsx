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
        <div style={card}>
            <div style={header}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                    Fraud Detection Rules
                </h2>
                <p style={{ margin: "6px 0 0", color: "#CBD5E1" }}>
                    Control withdrawal velocity, suspicious patterns, and approval thresholds.
                </p>
            </div>

            <div style={section}>
                <SectionTitle title="Velocity Limits" />

                <div style={grid}>
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
            </div>

            <div style={section}>
                <SectionTitle title="Suspicious Pattern Flags" />

                <div style={grid}>
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

            <div style={section}>
                <SectionTitle title="Approval Control" />

                <div style={grid}>
                    <Input
                        label="Require Admin Approval Above Amount"
                        name="requireAdminApprovalAboveAmount"
                        value={form.requireAdminApprovalAboveAmount}
                        onChange={updateField}
                    />
                </div>
            </div>

            <div style={{ padding: 24, borderTop: "1px solid #E2E8F0" }}>
                {message && <div style={success}>{message}</div>}
                {error && <div style={danger}>{error}</div>}

                <button onClick={saveSettings} disabled={pending} style={button(pending)}>
                    {pending ? "Saving..." : "Save Fraud Rules"}
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
    background: "linear-gradient(135deg, #7F1D1D, #991B1B)",
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
    background: pending ? "#94A3B8" : "#7F1D1D",
    color: "#FFFFFF",
    fontWeight: 900,
    cursor: pending ? "not-allowed" : "pointer",
});