"use client";

import { useState, useTransition } from "react";
import Modal from "./Modal";

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #CBD5E1",
    background: "#F8FAFC",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box" as const,
};

const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 800,
    color: "#334155",
};

function Field({ label, children }: any) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            {children}
        </div>
    );
}

export default function AgentActions({ agents, createAction, topupAction }: any) {
    const [showCreate, setShowCreate] = useState(false);
    const [showTopup, setShowTopup] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            await createAction(formData);
            form.reset();
            setShowCreate(false);
        });
    }

    function handleTopupSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            await topupAction(formData);
            form.reset();
            setShowTopup(false);
        });
    }

    return (
        <>
            <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        padding: "16px 24px",
                        borderRadius: 18,
                        border: "none",
                        background: "#0F3D2E",
                        color: "white",
                        fontWeight: 900,
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    + Create Agent
                </button>

                <button
                    onClick={() => setShowTopup(true)}
                    style={{
                        padding: "16px 24px",
                        borderRadius: 18,
                        border: "none",
                        background: "#D9A441",
                        color: "#111827",
                        fontWeight: 900,
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    Top-up Float
                </button>
            </div>

            <Modal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                title="Create Agent"
                subtitle="Register a new approved agency banking agent."
            >
                <form onSubmit={handleCreateSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Field label="Agent name">
                            <input style={inputStyle} name="name" placeholder="John Agent" required />
                        </Field>

                        <Field label="Phone number">
                            <input style={inputStyle} name="phone" placeholder="0712345678" required />
                        </Field>

                        <Field label="Email">
                            <input style={inputStyle} name="email" placeholder="agent@example.com" />
                        </Field>

                        <Field label="Branch ID">
                            <input style={inputStyle} name="branch_id" type="number" placeholder="1" />
                        </Field>

                        <Field label="Daily deposit limit">
                            <input style={inputStyle} name="daily_deposit_limit" type="number" placeholder="500000" />
                        </Field>

                        <Field label="Daily withdrawal limit">
                            <input style={inputStyle} name="daily_withdrawal_limit" type="number" placeholder="300000" />
                        </Field>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <Field label="Single transaction limit">
                                <input style={inputStyle} name="single_transaction_limit" type="number" placeholder="100000" />
                            </Field>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: "100%",
                            marginTop: 24,
                            padding: 16,
                            borderRadius: 18,
                            border: "none",
                            background: "#0F3D2E",
                            color: "white",
                            fontWeight: 900,
                            fontSize: 16,
                            cursor: isPending ? "not-allowed" : "pointer",
                            opacity: isPending ? 0.7 : 1,
                        }}
                    >
                        {isPending ? "Creating..." : "Create Agent"}
                    </button>
                </form>
            </Modal>

            <Modal
                open={showTopup}
                onClose={() => setShowTopup(false)}
                title="Top-up Float"
                subtitle="Fund an agent wallet for customer withdrawals."
            >
                <form onSubmit={handleTopupSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gap: 14,
                            // maxHeight: "calc(95vh - 160px)",
                            overflowY: "auto",
                            paddingRight: 6,
                        }}
                    >
                        <Field label="Select agent">
                            <select style={inputStyle} name="agent_id" required>
                                <option value="">Choose agent</option>
                                {agents.map((a: any) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} - {a.agent_code}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Amount">
                            <input
                                style={inputStyle}
                                name="amount"
                                type="number"
                                placeholder="100000"
                                required
                            />
                        </Field>

                        <Field label="Payment method">
                            <select style={inputStyle} name="method">
                                <option value="mpesa">M-Pesa</option>
                                <option value="bank">Bank</option>
                                <option value="cash">Cash</option>
                            </select>
                        </Field>

                        <Field label="Reference">
                            <input
                                style={inputStyle}
                                name="reference"
                                placeholder="M-Pesa code / bank ref"
                            />
                        </Field>

                        <Field label="Reason">
                            <input
                                style={inputStyle}
                                name="reason"
                                placeholder="Agent funded float"
                            />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: "100%",
                            marginTop: 18,
                            padding: 16,
                            borderRadius: 18,
                            border: "none",
                            background: "#D9A441",
                            color: "#111827",
                            fontWeight: 900,
                            fontSize: 16,
                            cursor: isPending ? "not-allowed" : "pointer",
                            opacity: isPending ? 0.7 : 1,
                        }}
                    >
                        {isPending ? "Processing..." : "Top-up Float"}
                    </button>
                </form>
            </Modal>
        </>
    );
}