import { adminApiGet } from "@/app/lib/agencyAdminApi";
import Link from "next/link";
import GlobalSettingsForm from "./GlobalSettingsForm";

export default async function GlobalSettingsPage() {
    const res = await adminApiGet("/api/admin/settings/global");
    const settings = res.settings || {};

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Global Admin Settings
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Shared Dashboard Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage admin login OTP, dashboard logout timeout, maintenance mode, and global SMS controls.
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Link
                    href="/admin"
                    className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                >
                    ← Go Back
                </Link>

                <Link
                    href="/admin/agency/security"
                    className="flex h-10 items-center rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]"
                >
                    Agency Security
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    label="Admin OTP Expiry"
                    value={`${settings.globalAdminOtpExpiryMinutes ?? 5} min`}
                />

                <SummaryCard
                    label="Admin Session Timeout"
                    value={`${settings.globalAdminSessionTimeoutMinutes ?? 15} min`}
                />

                <SummaryCard
                    label="SMS"
                    value={(settings.globalSmsEnabled ?? true) ? "Enabled" : "Disabled"}
                />

                <SummaryCard
                    label="Maintenance"
                    value={(settings.globalMaintenanceMode ?? false) ? "Enabled" : "Disabled"}
                />
            </div>

            <GlobalSettingsForm initialSettings={settings} />
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