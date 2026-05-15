import { agencySettingsGet } from "@/app/lib/agencySettingsApi";
import Link from "next/link";
import { updateCommissionRule } from "../../server-actions";

export default async function EditCommissionRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await agencySettingsGet(
    "/api/admin/agency/settings/commission-rules"
  );

  const rule = data.rules?.find((r: any) => String(r.id) === String(id));

  if (!rule) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-red-700">
          Commission rule not found.
        </p>

        <Link
          href="/admin/agency/settings/commission-rules"
          className="mt-4 inline-flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
        >
          ← Back to Commission Rules
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">
          Agency Settings
        </p>

        <h1 className="mt-1 text-3xl text-slate-900">
          Edit Commission Rule
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update commission rule details, amount range, commission value, and status.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Link
          href="/admin/agency/settings/commission-rules"
          className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
        >
          ← Back to Commission Rules
        </Link>
      </div>

      <form
        action={updateCommissionRule}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <input type="hidden" name="id" value={rule.id} />

        <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Commission Rule Details
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Transaction Type">
            <select
              name="transaction_type"
              defaultValue={rule.transaction_type}
              required
              className={inputClass}
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="loan_repayment">Loan Repayment</option>
            </select>
          </Field>

          <Field label="Commission Type">
            <select
              name="commission_type"
              defaultValue={rule.commission_type}
              required
              className={inputClass}
            >
              <option value="flat">Flat Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </Field>

          <Field label="Min Amount">
            <input
              name="min_amount"
              type="number"
              defaultValue={rule.min_amount}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Max Amount">
            <input
              name="max_amount"
              type="number"
              defaultValue={rule.max_amount}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Commission Value">
            <input
              name="value"
              type="number"
              defaultValue={rule.value}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Status">
            <select
              name="status"
              defaultValue={rule.status}
              required
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 flex justify-end border-t pt-4">
          <button
            type="submit"
            className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]"
          >
            Update Rule
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]";