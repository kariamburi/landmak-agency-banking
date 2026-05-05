"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";

export async function saveAgentDefaultSettingsAction(form: any) {
    return await adminApiPost("/api/admin/agency/settings/agent-defaults", form);
}