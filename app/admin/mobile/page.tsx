import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import Link from "next/link";

function money(value: any) {
    return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

export default async function MobileBankingPage() {
    const res = await mobileAdminGet("/api/admin/mobile/overview");

    const members = res.data?.members || {};
    const otp = res.data?.otp || {};
    const stk = res.data?.stk || {};
    const withdrawals = res.data?.withdrawals || {};

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">Mobile Banking</p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Mobile Banking Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Monitor member app activity, STK deposits, withdrawals, and OTP
                    security.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Linked Members"
                    value={members.totalLinkedMembers || 0}
                    subtitle="Members using mobile app"
                />

                <SummaryCard
                    label="Active OTPs"
                    value={otp.activeOtps || 0}
                    subtitle="Valid OTP sessions"
                />

                <SummaryCard
                    label="Today STK Deposits"
                    value={stk.totalStk || 0}
                    subtitle={money(stk.totalStkAmount)}
                />

                <SummaryCard
                    label="Today Withdrawals"
                    value={withdrawals.totalWithdrawals || 0}
                    subtitle={money(withdrawals.totalWithdrawalAmount)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ModuleCard
                    href="/admin/mobile/members"
                    title="Members"
                    description="View linked members, phone numbers, account status, and mobile access."
                />

                <ModuleCard
                    href="/admin/mobile/stk"
                    title="STK Deposits"
                    description="Monitor M-Pesa STK deposit requests, amounts, statuses, and references."
                />

                <ModuleCard
                    href="/admin/mobile/withdrawals"
                    title="Withdrawals"
                    description="Track member withdrawal requests, approvals, B2C payouts, and failures."
                />

                <ModuleCard
                    href="/admin/mobile/security"
                    title="Security"
                    description="Review OTP activity, sessions, lockouts, and mobile banking access controls."
                />
            </div>
        </div>
    );
}

function SummaryCard({
    label,
    value,
    subtitle,
}: {
    label: string;
    value: string | number;
    subtitle?: string;
}) {
    return (
        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
            <p className="text-sm font-semibold text-white/70">{label}</p>
            <h2 className="mt-2 text-xl font-black">{value}</h2>
            {subtitle && <p className="mt-1 text-xs font-semibold text-white/70">{subtitle}</p>}
        </div>
    );
}

function ModuleCard({
    href,
    title,
    description,
}: {
    href: string;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-slate-900">{title}</h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {description}
                    </p>
                </div>

                <div className="rounded-xl bg-[#0F3D2E]/10 px-3 py-2 text-sm font-black text-[#0F3D2E] transition group-hover:bg-[#0F3D2E] group-hover:text-white">
                    →
                </div>
            </div>

            <div className="mt-5 border-t pt-4">
                <span className="text-sm font-black text-[#0F3D2E]">
                    Open Module
                </span>
            </div>
        </Link>
    );
}