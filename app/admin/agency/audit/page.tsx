import { adminApiGet } from "@/app/lib/agencyAdminApi";

function formatDate(v: any) {
  if (!v) return "—";
  return new Date(v).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function badge(value: any) {
  if (!value) return <span style={{ color: "#94A3B8" }}>—</span>;

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        background: "#F1F5F9",
        color: "#334155",
        fontWeight: 900,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

export default async function AuditLogsPage() {
  let logs: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agency/audit-logs");
    logs = data.logs || [];
  } catch {
    logs = [];
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Audit Logs
          </h1>

          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            Track admin actions, reversals, payouts, status changes, and sensitive system activities.
          </p>
        </div>

        <div style={topCard}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>Total Logs</p>
          <h2 style={{ margin: "8px 0 0", fontSize: 34 }}>{logs.length}</h2>
        </div>
      </div>

      <div style={summaryGrid}>
        <SummaryCard label="Latest Action" value={logs[0]?.action || "—"} />
        <SummaryCard label="Last Updated" value={logs[0]?.created_at ? formatDate(logs[0].created_at) : "—"} />
        <SummaryCard label="Tracked Records" value={logs.length} />
      </div>

      <div style={tableCard}>
        <div style={{ padding: 24, borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            Activity History
          </h2>
          <p style={{ margin: "6px 0 0", color: "#64748B" }}>
            Every sensitive action should appear here for accountability.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {["Date", "Action", "Agent", "Entity", "Status Change", "Reason"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {logs.map((l) => (
                <tr key={l.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={tdStyle}>{formatDate(l.created_at)}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "#FEF3C7",
                        color: "#92400E",
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.action || "—"}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, fontWeight: 900 }}>
                    {l.agent_name || l.agent_id || "—"}
                  </td>

                  <td style={tdStyle}>
                    <strong>{l.entity_type || "Entity"}</strong> #{l.entity_id || "—"}
                  </td>

                  <td style={tdStyle}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {badge(l.old_status)}
                      <span style={{ color: "#94A3B8" }}>→</span>
                      {badge(l.new_status)}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, color: "#64748B" }}>
                    {l.reason || "—"}
                  </td>
                </tr>
              ))}

              {!logs.length && (
                <tr>
                  <td colSpan={6} style={emptyStyle}>
                    <div style={{ fontSize: 34 }}>🧾</div>
                    <h3 style={{ margin: "10px 0 4px", fontSize: 20, color: "#0F172A" }}>
                      No audit logs found
                    </h3>
                    <p style={{ margin: 0 }}>
                      Admin actions, reversals, payouts, and sensitive changes will appear here.
                    </p>
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

const topCard = {
  background: "#0F3D2E",
  color: "white",
  borderRadius: 22,
  padding: "18px 24px",
  minWidth: 190,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  minWidth: 1000,
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
  padding: 44,
  textAlign: "center" as const,
  color: "#64748B",
  fontSize: 16,
};