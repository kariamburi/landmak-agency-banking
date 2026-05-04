import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

function statusStyle(status: string) {
  if (status === "paid") return { background: "#DCFCE7", color: "#166534" };
  if (status === "failed") return { background: "#FEE2E2", color: "#991B1B" };
  return { background: "#FEF3C7", color: "#92400E" };
}

async function payCommission(formData: FormData) {
  "use server";

  await adminApiPost("/api/admin/agency/commission/pay", {
    agentId: Number(formData.get("agentId")),
    date: String(formData.get("date")),
  });

  revalidatePath("/admin/agency/commissions");
}

export default async function CommissionsPage() {
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
      const commission = Number(s.total_commission || 0);

      acc.totalCommission += commission;
      if (s.status === "paid") acc.paidCommission += commission;
      if (s.status !== "paid") acc.pendingCommission += commission;

      return acc;
    },
    {
      totalCommission: 0,
      paidCommission: 0,
      pendingCommission: 0,
    }
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Commissions
          </h1>

          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            Review and pay agent commissions.
          </p>
        </div>

        <div style={dateCard}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>Commission Date</p>
          <h2 style={{ margin: "8px 0 0", fontSize: 26 }}>{date}</h2>
        </div>
      </div>

      <div style={summaryGrid}>
        <SummaryCard label="Commission Records" value={settlements.length} />
        <SummaryCard label="Total Commission" value={money(totals.totalCommission)} />
        <SummaryCard label="Paid Commission" value={money(totals.paidCommission)} />
        <SummaryCard label="Pending Commission" value={money(totals.pendingCommission)} />
      </div>

      <div style={tableCard}>
        <div style={{ padding: 24, borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            Commission Records
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {["Agent", "Date", "Commission", "Status", "Action"].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {settlements.map((s) => {
                const commission = Number(s.total_commission || 0);
                const disabled = s.status === "paid" || commission <= 0;

                return (
                  <tr key={s.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                    <td style={{ ...tdStyle, fontWeight: 900 }}>
                      {s.name || "-"}{" "}
                      <span style={{ color: "#64748B", fontWeight: 700 }}>
                        ({s.agent_code || "-"})
                      </span>
                    </td>

                    <td style={tdStyle}>{s.settlement_date || "-"}</td>

                    <td style={{ ...tdStyle, fontWeight: 900 }}>
                      {money(commission)}
                    </td>

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

                    <td style={tdStyle}>
                      <form action={payCommission}>
                        <input type="hidden" name="agentId" value={s.agent_id} />
                        <input type="hidden" name="date" value={s.settlement_date} />

                        <button
                          type="submit"
                          disabled={disabled}
                          style={{
                            border: "none",
                            borderRadius: 14,
                            padding: "11px 18px",
                            fontWeight: 900,
                            cursor: disabled ? "not-allowed" : "pointer",
                            background: disabled ? "#E2E8F0" : "#0F3D2E",
                            color: disabled ? "#64748B" : "white",
                          }}
                        >
                          {s.status === "paid" ? "Paid" : "Pay"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}

              {!settlements.length && (
                <tr>
                  <td colSpan={5} style={emptyStyle}>
                    No commission records found. Run settlement first.
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
  minWidth: 850,
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

const emptyStyle = {
  padding: 40,
  textAlign: "center" as const,
  color: "#64748B",
  fontSize: 16,
};