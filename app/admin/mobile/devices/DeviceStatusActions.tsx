"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    updateMobileDeviceStatusAction,
    revokeClientMobileSessionsAction,
    activateClientMobileDevicesAction,
} from "./actions";

type ActionType =
    | "active"
    | "blocked"
    | "revoked"
    | "logout_all"
    | "activate_all";

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
    const [busyStatus, setBusyStatus] = useState<ActionType | "">("");
    const [open, setOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const current = String(status || "active").toLowerCase();
    const modalData = getModalData(selectedAction);

    function openModal(action: ActionType) {
        setError("");
        setSuccess("");
        setSelectedAction(action);
        setOpen(true);
    }

    function closeModal() {
        if (pending) return;

        setOpen(false);
        setSelectedAction(null);
        setError("");
        setSuccess("");
    }

    function handleConfirm() {
        if (!selectedAction) return;

        setError("");
        setSuccess("");

        if (["logout_all", "activate_all"].includes(selectedAction) && !clientId) {
            setError("Missing client id");
            return;
        }

        setBusyStatus(selectedAction);

        startTransition(async () => {
            try {
                let res: any;

                if (
                    selectedAction === "active" ||
                    selectedAction === "blocked" ||
                    selectedAction === "revoked"
                ) {
                    res = await updateMobileDeviceStatusAction(
                        deviceId,
                        selectedAction
                    );
                }

                if (selectedAction === "logout_all") {
                    res = await revokeClientMobileSessionsAction(clientId!);
                }

                if (selectedAction === "activate_all") {
                    res = await activateClientMobileDevicesAction(clientId!);
                }

                setSuccess(res?.message || "Action completed successfully");

                setTimeout(() => {
                    setOpen(false);
                    setSelectedAction(null);
                    setSuccess("");
                    router.refresh();
                }, 700);
            } catch (e: any) {
                console.log("MOBILE DEVICE ACTION ERROR:", e);
                setError(e?.message || "Failed to complete action");
            } finally {
                setBusyStatus("");
            }
        });
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                {current !== "active" && (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => openModal("active")}
                        className="rounded bg-[#0F3D2E] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#145A43] disabled:opacity-50"
                    >
                        {busyStatus === "active" ? "..." : "Activate"}
                    </button>
                )}

                {current !== "blocked" && (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => openModal("blocked")}
                        className="rounded bg-yellow-100 px-3 py-1.5 text-[12px] font-bold text-yellow-700 hover:bg-yellow-200 disabled:opacity-50"
                    >
                        {busyStatus === "blocked" ? "..." : "Block"}
                    </button>
                )}

                {current !== "revoked" && (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => openModal("revoked")}
                        className="rounded bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                        {busyStatus === "revoked" ? "..." : "Revoke"}
                    </button>
                )}

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => openModal("logout_all")}
                    className="rounded bg-slate-100 px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                    {busyStatus === "logout_all" ? "..." : "Revoke Sessions"}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => openModal("activate_all")}
                    className="rounded bg-[#0F3D2E]/10 px-3 py-1.5 text-[12px] font-bold text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white disabled:opacity-50"
                >
                    {busyStatus === "activate_all" ? "..." : "Activate All"}
                </button>
            </div>

            {open && modalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${modalData.iconBg}`}
                            >
                                {modalData.icon}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-900">
                                    {modalData.title}
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    {modalData.description}
                                </p>

                                <p
                                    className={`mt-2 text-sm font-semibold ${modalData.warningColor}`}
                                >
                                    {modalData.warning}
                                </p>
                            </div>
                        </div>

                        {error ? (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        {success ? (
                            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        ) : null}

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={pending}
                                onClick={closeModal}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={pending}
                                onClick={handleConfirm}
                                className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${modalData.buttonClass}`}
                            >
                                {pending ? modalData.loadingText : modalData.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function getModalData(action: ActionType | null) {
    switch (action) {
        case "active":
            return {
                icon: "✅",
                iconBg: "bg-green-100",
                title: "Activate Member Device",
                description:
                    "This device will be allowed to access the Member Mobile App again.",
                warning: "Only activate trusted devices.",
                warningColor: "text-green-700",
                confirmText: "Yes, Activate",
                loadingText: "Activating...",
                buttonClass: "bg-[#0F3D2E] hover:bg-[#145A43]",
            };

        case "blocked":
            return {
                icon: "⛔",
                iconBg: "bg-yellow-100",
                title: "Block Member Device",
                description:
                    "This device will be blocked from accessing the Member Mobile App.",
                warning: "The member will not be able to use this device until activated again.",
                warningColor: "text-yellow-700",
                confirmText: "Yes, Block",
                loadingText: "Blocking...",
                buttonClass: "bg-yellow-600 hover:bg-yellow-700",
            };

        case "revoked":
            return {
                icon: "⚠️",
                iconBg: "bg-red-100",
                title: "Revoke Member Device",
                description:
                    "This device authorization will be revoked from the Member Mobile App.",
                warning: "The member may need to verify again before using this device.",
                warningColor: "text-red-600",
                confirmText: "Yes, Revoke",
                loadingText: "Revoking...",
                buttonClass: "bg-red-600 hover:bg-red-700",
            };

        case "logout_all":
            return {
                icon: "🔐",
                iconBg: "bg-red-100",
                title: "Revoke Member Sessions",
                description:
                    "This member will be logged out from all active mobile app sessions.",
                warning: "The member will need to login again.",
                warningColor: "text-red-600",
                confirmText: "Yes, Revoke Sessions",
                loadingText: "Revoking...",
                buttonClass: "bg-red-600 hover:bg-red-700",
            };

        case "activate_all":
            return {
                icon: "✅",
                iconBg: "bg-green-100",
                title: "Activate All Member Devices",
                description:
                    "All devices linked to this member will be activated.",
                warning: "Use this only when you trust all registered devices.",
                warningColor: "text-green-700",
                confirmText: "Yes, Activate All",
                loadingText: "Activating...",
                buttonClass: "bg-[#0F3D2E] hover:bg-[#145A43]",
            };

        default:
            return null;
    }
}