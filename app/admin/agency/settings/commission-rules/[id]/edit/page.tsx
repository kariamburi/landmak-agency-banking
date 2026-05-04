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
    return <p>Commission rule not found.</p>;
  }

  return (
    <div>
      <Link
        href="/admin/agency/settings/commission-rules"
        style={{ color: "#0F3D2E", fontWeight: 900, textDecoration: "none" }}
      >
        ← Back to Commission Rules
      </Link>

      <h1 style={{ marginTop: 24, fontSize: 34, fontWeight: 900 }}>
        Edit Commission Rule
      </h1>

      <form
        action={updateCommissionRule}
        style={{
          marginTop: 28,
          maxWidth: 620,
          background: "white",
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          padding: 24,
          display: "grid",
          gap: 18,
        }}
      >
        <input type="hidden" name="id" value={rule.id} />

        <label style={label}>
          Transaction Type
          <select name="transaction_type" defaultValue={rule.transaction_type} required style={input}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="loan_repayment">Loan Repayment</option>
          </select>
        </label>

        <label style={label}>
          Commission Type
          <select name="commission_type" defaultValue={rule.commission_type} required style={input}>
            <option value="flat">Flat Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </label>

        <label style={label}>
          Min Amount
          <input name="min_amount" type="number" defaultValue={rule.min_amount} required style={input} />
        </label>

        <label style={label}>
          Max Amount
          <input name="max_amount" type="number" defaultValue={rule.max_amount} required style={input} />
        </label>

        <label style={label}>
          Commission Value
          <input name="value" type="number" defaultValue={rule.value} required style={input} />
        </label>

        <label style={label}>
          Status
          <select name="status" defaultValue={rule.status} required style={input}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: 14,
            padding: "14px 18px",
            background: "#0F3D2E",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Update Rule
        </button>
      </form>
    </div>
  );
}

const label: React.CSSProperties = {
  display: "grid",
  gap: 8,
  fontWeight: 900,
  color: "#0F172A",
};

const input: React.CSSProperties = {
  padding: "13px 14px",
  border: "1px solid #CBD5E1",
  borderRadius: 12,
  fontSize: 15,
};