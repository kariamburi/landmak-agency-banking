"use server";

import { mobileAdminPost } from "@/app/lib/mobileAdminApi";
import { revalidatePath } from "next/cache";

export async function revokeMobileSessionAction(sessionId: string) {
    const res = await mobileAdminPost("/api/admin/mobile/sessions/revoke", {
        sessionId,
    });

    revalidatePath("/admin/mobile/sessions");

    return res;
}