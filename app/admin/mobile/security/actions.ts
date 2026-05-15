"use server";

import { mobileAdminPost } from "@/app/lib/mobileAdminApi";
import { revalidatePath } from "next/cache";

export async function saveMobileSecuritySettingsAction(payload: any) {
    const res = await mobileAdminPost("/api/admin/mobile/security", payload);

    revalidatePath("/admin/mobile/security");

    return res;
}