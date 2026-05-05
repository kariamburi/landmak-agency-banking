import ActionSubmitButton from "@/app/components/ActionSubmitButton";
import AgentActions from "@/app/components/AgentActions";
import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

async function createAgent(formData: FormData) {
  "use server";

  await adminApiPost("/api/admin/agents", {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    branch_id: Number(formData.get("branch_id") || 0),
    daily_deposit_limit: Number(formData.get("daily_deposit_limit") || 0),
    daily_withdrawal_limit: Number(formData.get("daily_withdrawal_limit") || 0),
    single_transaction_limit: Number(formData.get("single_transaction_limit") || 0),
  });

  revalidatePath("/admin/agency/agents");
}

async function topupFloat(formData: FormData) {
  "use server";

  const agentId = formData.get("agent_id");
  const amount = Number(formData.get("amount") || 0);

  await adminApiPost(`/api/admin/agents/${agentId}/topup`, { amount });

  revalidatePath("/admin/agency/agents");
}
async function resetAgentDevice(formData: FormData) {
  "use server";

  const agentId = formData.get("agent_id");

  await adminApiPost(`/api/admin/agents/${agentId}/reset-device`, {});

  revalidatePath("/admin/agency/agents");
}
async function updateAgentStatus(formData: FormData) {
  "use server";

  const agentId = formData.get("agent_id");
  const status = formData.get("status");

  await adminApiPost(`/api/admin/agents/${agentId}/status`, {
    status,
  });

  revalidatePath("/admin/agency/agents");
}
export default async function AgentsPage() {
  let agents: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agents");
    agents = data.agents || [];
  } catch {
    agents = [];
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: "#0F172A" }}>
            Agents
          </h1>
          <p style={{ marginTop: 8, color: "#64748B", fontSize: 18 }}>
            Register agents, manage float, and monitor cash movement.
          </p>
        </div>

        <div
          style={{
            background: "#0F3D2E",
            color: "white",
            borderRadius: 22,
            padding: "18px 24px",
            minWidth: 190,
          }}
        >
          <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>Total Agents</p>
          <h2 style={{ margin: "6px 0 0", fontSize: 34 }}>{agents.length}</h2>
        </div>
      </div>



      <AgentActions
        agents={agents}
        createAction={createAgent}
        topupAction={topupFloat}
      />


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
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Registered Agents</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 1200, borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                {[
                  "Code",
                  "Name",
                  "Phone",
                  "Email",
                  "Branch",
                  "Status",
                  "Deposit Limit",
                  "Withdrawal Limit",
                  "Single Tx Limit",
                  "Float",
                  "Cash",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th key={h} style={{ padding: 16, textAlign: "left", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {agents.map((a) => (
                <tr key={a.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {a.agent_code}
                  </td>

                  <td style={{ padding: 16, fontWeight: 900, whiteSpace: "nowrap" }}>
                    {a.name}
                  </td>

                  <td style={{ padding: 16, whiteSpace: "nowrap" }}>
                    {a.phone}
                  </td>

                  <td style={{ padding: 16, whiteSpace: "nowrap" }}>
                    {a.email || "-"}
                  </td>

                  <td style={{ padding: 16, whiteSpace: "nowrap" }}>
                    {a.branch_id || "-"}
                  </td>

                  <td style={{ padding: 16 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: a.status === "active" ? "#DCFCE7" : "#FEE2E2",
                        color: a.status === "active" ? "#166534" : "#991B1B",
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {money(a.daily_deposit_limit)}
                  </td>

                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {money(a.daily_withdrawal_limit)}
                  </td>

                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {money(a.single_transaction_limit)}
                  </td>

                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {money(a.available_float)}
                  </td>

                  <td style={{ padding: 16, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {money(a.cash_on_hand)}
                  </td>

                  <td style={{ padding: 16, whiteSpace: "nowrap", color: "#64748B" }}>
                    {a.created_at ? new Date(a.created_at).toLocaleDateString("en-KE") : "-"}
                  </td>
                  <td style={{ padding: 16, whiteSpace: "nowrap" }}>
                    <form action={updateAgentStatus}>
                      <input type="hidden" name="agent_id" value={a.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={a.status === "active" ? "suspended" : "active"}
                      />

                      <button
                        type="submit"
                        style={{
                          border: "none",
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontWeight: 900,
                          cursor: "pointer",
                          background: a.status === "active" ? "#FEE2E2" : "#DCFCE7",
                          color: a.status === "active" ? "#991B1B" : "#166534",
                        }}
                      >
                        {a.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </form>
                    <form action={resetAgentDevice} style={{ marginTop: 8 }}>
                      <input type="hidden" name="agent_id" value={a.id} />

                      <ActionSubmitButton
                        text="Reset Device"
                        loadingText="Resetting..."
                      />
                    </form>
                  </td>
                </tr>
              ))}

              {!agents.length && (
                <tr>
                  <td colSpan={12} style={{ padding: 30, textAlign: "center", color: "#64748B" }}>
                    No agents registered yet.
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