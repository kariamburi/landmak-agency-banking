"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

export async function saveGlobalSettingsAction(form: any) {
    const payload = {
        globalAdminOtpExpiryMinutes: Number(form.globalAdminOtpExpiryMinutes),
        globalAdminOtpMaxAttempts: Number(form.globalAdminOtpMaxAttempts),
        globalAdminSessionTimeoutMinutes: Number(
            form.globalAdminSessionTimeoutMinutes
        ),
        globalMaintenanceMode: Boolean(form.globalMaintenanceMode),
    };

    const res = await adminApiPost("/api/admin/settings/global", payload);

    if (!res.ok) {
        throw new Error(res.error || "Failed to save global settings");
    }

    revalidatePath("/admin/settings/global");

    return res;
}