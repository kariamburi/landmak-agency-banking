"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

export async function revokeAgentSessionsAction(agentId: number) {
    const res = await adminApiPost("/api/admin/agency/sessions/revoke-agent", {
        agentId,
    });

    revalidatePath("/admin/agency/devices");

    return res;
}

export async function activateAgentDevicesAction(agentId: number) {
    const res = await adminApiPost("/api/admin/agency/devices/activate-agent", {
        agentId,
    });

    revalidatePath("/admin/agency/devices");

    return res;
}

export async function updateAgentDeviceStatusAction(
    id: number,
    status: "active" | "blocked" | "revoked"
) {
    const res = await adminApiPost("/api/admin/agency/devices/status", {
        id,
        status,
    });

    revalidatePath("/admin/agency/devices");

    return res;
}