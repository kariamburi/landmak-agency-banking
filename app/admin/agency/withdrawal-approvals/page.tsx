import { adminApiGet } from "@/app/lib/agencyAdminApi";
import WithdrawalApprovalsTable from "./WithdrawalApprovalsTable";


export default async function WithdrawalApprovalsPage() {
    const res = await adminApiGet("/api/admin/agency/withdrawal-approvals");

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
                Withdrawal Approvals
            </h1>

            <p style={{ color: "#64748b", marginTop: 8 }}>
                Review and approve high-value withdrawals flagged by fraud rules.
            </p>

            <div style={{ marginTop: 24 }}>
                <WithdrawalApprovalsTable approvals={res.approvals || []} />
            </div>
        </div>
    );
}