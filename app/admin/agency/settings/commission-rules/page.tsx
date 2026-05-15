import { agencySettingsGet } from "@/app/lib/agencySettingsApi";
import { deleteCommissionRule } from "./server-actions";
import DeleteRuleButton from "./DeleteRuleButton";
import Link from "next/link";

function money(v: any) {
  return Number(v || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function labelType(type: string) {
  if (type === "loan_repayment") return "Loan Repayment";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default async function CommissionRulesPage() {
  const data = await agencySettingsGet(
    "/api/admin/agency/settings/commission-rules"
  );

  const rules = data.rules || [];

  const activeRules = rules.filter((r: any) => r.status === "active").length;
  const inactiveRules = rules.filter((r: any) => r.status !== "active").length;

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">Agency Settings</p>

        <h1 className="mt-1 text-3xl text-slate-900">Commission Rules</h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage how agents earn commissions per transaction type and amount range.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Link
          href="/admin/agency/settings"
          className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
        >
          ← Go Back
        </Link>

        <Link
          href="/admin/agency/settings/commission-rules/new"
          className="flex h-10 items-center rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]"
        >
          + Add Rule
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Rules" value={rules.length} />
        <SummaryCard label="Active Rules" value={activeRules} />
        <SummaryCard label="Inactive Rules" value={inactiveRules} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <p className="text-sm font-semibold text-[#008A3D]">
            Commission Rules
          </p>

          <p className="text-sm text-slate-500">Total {rules.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Type
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Min Amount
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Max Amount
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Commission
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Status
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Created
                </th>
                <th className="px-2 py-2 text-left font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No commission rules found.
                  </td>
                </tr>
              ) : (
                rules.map((rule: any) => (
                  <tr key={rule.id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {labelType(rule.transaction_type)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      KES {money(rule.min_amount)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      KES {money(rule.max_amount)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                      {rule.commission_type === "percentage"
                        ? `${rule.value}%`
                        : `KES ${money(rule.value)}`}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <span
                        className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${rule.status === "active"
                          ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {rule.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                      {rule.created_at
                        ? new Date(rule.created_at).toLocaleDateString("en-KE")
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/agency/settings/commission-rules/${rule.id}/edit`}
                          className="rounded bg-blue-100 px-3 py-1.5 text-[12px] font-bold text-blue-700 hover:bg-blue-200"
                        >
                          Edit
                        </Link>

                        <form action={deleteCommissionRule}>
                          <input type="hidden" name="id" value={rule.id} />
                          <DeleteRuleButton ruleId={rule.id} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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