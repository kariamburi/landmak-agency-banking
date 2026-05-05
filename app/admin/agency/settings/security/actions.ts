"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";

export async function saveSecuritySettingsAction(form: any) {
    return await adminApiPost("/api/admin/agency/settings/security", form);
}