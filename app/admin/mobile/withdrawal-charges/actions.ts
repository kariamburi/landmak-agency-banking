"use server";

import { mobileAdminPost } from "@/app/lib/mobileAdminApi";
import { revalidatePath } from "next/cache";

export async function createWithdrawalChargeRuleAction(formData: FormData) {
    await mobileAdminPost("/api/admin/mobile/withdrawal-charges", {
        min_amount: Number(formData.get("min_amount") || 0),
        max_amount: Number(formData.get("max_amount") || 0),
        charge_type: formData.get("charge_type"),
        charge_value: Number(formData.get("charge_value") || 0),
    });

    revalidatePath("/admin/mobile/withdrawal-charges");
}

export async function updateWithdrawalChargeStatusAction(formData: FormData) {
    const id = Number(formData.get("id") || 0);
    const status = String(formData.get("status") || "");

    await mobileAdminPost(
        `/api/admin/mobile/withdrawal-charges/${id}/status`,
        { status }
    );

    revalidatePath("/admin/mobile/withdrawal-charges");
}