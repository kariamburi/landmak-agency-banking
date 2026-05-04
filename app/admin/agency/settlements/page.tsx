import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

function statusStyle(status: string) {
  if (status === "completed" || status === "paid") {
    return { background: "#DCFCE7", color: "#166534" };
  }

  if (status === "failed" || status === "cancelled") {
    return { background: "#FEE2E2", color: "#991B1B" };
  }

  return { background: "#FEF3C7", color: "#92400E" };
}

async function runSettlement(formData: FormData) {
  "use server";

  const date = String(formData.get("date") || "");
  await adminApiPost(`/api/admin/agency/settlement/run?date=${date}`);

  revalidatePath("/admin/agency/settlements");
}

export default async function SettlementsPage() {
  const date = new Date().toISOString().slice(0, 10);

  let settlements: any[] = [];

  try {
    const data = await adminApiGet(`/api/admin/agency/settlements?date=${date}`);
    settlements = data.settlements || [];
  } catch {
    settlements = [];
  }

  const totals = settlements.reduce(
    (acc, s) => {
      acc.deposits += Number(s.total_deposits || 0);
      acc.withdrawals += Number(s.total_withdrawals || 0);
      acc.loans += Number(s.total_loan_repayments || 0);
      acc.commission += Number(s.total_commission || 0);
      acc.expectedCash += Number(s.expected_cash || 0);
      return acc;
    },
    {
      deposits: 0,
      withdrawals: 0,
      loans: 0,
      commission: 0,
      expectedCash: 0,
    }
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Settlements
          </h1>

          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            Generate and review daily agent settlements.
          </p>
        </div>

        <div style={dateCard}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>Settlement Date</p>
          <h2 style={{ margin: "8px 0 0", fontSize: 26 }}>{date}</h2>
        </div>
      </div>

      <form action={runSettlement} style={runCard}>
        <div>
          <label style={labelStyle}>Select settlement date</label>
          <input name="date" type="date" defaultValue={date} style={inputStyle} />
        </div>

        <button type="submit" style={primaryButton}>
          Run Settlement
        </button>
      </form>

      <div style={summaryGrid}>
        <SummaryCard label="Total Settlements" value={settlements.length} />
        <SummaryCard label="Deposits" value={money(totals.deposits)} />
        <SummaryCard label="Withdrawals" value={money(totals.withdrawals)} />
        <SummaryCard label="Loan Repayments" value={money(totals.loans)} />
        <SummaryCard label="Commission" value={money(totals.commission)} />
        <SummaryCard label="Expected Cash" value={money(totals.expectedCash)} />
      </div>

      <div style={tableCard}>
        <div style={{ padding: 24, borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            Settlement Records
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {[
                  "Date",
                  "Agent",
                  "Deposits",
                  "Withdrawals",
                  "Loan Repayments",
                  "Commission",
                  "Expected Cash",
                  "Status",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {settlements.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={tdStyle}>{s.settlement_date || "-"}</td>

                  <td style={{ ...tdStyle, fontWeight: 900 }}>
                    {s.name || "-"}{" "}
                    <span style={{ color: "#64748B", fontWeight: 700 }}>
                      ({s.agent_code || "-"})
                    </span>
                  </td>

                  <td style={tdBold}>{money(s.total_deposits)}</td>
                  <td style={tdBold}>{money(s.total_withdrawals)}</td>
                  <td style={tdBold}>{money(s.total_loan_repayments)}</td>
                  <td style={tdBold}>{money(s.total_commission)}</td>
                  <td style={tdBold}>{money(s.expected_cash)}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        ...statusStyle(s.status),
                      }}
                    >
                      {s.status || "-"}
                    </span>
                  </td>
                </tr>
              ))}

              {!settlements.length && (
                <tr>
                  <td colSpan={8} style={emptyStyle}>
                    No settlements found. Run settlement first.
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
  minWidth: 230,
};

const runCard = {
  marginTop: 28,
  background: "white",
  border: "1px solid #E2E8F0",
  borderRadius: 24,
  padding: 22,
  display: "flex",
  alignItems: "end",
  gap: 16,
  boxShadow: "0 12px 30px rgba(15,61,46,0.06)",
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  color: "#334155",
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle = {
  width: 260,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #CBD5E1",
  background: "#F8FAFC",
  outline: "none",
  fontSize: 15,
};

const primaryButton = {
  border: "none",
  borderRadius: 16,
  padding: "15px 22px",
  background: "#0F3D2E",
  color: "white",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
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
  minWidth: 1050,
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