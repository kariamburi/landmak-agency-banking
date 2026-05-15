import { adminApiGet } from "@/app/lib/agencyAdminApi";
import SecuritySettingsForm from "./SecuritySettingsForm";
import Link from "next/link";

export default async function SecuritySettingsPage() {
    const res = await adminApiGet("/api/admin/agency/settings/security");
    const settings = res.settings || {};

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Agency Settings
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Security Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage OTP, session, PIN, device binding, and access protection rules.
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

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    label="Agent OTP Expiry"
                    value={`${settings.agentOtpExpiryMinutes ?? 5} min`}
                />

                <SummaryCard
                    label="Admin Session Timeout"
                    value={`${settings.adminSessionTimeoutMinutes ?? 15} min`}
                />

                <SummaryCard
                    label="PIN Lock"
                    value={`${settings.pinLockMinutes ?? 15} min`}
                />

                <SummaryCard
                    label="Device Binding"
                    value={settings.deviceBindingRequired ?? true ? "Enabled" : "Disabled"}
                />
            </div>

            <SecuritySettingsForm initialSettings={settings} />
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