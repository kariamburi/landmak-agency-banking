"use server";

import { mobileAdminPost } from "@/app/lib/mobileAdminApi";
import { revalidatePath } from "next/cache";
export async function revokeClientMobileSessionsAction(clientId: number) {
    const res = await mobileAdminPost("/api/admin/mobile/sessions/revoke-client", {
        clientId,
    });

    revalidatePath("/admin/mobile/devices");

    return res;
}
export async function activateClientMobileDevicesAction(clientId: number) {
    const res = await mobileAdminPost("/api/admin/mobile/devices/activate-client", {
        clientId,
    });

    revalidatePath("/admin/mobile/devices");

    return res;
}
export async function updateMobileDeviceStatusAction(
    id: number,
    status: "active" | "blocked" | "revoked"
) {
    const res = await mobileAdminPost("/api/admin/mobile/devices/status", {
        id,
        status,
    });

    revalidatePath("/admin/mobile/devices");

    return res;
}