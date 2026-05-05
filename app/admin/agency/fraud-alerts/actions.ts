"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";

export async function resolveFraudAlertAction(id: number) {
    return await adminApiPost(`/api/admin/agency/fraud-alerts/${id}/resolve`);
}