import ExportMobileReportsButton from "@/app/components/ExportMobileReportsButton";
import { mobileAdminGet } from "@/app/lib/mobileAdminApi";

function money(value: any) {
    return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

export default async function MobileReportsPage() {
    const [overviewRes, membersRes, stkRes, withdrawalsRes] = await Promise.all([
        mobileAdminGet("/api/admin/mobile/overview"),
        mobileAdminGet("/api/admin/mobile/members"),
        mobileAdminGet("/api/admin/mobile/stk-transactions"),
        mobileAdminGet("/api/admin/mobile/withdrawals"),
    ]);

    const members = membersRes.members || [];
    const stk = stkRes.transactions || [];
    const withdrawals = withdrawalsRes.withdrawals || [];

    const totalStkAmount = stk.reduce(
        (sum: number, tx: any) => sum + Number(tx.amount || 0),
        0
    );

    const totalWithdrawalAmount = withdrawals.reduce(
        (sum: number, w: any) => sum + Number(w.amount || 0),
        0
    );

    const successfulStk = stk.filter((tx: any) => {
        const status = String(tx.status || "").toLowerCase();
        return (
            status.includes("success") ||
            status.includes("completed") ||
            status.includes("posted")
        );
    }).length;

    const pendingWithdrawals = withdrawals.filter((w: any) =>
        String(w.status || "").toLowerCase().includes("pending")
    ).length;
    const reportRows = [
        { report: "Linked Members", count: members.length, amount: "-" },
        { report: "STK Deposits", count: stk.length, amount: money(totalStkAmount) },
        {
            report: "Withdrawal Requests",
            count: withdrawals.length,
            amount: money(totalWithdrawalAmount),
        },
        { report: "Successful STK", count: successfulStk, amount: "-" },
        { report: "Pending Withdrawals", count: pendingWithdrawals, amount: "-" },
    ];
    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">Mobile Banking</p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Mobile Reports
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View mobile banking summaries for members, deposits, withdrawals, and OTP activity.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Linked Members" value={members.length} />
                <SummaryCard label="STK Records" value={stk.length} />
                <SummaryCard label="Withdrawals" value={withdrawals.length} />
                <SummaryCard
                    label="Active OTPs"
                    value={overviewRes.data?.otp?.activeOtps || 0}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="STK Amount" value={money(totalStkAmount)} />
                <SummaryCard
                    label="Withdrawal Amount"
                    value={money(totalWithdrawalAmount)}
                />
                <SummaryCard label="Successful STK" value={successfulStk} />
                <SummaryCard label="Pending Withdrawals" value={pendingWithdrawals} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <ExportMobileReportsButton rows={reportRows} />

                    <p className="text-sm text-slate-500">
                        Members {members.length} • STK {stk.length} • Withdrawals {withdrawals.length}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse text-[12px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Report
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                                    Count
                                </th>
                                <th className="px-2 py-2 text-right font-bold">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <ReportRow title="Linked Members" count={members.length} amount="-" />
                            <ReportRow title="STK Deposits" count={stk.length} amount={money(totalStkAmount)} />
                            <ReportRow title="Withdrawal Requests" count={withdrawals.length} amount={money(totalWithdrawalAmount)} />
                            <ReportRow title="Successful STK" count={successfulStk} amount="-" />
                            <ReportRow title="Pending Withdrawals" count={pendingWithdrawals} amount="-" />
                        </tbody>
                    </table>
                </div>
            </div>
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

function ReportRow({ title, count, amount }: any) {
    return (
        <tr className="border-b hover:bg-slate-50">
            <td className="whitespace-nowrap px-2 py-2 font-semibold">{title}</td>
            <td className="whitespace-nowrap px-2 py-2 text-right">{count}</td>
            <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                {amount}
            </td>
        </tr>
    );
}