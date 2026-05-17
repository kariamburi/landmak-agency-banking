"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

export async function saveGlobalSettingsAction(form: any) {
    const payload = {
        globalAdminOtpExpiryMinutes: Number(form.globalAdminOtpExpiryMinutes || 5),
        globalAdminOtpMaxAttempts: Number(form.globalAdminOtpMaxAttempts || 3),
        globalAdminSessionTimeoutMinutes: Number(
            form.globalAdminSessionTimeoutMinutes || 15
        ),
        globalMaintenanceMode: Boolean(form.globalMaintenanceMode),

        // Backend requires these too
        globalSmsEnabled:
            form.globalSmsEnabled === undefined ? true : Boolean(form.globalSmsEnabled),
        globalMinPasswordLength: Number(form.globalMinPasswordLength || 8),
    };

    const res = await adminApiPost("/api/admin/settings/global", payload);

    if (!res?.ok) {
        return {
            ok: false,
            error: res?.error || "Failed to save global settings",
        };
    }

    revalidatePath("/admin/settings/global");

    return {
        ok: true,
        message: res.message || "Global settings saved successfully",
    };
}