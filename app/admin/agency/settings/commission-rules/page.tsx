import { agencySettingsGet } from "@/app/lib/agencySettingsApi";
import { deleteCommissionRule } from "./server-actions";
import DeleteRuleButton from "./DeleteRuleButton";

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>
            Commission Rules
          </h1>

          <p style={{ marginTop: 8, color: "#64748B", fontSize: 16 }}>
            Manage how agents earn commissions per transaction type.
          </p>
        </div>

        <a
          href="/admin/agency/settings/commission-rules/new"
          style={{
            background: "#0F3D2E",
            color: "white",
            padding: "14px 18px",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          + Add Rule
        </a>
      </div>

      <div
        style={{
          marginTop: 28,
          background: "white",
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              <th style={th}>Type</th>
              <th style={th}>Min Amount</th>
              <th style={th}>Max Amount</th>
              <th style={th}>Commission</th>
              <th style={th}>Status</th>
              <th style={th}>Created</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rules.map((rule: any) => (
              <tr key={rule.id}>
                <td style={td}>{labelType(rule.transaction_type)}</td>
                <td style={td}>KES {money(rule.min_amount)}</td>
                <td style={td}>KES {money(rule.max_amount)}</td>
                <td style={td}>
                  {rule.commission_type === "percentage"
                    ? `${rule.value}%`
                    : `KES ${money(rule.value)}`}
                </td>
                <td style={td}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 900,
                      background:
                        rule.status === "active"
                          ? "#DCFCE7"
                          : "#FEE2E2",
                      color:
                        rule.status === "active"
                          ? "#166534"
                          : "#991B1B",
                    }}
                  >
                    {rule.status}
                  </span>
                </td>
                <td style={td}>
                  {rule.created_at
                    ? new Date(rule.created_at).toLocaleDateString()
                    : "-"}
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <a
                      href={`/admin/agency/settings/commission-rules/${rule.id}/edit`}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        textDecoration: "none",
                        fontWeight: 900,
                        fontSize: 13,
                      }}
                    >
                      Edit
                    </a>

                    <form action={deleteCommissionRule}>
                      <input type="hidden" name="id" value={rule.id} />
                      <DeleteRuleButton ruleId={rule.id} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {!rules.length && (
              <tr>
                <td style={td} colSpan={6}>
                  No commission rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: 16,
  textAlign: "left",
  fontSize: 13,
  color: "#475569",
  fontWeight: 900,
  borderBottom: "1px solid #E2E8F0",
};

const td: React.CSSProperties = {
  padding: 16,
  borderBottom: "1px solid #E2E8F0",
  color: "#0F172A",
  fontWeight: 700,
};