import { adminApiGet } from "@/app/lib/agencyAdminApi";
import Link from "next/link";
const PAGE_SIZE = 10;
function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

export default async function ReconciliationPage({
  searchParams,
}: {
  searchParams?: Promise<{
    date?: string;
    agent?: string;
  }>;
}) {
  const params: any = await searchParams;

  const date = params?.date || new Date().toISOString().slice(0, 10);
  const agent = String(params?.agent || "").trim().toLowerCase();

  let agents: any[] = [];

  try {
    const data = await adminApiGet(
      `/api/admin/agency/reconciliation?date=${date}`
    );
    agents = data.agents || [];
  } catch {
    agents = [];
  }

  const currentPage = Math.max(
    Number(params?.page || 1),
    1
  );

  const filteredAgents = agents.filter((a: any) => {
    const name = String(a.name || "").toLowerCase();
    const code = String(a.agent_code || "").toLowerCase();

    return !agent || name.includes(agent) || code.includes(agent);
  });

  const total = filteredAgents.length;

  const totalPages = Math.max(
    Math.ceil(total / PAGE_SIZE),
    1
  );

  const safePage = Math.min(currentPage, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;

  const paginatedAgents = filteredAgents.slice(
    start,
    start + PAGE_SIZE
  );

  const totals = filteredAgents.reduce(
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
  const query = new URLSearchParams();

  if (date) query.set("date", date);

  if (agent) query.set("agent", agent);

  const prevQuery = new URLSearchParams(query);

  prevQuery.set(
    "page",
    String(Math.max(safePage - 1, 1))
  );

  const nextQuery = new URLSearchParams(query);

  nextQuery.set(
    "page",
    String(Math.min(safePage + 1, totalPages))
  );
  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">Agency Banking</p>
        <h1 className="mt-1 text-3xl text-slate-900">Reconciliation</h1>
      </div>

      <form
        action="/admin/agency/reconciliation"
        className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Search Reconciliation
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[180px_minmax(0,1fr)_auto]">
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          />

          <input
            name="agent"
            defaultValue={params?.agent || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Agent name / code"
          />

          <div className="flex min-w-0 gap-2">
            <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
              Search
            </button>

            <Link
              href="/admin/agency/reconciliation"
              className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Float" value={money(totals.float)} />
        <SummaryCard label="Total Cash" value={money(totals.cash)} />
        <SummaryCard label="Deposits" value={money(totals.deposits)} />
        <SummaryCard label="Withdrawals" value={money(totals.withdrawals)} />
        <SummaryCard label="Loan Repayments" value={money(totals.loans)} />
        <SummaryCard label="Commissions" value={money(totals.commissions)} />
        <SummaryCard label="Transaction Count" value={totals.count} />
        <SummaryCard label="Report Date" value={date} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <button className="cursor-pointer text-sm font-semibold text-[#008A3D]">
            Export ⌄
          </button>

          <p className="text-sm text-slate-500">
            Total {total} • Page {safePage} of {totalPages}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Agent
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Float
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Cash
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Deposits
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Withdrawals
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Loans
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Commission
                </th>
                <th className="px-2 py-2 text-right font-bold">
                  Count
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedAgents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    No reconciliation data found.
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((a: any) => (
                  <tr key={a.agent_id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {a.name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                      {money(a.available_float)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                      {money(a.cash_on_hand)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      {money(a.deposits)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      {money(a.withdrawals)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      {money(a.loan_repayments)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      {money(a.commissions)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-right">
                      {a.transaction_count || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
        <span className="text-slate-600">
          Total {total}
        </span>

        <Link
          href={`/admin/agency/reconciliation?${prevQuery.toString()}`}
          className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1
            ? "pointer-events-none opacity-40"
            : ""
            }`}
        >
          Prev
        </Link>

        <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
          {safePage}
        </span>

        <Link
          href={`/admin/agency/reconciliation?${nextQuery.toString()}`}
          className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages
            ? "pointer-events-none opacity-40"
            : ""
            }`}
        >
          Next
        </Link>
      </div>
    </div>

  );
}

function SummaryCard({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
      <p className="text-sm font-semibold text-white/70">{label}</p>
      <h2 className="mt-2 text-xl font-black">{value}</h2>
    </div>
  );
}