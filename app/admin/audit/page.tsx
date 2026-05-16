import ExportAuditLogsButton from "@/app/components/ExportAuditLogsButton";
import { adminApiGet } from "@/app/lib/agencyAdminApi";
import Link from "next/link";

const PAGE_SIZE = 10;

function formatDate(v: any) {
  if (!v) return "—";

  return new Date(v).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    action?: string;
    agent?: string;
    entity?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params?.page || 1), 1);
  const action = String(params?.action || "").trim().toLowerCase();
  const agent = String(params?.agent || "").trim().toLowerCase();
  const entity = String(params?.entity || "").trim().toLowerCase();
  const from = String(params?.from || "").trim();
  const to = String(params?.to || "").trim();

  let logs: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agency/audit-logs");
    logs = data.logs || [];
  } catch {
    logs = [];
  }

  const filteredLogs = logs.filter((l: any) => {
    const logAction = String(l.action || "").toLowerCase();
    const logAgent = String(l.agent_name || l.agent_id || "").toLowerCase();
    const logEntity = String(l.entity_type || l.entity_id || "").toLowerCase();

    const logDate = l.created_at ? new Date(l.created_at) : null;
    const fromDate = from ? new Date(`${from}T00:00:00`) : null;
    const toDate = to ? new Date(`${to}T23:59:59`) : null;

    return (
      (!action || logAction.includes(action)) &&
      (!agent || logAgent.includes(agent)) &&
      (!entity || logEntity.includes(entity)) &&
      (!fromDate || (logDate && logDate >= fromDate)) &&
      (!toDate || (logDate && logDate <= toDate))
    );
  });

  const total = filteredLogs.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(start, start + PAGE_SIZE);

  const query = new URLSearchParams();

  if (action) query.set("action", action);
  if (agent) query.set("agent", agent);
  if (entity) query.set("entity", entity);
  if (from) query.set("from", from);
  if (to) query.set("to", to);

  const prevQuery = new URLSearchParams(query);
  prevQuery.set("page", String(Math.max(safePage - 1, 1)));

  const nextQuery = new URLSearchParams(query);
  nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">Agency Banking</p>
        <h1 className="mt-1 text-3xl text-slate-900">Audit Logs</h1>
      </div>

      <form
        action="/admin/agency/audit"
        className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Search Audit Logs
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_150px_150px_150px_auto]">
          <input
            name="action"
            defaultValue={params?.action || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Action"
          />

          <input
            name="agent"
            defaultValue={params?.agent || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Agent / Admin"
          />

          <input
            name="entity"
            defaultValue={params?.entity || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Entity"
          />

          <input
            type="date"
            name="from"
            defaultValue={params?.from || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          />

          <input
            type="date"
            name="to"
            defaultValue={params?.to || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          />

          <div className="flex min-w-0 gap-2">
            <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
              Search
            </button>

            <Link
              href="/admin/agency/audit"
              className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Logs" value={total} />
        <SummaryCard label="Latest Action" value={filteredLogs[0]?.action || "—"} />
        <SummaryCard
          label="Last Updated"
          value={
            filteredLogs[0]?.created_at
              ? formatDate(filteredLogs[0].created_at)
              : "—"
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <ExportAuditLogsButton
            logs={filteredLogs}
          />

          <p className="text-sm text-slate-500">
            Total {total} • Page {safePage} of {totalPages}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Date
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Action
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Agent
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Entity
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Status Change
                </th>
                <th className="px-2 py-2 text-left font-bold">
                  Reason
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((l: any) => (
                  <tr key={l.id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                      {formatDate(l.created_at)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <span className="rounded-full bg-yellow-100 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide text-yellow-700">
                        {l.action || "—"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {l.agent_name || l.agent_id || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <span className="font-semibold">
                        {l.entity_type || "Entity"}
                      </span>{" "}
                      #{l.entity_id || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge value={l.old_status} />
                        <span className="text-slate-400">→</span>
                        <StatusBadge value={l.new_status} />
                      </div>
                    </td>

                    <td className="min-w-[260px] px-2 py-2 text-slate-600">
                      {l.reason || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
          <span className="text-slate-600">Total {total}</span>

          <Link
            href={`/admin/agency/audit?${prevQuery.toString()}`}
            className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
              }`}
          >
            Prev
          </Link>

          <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
            {safePage}
          </span>

          <Link
            href={`/admin/agency/audit?${nextQuery.toString()}`}
            className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages ? "pointer-events-none opacity-40" : ""
              }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: any) {
  if (!value) {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide text-slate-700">
      {value}
    </span>
  );
}

function SummaryCard({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
      <p className="text-sm font-semibold text-white/70">{label}</p>
      <h2 className="mt-2 text-xl font-black break-words">{value}</h2>
    </div>
  );
}