import ExportTransactionsButton from "@/app/components/ExportTransactionsButton";
import { adminApiGet, adminApiPost } from "@/app/lib/agencyAdminApi";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const PAGE_SIZE = 10;

function money(v: any) {
  return `KES ${Number(v || 0).toLocaleString("en-KE")}`;
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

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    agent?: string;
    type?: string;
    status?: string;
    receipt?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params?.page || 1), 1);
  const agent = String(params?.agent || "").trim().toLowerCase();
  const type = String(params?.type || "").trim().toLowerCase();
  const status = String(params?.status || "").trim().toLowerCase();
  const receipt = String(params?.receipt || "").trim().toLowerCase();
  const from = String(params?.from || "").trim();
  const to = String(params?.to || "").trim();
  let transactions: any[] = [];

  try {
    const data = await adminApiGet("/api/admin/agency-transactions");
    transactions = data.transactions || [];
  } catch {
    transactions = [];
  }
  const filteredTransactions = transactions.filter((t: any) => {
    const agentName = String(t.agent_name || "").toLowerCase();
    const transactionType = String(t.transaction_type || "").toLowerCase();
    const transactionStatus = String(t.status || "").toLowerCase();
    const transactionReceipt = String(t.receipt_no || t.reference || "").toLowerCase();

    const txDate = t.created_at ? new Date(t.created_at) : null;
    const fromDate = from ? new Date(`${from}T00:00:00`) : null;
    const toDate = to ? new Date(`${to}T23:59:59`) : null;

    return (
      (!agent || agentName.includes(agent)) &&
      (!type || transactionType === type) &&
      (!status || transactionStatus === status) &&
      (!receipt || transactionReceipt.includes(receipt)) &&
      (!fromDate || (txDate && txDate >= fromDate)) &&
      (!toDate || (txDate && txDate <= toDate))
    );
  });

  const total = filteredTransactions.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedTransactions = filteredTransactions.slice(start, start + PAGE_SIZE);

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const totalCommission = filteredTransactions.reduce(
    (sum, t) => sum + Number(t.commission_amount || 0),
    0
  );

  const query = new URLSearchParams();
  if (agent) query.set("agent", agent);
  if (type) query.set("type", type);
  if (status) query.set("status", status);
  if (receipt) query.set("receipt", receipt);
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
        <h1 className="mt-1 text-3xl text-slate-900">Transaction Records</h1>
      </div>

      <form
        action="/admin/agency/transactions"
        className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Search Transactions
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_150px_150px_150px_150px_auto]">
          <input
            name="agent"
            defaultValue={params?.agent || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Agent name"
          />

          <input
            name="receipt"
            defaultValue={params?.receipt || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Receipt / Ref"
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

          <select
            name="type"
            defaultValue={params?.type || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="loan_repayment">Loan Repayment</option>
          </select>

          <select
            name="status"
            defaultValue={params?.status || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
            <option value="pending">Pending</option>
          </select>

          <div className="flex min-w-0 gap-2">
            <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
              Search
            </button>

            <Link
              href="/admin/agency/transactions"
              className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/70">Total Transactions</p>
          <h2 className="mt-2 text-2xl font-black">{total}</h2>
        </div>

        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/70">Total Amount</p>
          <h2 className="mt-2 text-2xl font-black">{money(totalAmount)}</h2>
        </div>

        <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/70">Total Commission</p>
          <h2 className="mt-2 text-2xl font-black">{money(totalCommission)}</h2>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <ExportTransactionsButton transactions={filteredTransactions} />

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
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Type
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Amount
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Commission
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Status
                </th>
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Receipt
                </th>
                <th className="px-2 py-2 text-left font-bold">
                  Operation
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t: any) => (
                  <tr key={t.id} className="border-b hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                      {t.created_at
                        ? new Date(t.created_at).toLocaleString("en-KE")
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {t.agent_name || "-"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 capitalize">
                      {String(t.transaction_type || "-").replaceAll("_", " ")}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {money(t.amount)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {money(t.commission_amount)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${t.status === "success"
                          ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                          : t.status === "failed" || t.status === "reversed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {t.status || "-"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {t.receipt_no || t.reference || "-"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {t.status === "success" ? (
                        <form action={reverseTransaction} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={t.id} />

                          <input
                            name="reason"
                            placeholder="Reason"
                            required
                            className="w-[120px] rounded border px-2 py-1.5 text-[12px] outline-none"
                          />

                          <button
                            type="submit"
                            className="rounded bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700"
                          >
                            Reverse
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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
            href={`/admin/agency/transactions?${prevQuery.toString()}`}
            className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
              }`}
          >
            Prev
          </Link>

          <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
            {safePage}
          </span>

          <Link
            href={`/admin/agency/transactions?${nextQuery.toString()}`}
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