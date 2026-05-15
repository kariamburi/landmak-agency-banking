import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import MobileSecurityForm from "./MobileSecurityForm";

export default async function MobileSecurityPage() {
    const res = await mobileAdminGet("/api/admin/mobile/security");
    const settings = res.settings || {};
    const stats = res.stats || {};

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">Mobile Banking</p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Mobile Security
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage OTP, PIN, device binding, sessions, withdrawal protection, and fraud controls.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Active OTPs" value={stats.activeOtps || 0} />
                <SummaryCard label="Failed OTP Today" value={stats.failedOtpToday || 0} />
                <SummaryCard label="Device Binding" value={settings.mobileDeviceBindingRequired ? "Enabled" : "Disabled"} />
                <SummaryCard label="Withdrawal OTP" value={settings.mobileRequireOtpForWithdrawals ? "Required" : "Disabled"} />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="OTP Expiry" value={`${settings.mobileOtpExpiryMinutes ?? 5} min`} />
                <SummaryCard label="PIN Attempts" value={settings.mobilePinMaxAttempts ?? 5} />
                <SummaryCard label="PIN Lock" value={`${settings.mobilePinLockMinutes ?? 15} min`} />
                <SummaryCard label="Daily Limit" value={`KES ${Number(settings.mobileDailyWithdrawalLimit || 0).toLocaleString("en-KE")}`} />
            </div>

            <MobileSecurityForm initialSettings={settings} />
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