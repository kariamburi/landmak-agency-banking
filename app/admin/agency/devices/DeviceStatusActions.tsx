"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    updateAgentDeviceStatusAction,
    revokeAgentSessionsAction,
    activateAgentDevicesAction,
} from "./actions";

export default function DeviceStatusActions({
    deviceId,
    agentId,
    status,
}: {
    deviceId: number;
    agentId?: number;
    status: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [busyStatus, setBusyStatus] = useState("");

    const current = String(status || "active").toLowerCase();

    function updateStatus(nextStatus: "active" | "blocked" | "revoked") {
        const label =
            nextStatus === "active"
                ? "activate"
                : nextStatus === "blocked"
                    ? "block"
                    : "revoke";

        if (!confirm(`Are you sure you want to ${label} this agent device?`)) return;

        setBusyStatus(nextStatus);

        startTransition(async () => {
            try {
                const res = await updateAgentDeviceStatusAction(deviceId, nextStatus);
                alert(res.message || "Agent device updated successfully");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to update agent device");
            } finally {
                setBusyStatus("");
            }
        });
    }

    function revokeSessions() {
        if (!agentId) {
            alert("Missing agent id");
            return;
        }

        if (!confirm("Logout this agent from all active sessions?")) return;

        setBusyStatus("revoke_sessions");

        startTransition(async () => {
            try {
                const res = await revokeAgentSessionsAction(agentId);
                alert(res.message || "Agent sessions revoked");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to revoke agent sessions");
            } finally {
                setBusyStatus("");
            }
        });
    }

    function activateAllDevices() {
        if (!agentId) {
            alert("Missing agent id");
            return;
        }

        if (!confirm("Activate all devices for this agent?")) return;

        setBusyStatus("activate_all");

        startTransition(async () => {
            try {
                const res = await activateAgentDevicesAction(agentId);
                alert(res.message || "All agent devices activated");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to activate agent devices");
            } finally {
                setBusyStatus("");
            }
        });
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {current !== "active" && (
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => updateStatus("active")}
                    className="rounded bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#145A43] disabled:opacity-50"
                >
                    {busyStatus === "active" ? "..." : "Activate"}
                </button>
            )}

            {current !== "blocked" && (
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => updateStatus("blocked")}
                    className="rounded bg-yellow-100 px-3 py-1.5 text-[12px] font-bold text-yellow-700 hover:bg-yellow-200 disabled:opacity-50"
                >
                    {busyStatus === "blocked" ? "..." : "Block"}
                </button>
            )}

            {current !== "revoked" && (
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => updateStatus("revoked")}
                    className="rounded bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
                >
                    {busyStatus === "revoked" ? "..." : "Revoke"}
                </button>
            )}

            <button
                type="button"
                disabled={pending}
                onClick={revokeSessions}
                className="rounded bg-slate-100 px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
                {busyStatus === "revoke_sessions" ? "..." : "Revoke Sessions"}
            </button>

            <button
                type="button"
                disabled={pending}
                onClick={activateAllDevices}
                className="rounded bg-[#0F3D2E]/10 px-3 py-1.5 text-[12px] font-bold text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white disabled:opacity-50"
            >
                {busyStatus === "activate_all" ? "..." : "Activate All"}
            </button>
        </div>
    );
}