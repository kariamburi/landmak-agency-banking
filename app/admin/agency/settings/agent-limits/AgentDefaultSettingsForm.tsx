"use client";

import { useState, useTransition } from "react";
import { saveAgentDefaultSettingsAction } from "./actions";

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
        <div style={card}>
            <div style={header}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                    Agent Transaction Limits
                </h2>
                <p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>
                    These limits will be used when creating agents if custom limits are not provided.
                </p>
            </div>

            <div style={{ padding: 24, display: "grid", gap: 18 }}>
                <Input label="Default Daily Deposit Limit" name="dailyDepositLimit" value={form.dailyDepositLimit} onChange={updateField} />
                <Input label="Default Daily Withdrawal Limit" name="dailyWithdrawalLimit" value={form.dailyWithdrawalLimit} onChange={updateField} />
                <Input label="Default Single Transaction Limit" name="singleTransactionLimit" value={form.singleTransactionLimit} onChange={updateField} />

                {message && <div style={{ color: "#166534", fontWeight: 700 }}>{message}</div>}
                {error && <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div>}

                <button onClick={saveSettings} disabled={pending} style={button(pending)}>
                    {pending ? "Saving..." : "Save Agent Limits"}
                </button>
            </div>
        </div>
    );
}

function Input({ label, name, value, onChange }: any) {
    return (
        <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>{label}</span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                style={input}
            />
        </label>
    );
}

const card = {
    maxWidth: 850,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    overflow: "hidden",
};

const header = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#ffffff",
};

const input = {
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    outline: "none",
};

const button = (pending: boolean) => ({
    marginTop: 8,
    width: "fit-content",
    padding: "12px 22px",
    borderRadius: 12,
    border: "none",
    background: pending ? "#94a3b8" : "#0f172a",
    color: "#ffffff",
    fontWeight: 800,
    cursor: pending ? "not-allowed" : "pointer",
});