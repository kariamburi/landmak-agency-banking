"use server";

import { agencySettingsDelete, agencySettingsPost, agencySettingsPut } from "@/app/lib/agencySettingsApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function deleteCommissionRule(formData: FormData) {
    const id = formData.get("id");

    await agencySettingsDelete(
        `/api/admin/agency/settings/commission-rules/${id}`
    );

    revalidatePath("/admin/agency/settings/commission-rules");
}
export async function createCommissionRule(formData: FormData) {
    await agencySettingsPost("/api/admin/agency/settings/commission-rules", {
        transaction_type: formData.get("transaction_type"),
        commission_type: formData.get("commission_type"),
        min_amount: Number(formData.get("min_amount")),
        max_amount: Number(formData.get("max_amount")),
        value: Number(formData.get("value")),
        status: formData.get("status"),
    });

    redirect("/admin/agency/settings/commission-rules");
}
export async function updateCommissionRule(formData: FormData) {
    const id = formData.get("id");

    await agencySettingsPut(
        `/api/admin/agency/settings/commission-rules/${id}`,
        {
            transaction_type: formData.get("transaction_type"),
            commission_type: formData.get("commission_type"),
            min_amount: Number(formData.get("min_amount")),
            max_amount: Number(formData.get("max_amount")),
            value: Number(formData.get("value")),
            status: formData.get("status"),
        }
    );

    redirect("/admin/agency/settings/commission-rules");
}