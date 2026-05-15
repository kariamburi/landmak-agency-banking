"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    updateMobileDeviceStatusAction,
    revokeClientMobileSessionsAction,
    activateClientMobileDevicesAction,
} from "./actions";
export default function DeviceStatusActions({
    deviceId,
    clientId,
    status,
}: {
    deviceId: number;
    clientId?: number;
    status: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [busyStatus, setBusyStatus] = useState("");

    function updateStatus(nextStatus: "active" | "blocked" | "revoked") {
        const label =
            nextStatus === "active"
                ? "activate"
                : nextStatus === "blocked"
                    ? "block"
                    : "revoke";

        if (!confirm(`Are you sure you want to ${label} this device?`)) return;

        setBusyStatus(nextStatus);

        startTransition(async () => {
            try {
                const res = await updateMobileDeviceStatusAction(deviceId, nextStatus);
                alert(res.message || "Device updated successfully");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to update device");
            } finally {
                setBusyStatus("");
            }
        });
    }
    function logoutAllDevices() {
        if (!clientId) {
            alert("Missing client id");
            return;
        }

        if (!confirm("Logout this member from all devices?")) return;

        setBusyStatus("logout_all");

        startTransition(async () => {
            try {
                const res = await revokeClientMobileSessionsAction(clientId);
                alert(res.message || "All devices logged out");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to logout all devices");
            } finally {
                setBusyStatus("");
            }
        });
    }
    function activateAllDevices() {
        if (!clientId) {
            alert("Missing client id");
            return;
        }

        if (!confirm("Activate all devices for this member?")) return;

        setBusyStatus("activate_all");

        startTransition(async () => {
            try {
                const res = await activateClientMobileDevicesAction(clientId);
                alert(res.message || "All devices activated");
                router.refresh();
            } catch (e: any) {
                alert(e.message || "Failed to activate all devices");
            } finally {
                setBusyStatus("");
            }
        });
    }
    const current = String(status || "active").toLowerCase();

    return (
        <div className="flex items-center gap-2">
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
                onClick={logoutAllDevices}
                className="rounded bg-slate-100 px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
                {busyStatus === "logout_all" ? "..." : "Logout All"}
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