import Link from "next/link";
import { createCommissionRule } from "../server-actions";

export default function NewCommissionRulePage() {
  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">
          Agency Settings
        </p>

        <h1 className="mt-1 text-3xl text-slate-900">
          Add Commission Rule
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a commission rule for deposits, withdrawals, or loan repayments.
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
        action={createCommissionRule}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Commission Rule Details
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Transaction Type">
            <select name="transaction_type" required className={inputClass}>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="loan_repayment">Loan Repayment</option>
            </select>
          </Field>

          <Field label="Commission Type">
            <select name="commission_type" required className={inputClass}>
              <option value="flat">Flat Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </Field>

          <Field label="Min Amount">
            <input
              name="min_amount"
              type="number"
              defaultValue="1"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Max Amount">
            <input
              name="max_amount"
              type="number"
              defaultValue="999999999"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Commission Value">
            <input
              name="value"
              type="number"
              defaultValue="10"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Status">
            <select name="status" required className={inputClass}>
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
            Save Rule
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