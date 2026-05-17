import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import { createWithdrawalChargeRuleAction } from "./actions";
import ChargeStatusButton from "./ChargeStatusButton";

function money(v: any) {
    return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

export default async function WithdrawalChargesPage() {
    let rules: any[] = [];

    try {
        const res = await mobileAdminGet("/api/admin/mobile/withdrawal-charges");
        rules = res.rules || [];
    } catch {
        rules = [];
    }

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 shadow">
                <p className="text-sm font-semibold text-slate-500">Mobile Banking</p>
                <h1 className="mt-1 text-3xl text-slate-900">
                    Withdrawal Charges
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Set member M-Pesa withdrawal charge rules by amount range.
                </p>
            </div>

            <form
                action={createWithdrawalChargeRuleAction}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Add Charge Rule
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                    <input
                        name="min_amount"
                        type="number"
                        placeholder="Min amount"
                        className="rounded-md border px-3 py-2"
                        required
                    />

                    <input
                        name="max_amount"
                        type="number"
                        placeholder="Max amount"
                        className="rounded-md border px-3 py-2"
                        required
                    />

                    <select
                        name="charge_type"
                        className="rounded-md border px-3 py-2"
                        defaultValue="flat"
                    >
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                    </select>

                    <input
                        name="charge_value"
                        type="number"
                        placeholder="Charge value"
                        className="rounded-md border px-3 py-2"
                        required
                    />

                    <button className="rounded-md bg-[#0F3D2E] px-5 py-2 font-black text-white">
                        Save Rule
                    </button>
                </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 border-b pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                        Charge Rules
                    </h2>
                    <p className="text-sm text-slate-500">
                        Active rules are used when members submit withdrawal requests.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="px-2 py-2 text-left font-bold">Range</th>
                                <th className="px-2 py-2 text-left font-bold">Type</th>
                                <th className="px-2 py-2 text-right font-bold">Value</th>
                                <th className="px-2 py-2 text-left font-bold">Status</th>
                                <th className="px-2 py-2 text-left font-bold">Updated</th>
                                <th className="px-2 py-2 text-left font-bold">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rules.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-8 text-center text-slate-500"
                                    >
                                        No withdrawal charge rules found.
                                    </td>
                                </tr>
                            ) : (
                                rules.map((r: any) => {
                                    const active =
                                        String(r.status || "").toLowerCase() === "active";

                                    return (
                                        <tr key={r.id} className="border-b hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-2 py-2 font-semibold">
                                                {money(r.min_amount)} - {money(r.max_amount)}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2 uppercase">
                                                {r.charge_type}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2 text-right font-black text-[#0F3D2E]">
                                                {r.charge_type === "percentage"
                                                    ? `${Number(r.charge_value || 0)}%`
                                                    : money(r.charge_value)}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${active
                                                        ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2 text-slate-500">
                                                {r.updated_at
                                                    ? new Date(r.updated_at).toLocaleString("en-KE")
                                                    : "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                <ChargeStatusButton
                                                    id={Number(r.id)}
                                                    status={r.status}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}