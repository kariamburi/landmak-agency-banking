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
    ["Audit Logs", "/admin/agency/audit", "Track admin actions, reversals, payouts, and sensitive activities."],
    ["Settings", "/admin/agency/settings", "Configure limits, security rules, commissions, and fraud controls."],
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">Agency Dashboard</p>
      <h1 className="mt-1 text-3xl text-slate-900">Agency Banking</h1>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-500 pb-3">
          <h2 className="text-xl font-black text-slate-900">
            Agency Modules
          </h2>
          <span className="text-sm font-bold text-slate-500">
            Total {cards.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map(([title, href, desc]) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0F3D2E] hover:shadow-md"
            >
              <h3 className="text-2xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p>

              <div className="mt-5 font-black text-[#0F3D2E]">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}