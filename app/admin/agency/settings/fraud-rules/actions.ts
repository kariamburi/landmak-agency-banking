"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";

export async function saveFraudRulesAction(form: any) {
    return await adminApiPost("/api/admin/agency/settings/fraud-rules", form);
}