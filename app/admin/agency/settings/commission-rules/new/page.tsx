
import Link from "next/link";
import { createCommissionRule } from "../server-actions";


export default function NewCommissionRulePage() {
  return (
    <div>
      <Link
        href="/admin/agency/settings/commission-rules"
        style={{ color: "#0F3D2E", fontWeight: 900, textDecoration: "none" }}
      >
        ← Back to Commission Rules
      </Link>

      <h1 style={{ marginTop: 24, fontSize: 34, fontWeight: 900 }}>
        Add Commission Rule
      </h1>

      <form
        action={createCommissionRule}
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
        <label style={label}>
          Transaction Type
          <select name="transaction_type" required style={input}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="loan_repayment">Loan Repayment</option>
          </select>
        </label>

        <label style={label}>
          Commission Type
          <select name="commission_type" required style={input}>
            <option value="flat">Flat Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </label>

        <label style={label}>
          Min Amount
          <input name="min_amount" type="number" defaultValue="1" required style={input} />
        </label>

        <label style={label}>
          Max Amount
          <input name="max_amount" type="number" defaultValue="999999999" required style={input} />
        </label>

        <label style={label}>
          Commission Value
          <input name="value" type="number" defaultValue="10" required style={input} />
        </label>

        <label style={label}>
          Status
          <select name="status" required style={input}>
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
          Save Rule
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