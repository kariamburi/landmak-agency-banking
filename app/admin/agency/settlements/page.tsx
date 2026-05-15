import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const PAGE_SIZE = 10;

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
}

async function runSettlement(formData: FormData) {
  "use server";

  const date = String(formData.get("date") || "");
  await adminApiPost(`/api/admin/agency/settlement/run?date=${date}`);

  revalidatePath("/admin/agency/settlements");
}

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    date?: string;
    agent?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params?.page || 1), 1);
  const date = params?.date || new Date().toISOString().slice(0, 10);
  const agent = String(params?.agent || "").trim().toLowerCase();
  const status = String(params?.status || "").trim().toLowerCase();

  let settlements: any[] = [];

  try {
    const data = await adminApiGet(
      `/api/admin/agency/settlements?date=${date}`
    );
    settlements = data.settlements || [];
  } catch {
    settlements = [];
  }

  const filteredSettlements = settlements.filter((s: any) => {
    const agentName = String(s.name || "").toLowerCase();
    const agentCode = String(s.agent_code || "").toLowerCase();
    const settlementStatus = String(s.status || "").toLowerCase();

    return (
      (!agent || agentName.includes(agent) || agentCode.includes(agent)) &&
      (!status || settlementStatus === status)
    );
  });

  const total = filteredSettlements.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedSettlements = filteredSettlements.slice(
    start,
    start + PAGE_SIZE
  );

  const totals = filteredSettlements.reduce(
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

  const query = new URLSearchParams();

  if (date) query.set("date", date);
  if (agent) query.set("agent", agent);
  if (status) query.set("status", status);

  const prevQuery = new URLSearchParams(query);
  prevQuery.set("page", String(Math.max(safePage - 1, 1)));

  const nextQuery = new URLSearchParams(query);
  nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">Agency Banking</p>
        <h1 className="mt-1 text-3xl text-slate-900">Settlements</h1>
      </div>

      <form
        action="/admin/agency/settlements"
        className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Search Settlements
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[170px_minmax(0,1fr)_150px_auto]">
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

          <select
            name="status"
            defaultValue={params?.status || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex min-w-0 gap-2">
            <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
              Search
            </button>

            <Link
              href="/admin/agency/settlements"
              className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <form
        action={runSettlement}
        className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <div>
          <label className="mb-2 block text-sm font-black text-slate-700">
            Run settlement date
          </label>

          <input
            name="date"
            type="date"
            defaultValue={date}
            className="h-10 w-[180px] rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          />
        </div>

        <button
          type="submit"
          className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]"
        >
          Run Settlement
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Settlements" value={total} />
        <SummaryCard label="Deposits" value={money(totals.deposits)} />
        <SummaryCard label="Withdrawals" value={money(totals.withdrawals)} />
        <SummaryCard label="Loan Repayments" value={money(totals.loans)} />
        <SummaryCard label="Commission" value={money(totals.commission)} />
        <SummaryCard label="Expected Cash" value={money(totals.expectedCash)} />
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
          <table className="w-full min-w-[1050px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Date
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Agent
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Deposits
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Withdrawals
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Loan Repayments
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Commission
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-right font-bold">
                  Expected Cash
                </th>
                <th className="px-2 py-2 text-left font-bold">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedSettlements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    No settlements found. Run settlement first.
                  </td>
                </tr>
              ) : (
                paginatedSettlements.map((s: any) => {
                  const settlementStatus = String(s.status || "").toLowerCase();

                  return (
                    <tr key={s.id} className="border-b hover:bg-slate-50">
                      <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                        {s.settlement_date || "-"}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2">
                        <div className="font-semibold">{s.name || "-"}</div>
                        <div className="text-[11px] text-slate-500">
                          {s.agent_code || "-"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-right">
                        {money(s.total_deposits)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-right">
                        {money(s.total_withdrawals)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-right">
                        {money(s.total_loan_repayments)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-right">
                        {money(s.total_commission)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                        {money(s.expected_cash)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2">
                        <span
                          className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${settlementStatus === "completed" ||
                            settlementStatus === "paid"
                            ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                            : settlementStatus === "failed" ||
                              settlementStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {s.status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
          <span className="text-slate-600">Total {total}</span>

          <Link
            href={`/admin/agency/settlements?${prevQuery.toString()}`}
            className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
              }`}
          >
            Prev
          </Link>

          <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
            {safePage}
          </span>

          <Link
            href={`/admin/agency/settlements?${nextQuery.toString()}`}
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

function SummaryCard({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
      <p className="text-sm font-semibold text-white/70">{label}</p>
      <h2 className="mt-2 text-xl font-black">{value}</h2>
    </div>
  );
}