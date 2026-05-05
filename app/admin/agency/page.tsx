import Link from "next/link";

export default function AgencyOverviewPage() {
  const cards = [
    ["Agents", "/admin/agency/agents", "Register agents, manage status, devices, and float."],
    ["Transactions", "/admin/agency/transactions", "View deposits, withdrawals, loan repayments, and receipts."],
    ["Withdrawal Approvals", "/admin/agency/withdrawal-approvals", "Review and approve high-value withdrawals."],
    ["Fraud Alerts", "/admin/agency/fraud-alerts", "Review suspicious activity and resolve fraud alerts."],
    ["Reconciliation", "/admin/agency/reconciliation", "Compare float, cash, and daily transaction totals."],
    ["Settlements", "/admin/agency/settlements", "Close daily agency settlement reports."],
    ["Commissions", "/admin/agency/commissions", "Track commission earnings and payouts."],
    ["Audit", "/admin/agency/audit", "Track admin actions, reversals, payouts, and sensitive activities."],
    ["Settings", "/admin/agency/settings", "Configure limits, security rules, commissions, and fraud controls."],
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