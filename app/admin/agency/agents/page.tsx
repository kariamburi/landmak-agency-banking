import ActionSubmitButton from "@/app/components/ActionSubmitButton";
import AgentActions from "@/app/components/AgentActions";
import ExportAgentsButton from "@/app/components/ExportAgentsButton";
import ExportAgentTopupsButton from "@/app/components/ExportAgentTopupsButton";
import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const PAGE_SIZE = 10;

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

  await adminApiPost(`/api/admin/agents/${agentId}/topup`, {
    amount,
    method: formData.get("method"),
    reference: formData.get("reference"),
    reason: formData.get("reason"),
  });

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

  await adminApiPost(`/api/admin/agents/${agentId}/status`, { status });

  revalidatePath("/admin/agency/agents");
}

export default async function AgentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    name?: string;
    phone?: string;
    code?: string;
    status?: string;
    topupAgent?: string;
    topupFrom?: string;
    topupTo?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params?.page || 1), 1);
  const name = String(params?.name || "").trim().toLowerCase();
  const phone = String(params?.phone || "").trim();
  const code = String(params?.code || "").trim().toLowerCase();
  const status = String(params?.status || "").trim().toLowerCase();

  const topupAgent = String(params?.topupAgent || "").trim();
  const topupFrom = String(params?.topupFrom || "").trim();
  const topupTo = String(params?.topupTo || "").trim();

  let agents: any[] = [];
  let topups: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agents");
    agents = data.agents || [];
  } catch {
    agents = [];
  }

  try {
    const q = new URLSearchParams();

    if (topupAgent) q.set("agentId", topupAgent);
    if (topupFrom) q.set("from", topupFrom);
    if (topupTo) q.set("to", topupTo);

    const data = await adminApiGet(`/api/admin/agents/topups?${q.toString()}`);
    topups = data.topups || [];
  } catch {
    topups = [];
  }

  const filteredAgents = agents.filter((a: any) => {
    const agentName = String(a.name || "").toLowerCase();
    const agentPhone = String(a.phone || "");
    const agentCode = String(a.agent_code || "").toLowerCase();
    const agentStatus = String(a.status || "").toLowerCase();

    return (
      (!name || agentName.includes(name)) &&
      (!phone || agentPhone.includes(phone)) &&
      (!code || agentCode.includes(code)) &&
      (!status || agentStatus === status)
    );
  });

  const total = filteredAgents.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedAgents = filteredAgents.slice(start, start + PAGE_SIZE);

  const query = new URLSearchParams();
  if (name) query.set("name", name);
  if (phone) query.set("phone", phone);
  if (code) query.set("code", code);
  if (status) query.set("status", status);

  const prevQuery = new URLSearchParams(query);
  prevQuery.set("page", String(Math.max(safePage - 1, 1)));

  const nextQuery = new URLSearchParams(query);
  nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">Agency Banking</p>
        <h1 className="mt-1 text-3xl text-slate-900">Agent Registry</h1>
      </div>

      <form
        action="/admin/agency/agents"
        className="rounded-b-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 border-b border-slate-500 bg-slate-100 px-4 py-2 font-black text-slate-800">
          Search Agents
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <input name="name" defaultValue={params?.name || ""} className="rounded-md border px-3 py-2" placeholder="Search name" />
          <input name="code" defaultValue={params?.code || ""} className="rounded-md border px-3 py-2" placeholder="Agent code" />
          <input name="phone" defaultValue={params?.phone || ""} className="rounded-md border px-3 py-2" placeholder="2547..." />

          <select name="status" defaultValue={params?.status || ""} className="rounded-md border px-3 py-2">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="flex gap-2">
            <button className="rounded-md bg-[#0F3D2E] px-5 py-2 font-black text-white">Search</button>
            <Link href="/admin/agency/agents" className="rounded-md border px-5 py-2 font-black">Reset</Link>
          </div>
        </div>
      </form>

      <AgentActions agents={agents} createAction={createAgent} topupAction={topupFloat} />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <ExportAgentsButton agents={filteredAgents} />
          <p className="text-sm text-slate-500">Total {total} • Page {safePage} of {totalPages}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                {["Code", "Name", "Phone", "Email", "Branch", "Status", "Deposit Limit", "Withdrawal Limit", "Single Tx Limit", "Float", "Cash", "Created", "Operation"].map((h) => (
                  <th key={h} className="border-r border-slate-200 px-2 py-2 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedAgents.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-5 py-8 text-center text-slate-500">No agents found.</td>
                </tr>
              ) : (
                paginatedAgents.map((a: any) => (
                  <tr key={a.id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">{a.agent_code}</td>
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">{a.name}</td>
                    <td className="whitespace-nowrap px-2 py-2">{a.phone}</td>
                    <td className="whitespace-nowrap px-2 py-2">{a.email || "-"}</td>
                    <td className="whitespace-nowrap px-2 py-2">{a.branch_id || "-"}</td>
                    <td className="whitespace-nowrap px-2 py-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${a.status === "active" ? "bg-[#0F3D2E]/10 text-[#0F3D2E]" : "bg-red-100 text-red-700"}`}>
                        {a.status || "unknown"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">{money(a.daily_deposit_limit)}</td>
                    <td className="whitespace-nowrap px-2 py-2">{money(a.daily_withdrawal_limit)}</td>
                    <td className="whitespace-nowrap px-2 py-2">{money(a.single_transaction_limit)}</td>
                    <td className="whitespace-nowrap px-2 py-2">{money(a.available_float)}</td>
                    <td className="whitespace-nowrap px-2 py-2">{money(a.cash_on_hand)}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-500">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString("en-KE") : "-"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">
                      <div className="flex items-center gap-2">
                        <form action={updateAgentStatus}>
                          <input type="hidden" name="agent_id" value={a.id} />
                          <input type="hidden" name="status" value={a.status === "active" ? "suspended" : "active"} />
                          <button type="submit" className={`rounded px-3 py-1.5 text-[12px] font-bold ${a.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {a.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        </form>

                        <form action={resetAgentDevice}>
                          <input type="hidden" name="agent_id" value={a.id} />
                          <ActionSubmitButton text="Reset" loadingText="..." />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
          <span className="text-slate-600">Total {total}</span>

          <Link href={`/admin/agency/agents?${prevQuery.toString()}`} className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""}`}>
            Prev
          </Link>

          <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">{safePage}</span>

          <Link href={`/admin/agency/agents?${nextQuery.toString()}`} className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages ? "pointer-events-none opacity-40" : ""}`}>
            Next
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Float Top-up History</h2>
            <p className="text-sm text-slate-500">Track agent-funded float top-ups.</p>
          </div>

          <ExportAgentTopupsButton topups={topups} />
        </div>

        <form action="/admin/agency/agents" className="mb-4 grid gap-3 md:grid-cols-5">
          <select name="topupAgent" defaultValue={topupAgent} className="rounded-md border px-3 py-2">
            <option value="">All Agents</option>
            {agents.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name} - {a.agent_code}
              </option>
            ))}
          </select>

          <input type="date" name="topupFrom" defaultValue={topupFrom} className="rounded-md border px-3 py-2" />
          <input type="date" name="topupTo" defaultValue={topupTo} className="rounded-md border px-3 py-2" />

          <button className="rounded-md bg-[#0F3D2E] px-5 py-2 font-black text-white">Filter</button>

          <Link href="/admin/agency/agents" className="rounded-md border px-5 py-2 text-center font-black">
            Reset
          </Link>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="px-2 py-2 text-left">Date</th>
                <th className="px-2 py-2 text-left">Agent</th>
                <th className="px-2 py-2 text-left">Phone</th>
                <th className="px-2 py-2 text-right">Amount</th>
                <th className="px-2 py-2 text-left">Method</th>
                <th className="px-2 py-2 text-left">Reference</th>
                <th className="px-2 py-2 text-left">Reason</th>
                <th className="px-2 py-2 text-left">Admin</th>
              </tr>
            </thead>

            <tbody>
              {topups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    No float top-ups found.
                  </td>
                </tr>
              ) : (
                topups.map((t: any) => (
                  <tr key={t.id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2">
                      {t.created_at ? new Date(t.created_at).toLocaleString("en-KE") : "-"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {t.agent_name || "-"} - {t.agent_code || "-"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">{t.phone || "-"}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-right font-black text-[#0F3D2E]">
                      {money(t.amount)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">{t.method || "-"}</td>
                    <td className="whitespace-nowrap px-2 py-2">{t.reference || "-"}</td>
                    <td className="px-2 py-2">{t.reason || "-"}</td>
                    <td className="whitespace-nowrap px-2 py-2">{t.admin_id || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}