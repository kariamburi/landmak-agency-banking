"use server";

import { mobileAdminPost } from "@/app/lib/mobileAdminApi";
import { revalidatePath } from "next/cache";

export async function approveMobileWithdrawalAction(id: number) {
    const res = await mobileAdminPost(
        `/api/admin/mobile/withdrawals/${id}/approve`,
        {}
    );

    revalidatePath("/admin/mobile/withdrawals");
    revalidatePath("/admin/mobile");

    return res;
}

export async function rejectMobileWithdrawalAction(
    id: number,
    reason: string
) {
    const res = await mobileAdminPost(
        `/api/admin/mobile/withdrawals/${id}/reject`,
        {
            reason,
        }
    );

    revalidatePath("/admin/mobile/withdrawals");
    revalidatePath("/admin/mobile");

    return res;
}