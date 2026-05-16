"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

export async function saveSecuritySettingsAction(form: any) {
    const payload = {
        agentOtpExpiryMinutes: Number(form.agentOtpExpiryMinutes),
        agentOtpMaxAttempts: Number(form.agentOtpMaxAttempts),

        agentSessionTimeoutDays: Number(form.agentSessionTimeoutDays),

        pinMaxAttempts: Number(form.pinMaxAttempts),
        pinLockMinutes: Number(form.pinLockMinutes),

        deviceBindingRequired: Boolean(form.deviceBindingRequired),
        requireOtpForWithdrawals: Boolean(form.requireOtpForWithdrawals),

        otpResendCooldownSeconds: Number(form.otpResendCooldownSeconds),
        maxOtpRequestsPerPhonePer5Min: Number(
            form.maxOtpRequestsPerPhonePer5Min
        ),
    };

    const res = await adminApiPost(
        "/api/admin/agency/settings/security",
        payload
    );

    if (!res.ok) {
        throw new Error(res.error || "Failed to save agency security settings");
    }

    revalidatePath("/admin/agency/security");

    return res;
}