import { adminApiGet } from "@/app/lib/agencyAdminApi";

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

export default async function ReconciliationPage() {
  const date = new Date().toISOString().slice(0, 10);

  let agents: any[] = [];

  try {
    const data = await adminApiGet(`/api/admin/agency/reconciliation?date=${date}`);
    agents = data.agents || [];
  } catch {
    agents = [];
  }

  const totals = agents.reduce(
    (acc, a) => {
      acc.float += Number(a.available_float || 0);
      acc.cash += Number(a.cash_on_hand || 0);
      acc.deposits += Number(a.deposits || 0);
      acc.withdrawals += Number(a.withdrawals || 0);
      acc.loans += Number(a.loan_repayments || 0);
      acc.commissions += Number(a.commissions || 0);
      acc.count += Number(a.transaction_count || 0);
      return acc;
    },
    {
      float: 0,
      cash: 0,
      deposits: 0,
      withdrawals: 0,
      loans: 0,
      commissions: 0,
      count: 0,
    }
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Reconciliation
          </h1>
          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            Daily float, cash, deposits, withdrawals, loan repayments, and commissions.
          </p>
        </div>

        <div style={dateCard}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>Today</p>
          <h2 style={{ margin: "8px 0 0", fontSize: 26 }}>{date}</h2>
        </div>
      </div>

      <div style={summaryGrid}>
        <SummaryCard label="Total Float" value={money(totals.float)} />
        <SummaryCard label="Total Cash" value={money(totals.cash)} />
        <SummaryCard label="Deposits" value={money(totals.deposits)} />
        <SummaryCard label="Withdrawals" value={money(totals.withdrawals)} />
        <SummaryCard label="Loan Repayments" value={money(totals.loans)} />
        <SummaryCard label="Commissions" value={money(totals.commissions)} />
        <SummaryCard label="Transaction Count" value={totals.count} />
      </div>

      <div style={tableCard}>
        <div style={{ padding: 24, borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            Agent Reconciliation
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {[
                  "Agent",
                  "Float",
                  "Cash",
                  "Deposits",
                  "Withdrawals",
                  "Loans",
                  "Commission",
                  "Count",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {agents.map((a) => (
                <tr key={a.agent_id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={{ ...tdStyle, fontWeight: 900 }}>{a.name}</td>
                  <td style={tdBold}>{money(a.available_float)}</td>
                  <td style={tdBold}>{money(a.cash_on_hand)}</td>
                  <td style={tdBold}>{money(a.deposits)}</td>
                  <td style={tdBold}>{money(a.withdrawals)}</td>
                  <td style={tdBold}>{money(a.loan_repayments)}</td>
                  <td style={tdBold}>{money(a.commissions)}</td>
                  <td style={tdStyle}>{a.transaction_count || 0}</td>
                </tr>
              ))}

              {!agents.length && (
                <tr>
                  <td colSpan={8} style={emptyStyle}>
                    No reconciliation data found.
                  </td>
                </tr>
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
    <div style={summaryCard}>
      <p style={summaryLabel}>{label}</p>
      <h2 style={summaryValue}>{value}</h2>
    </div>
  );
}

const dateCard = {
  background: "#0F3D2E",
  color: "white",
  borderRadius: 22,
  padding: "18px 24px",
  minWidth: 190,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 18,
  marginTop: 28,
};

const summaryCard = {
  background: "white",
  border: "1px solid #E2E8F0",
  borderRadius: 22,
  padding: "20px 22px",
  boxShadow: "0 12px 30px rgba(15,61,46,0.06)",
};

const summaryLabel = {
  margin: 0,
  color: "#64748B",
  fontSize: 14,
  fontWeight: 700,
};

const summaryValue = {
  margin: "8px 0 0",
  color: "#0F172A",
  fontSize: 22,
  fontWeight: 900,
};

const tableCard = {
  marginTop: 32,
  background: "white",
  borderRadius: 28,
  border: "1px solid #E2E8F0",
  overflow: "hidden",
  boxShadow: "0 12px 35px rgba(15,61,46,0.08)",
};

const tableStyle = {
  width: "100%",
  minWidth: 950,
  borderCollapse: "collapse" as const,
  fontSize: 15,
};

const thStyle = {
  padding: 16,
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: 16,
  whiteSpace: "nowrap" as const,
};

const tdBold = {
  ...tdStyle,
  fontWeight: 800,
};

const emptyStyle = {
  padding: 40,
  textAlign: "center" as const,
  color: "#64748B",
  fontSize: 16,
};