"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

export async function revokeAgentSessionAction(sessionId: string) {
    const res = await adminApiPost("/api/admin/agency/sessions/revoke", {
        sessionId,
    });

    revalidatePath("/admin/agency/sessions");

    return res;
}