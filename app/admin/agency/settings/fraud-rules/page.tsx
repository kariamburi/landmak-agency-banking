import { adminApiGet } from "@/app/lib/agencyAdminApi";
import FraudRulesForm from "./FraudRulesForm";
import Link from "next/link";

export default async function FraudRulesPage() {
    const res = await adminApiGet("/api/admin/agency/settings/fraud-rules");
    const settings = res.settings || {};

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Agency Settings
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Fraud Rules
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Configure withdrawal velocity limits, suspicious transaction flags,
                    and approval thresholds.
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Link
                    href="/admin/agency/settings"
                    className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                >
                    ← Go Back
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    label="Agent Withdrawals / Hour"
                    value={settings.maxWithdrawalsPerAgentPerHour ?? 10}
                />

                <SummaryCard
                    label="Member Withdrawals / Hour"
                    value={settings.maxWithdrawalsPerMemberPerHour ?? 3}
                />

                <SummaryCard
                    label="Approval Above"
                    value={`KES ${Number(
                        settings.requireAdminApprovalAboveAmount || 0
                    ).toLocaleString("en-KE")}`}
                />
            </div>

            <FraudRulesForm initialSettings={settings} />
        </div>
    );
}

function SummaryCard({ label, value }: any) {
    return (
        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
            <p className="text-sm font-semibold text-white/70">{label}</p>
            <h2 className="mt-2 text-xl font-black">{value}</h2>
        </div>
    );
}