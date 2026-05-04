import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

function statusStyle(status: string) {
  if (status === "success") {
    return { background: "#DCFCE7", color: "#166534" };
  }

  if (status === "reversed" || status === "failed") {
    return { background: "#FEE2E2", color: "#991B1B" };
  }

  return { background: "#FEF3C7", color: "#92400E" };
}

async function reverseTransaction(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const reason = String(formData.get("reason") || "Admin reversal");

  await adminApiPost(`/api/admin/agency/transactions/${id}/reverse`, {
    reason,
  });

  revalidatePath("/admin/agency/transactions");
}

export default async function TransactionsPage() {
  let transactions: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agency-transactions");
    transactions = data.transactions || [];
  } catch {
    transactions = [];
  }

  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalCommission = transactions.reduce(
    (sum, t) => sum + Number(t.commission_amount || 0),
    0
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Agency Transactions
          </h1>

          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            View deposits, withdrawals, loan repayments, receipts, and reversals.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
          gap: 18,
          marginTop: 28,
        }}
      >
        <div style={cardStyle}>
          <p style={cardLabel}>Total Transactions</p>
          <h2 style={cardValue}>{transactions.length}</h2>
        </div>

        <div style={cardStyle}>
          <p style={cardLabel}>Total Amount</p>
          <h2 style={cardValue}>{money(totalAmount)}</h2>
        </div>

        <div style={cardStyle}>
          <p style={cardLabel}>Total Commission</p>
          <h2 style={cardValue}>{money(totalCommission)}</h2>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          background: "white",
          borderRadius: 28,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 12px 35px rgba(15,61,46,0.08)",
        }}
      >
        <div style={{ padding: 24, borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            Transaction Records
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 1100,
              borderCollapse: "collapse",
              fontSize: 15,
            }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {[
                  "Date",
                  "Agent",
                  "Type",
                  "Amount",
                  "Commission",
                  "Status",
                  "Receipt",
                  "Action",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={tdStyle}>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString("en-KE")
                      : "-"}
                  </td>

                  <td style={{ ...tdStyle, fontWeight: 900 }}>
                    {t.agent_name || "-"}
                  </td>

                  <td style={tdStyle}>
                    {String(t.transaction_type || "-").replaceAll("_", " ")}
                  </td>

                  <td style={{ ...tdStyle, fontWeight: 900 }}>
                    {money(t.amount)}
                  </td>

                  <td style={{ ...tdStyle, fontWeight: 800 }}>
                    {money(t.commission_amount)}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        ...statusStyle(t.status),
                      }}
                    >
                      {t.status || "-"}
                    </span>
                  </td>

                  <td style={tdStyle}>{t.receipt_no || t.reference || "-"}</td>

                  <td style={tdStyle}>
                    {t.status === "success" ? (
                      <form
                        action={reverseTransaction}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <input type="hidden" name="id" value={t.id} />

                        <input
                          name="reason"
                          placeholder="Reason"
                          required
                          style={{
                            width: 150,
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #CBD5E1",
                            outline: "none",
                          }}
                        />

                        <button
                          type="submit"
                          style={{
                            border: "none",
                            borderRadius: 12,
                            padding: "10px 14px",
                            fontWeight: 900,
                            cursor: "pointer",
                            background: "#FEE2E2",
                            color: "#991B1B",
                          }}
                        >
                          Reverse
                        </button>
                      </form>
                    ) : (
                      <span style={{ color: "#94A3B8" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}

              {!transactions.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: 16,
                    }}
                  >
                    No transactions found.
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

const cardStyle = {
  background: "#0F3D2E",
  color: "white",
  borderRadius: 22,
  padding: "20px 24px",
  boxShadow: "0 12px 30px rgba(15,61,46,0.15)",
};

const cardLabel = {
  margin: 0,
  color: "rgba(255,255,255,.7)",
  fontSize: 15,
};

const cardValue = {
  margin: "8px 0 0",
  fontSize: 28,
  fontWeight: 900,
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