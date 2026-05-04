import Link from "next/link";

export default function AgencyOverviewPage() {
  const cards = [
    ["Agents", "/admin/agency/agents", "Register agents and manage float."],
    ["Transactions", "/admin/agency/transactions", "View deposits, withdrawals, and repayments."],
    ["Reconciliation", "/admin/agency/reconciliation", "Compare float, cash, and daily totals."],
    ["Settlements", "/admin/agency/settlements", "Close daily agency settlement reports."],
    ["Commissions", "/admin/agency/commissions", "Track and pay agent commissions."],
    ["Audit", "/admin/agency/audit", "Track admin actions, reversals, payouts, status changes, and sensitive system activities.."],
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900">Agency Banking</h1>

      <p className="mt-2 text-slate-500">
        Monitor agents, transactions, float, settlements, and commissions.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map(([title, href, desc]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}