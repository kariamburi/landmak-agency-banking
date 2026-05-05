"use server";

import { adminApiPost } from "@/app/lib/agencyAdminApi";

export async function approveWithdrawalAction(id: number) {
    return await adminApiPost(
        `/api/admin/agency/withdrawal-approvals/${id}/approve`
    );
}

export async function rejectWithdrawalAction(id: number, reason: string) {
    return await adminApiPost(
        `/api/admin/agency/withdrawal-approvals/${id}/reject`,
        { reason }
    );
}