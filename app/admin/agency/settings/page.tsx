import Link from "next/link";

const settings = [
  {
    href: "/admin/agency/settings/commission-rules",
    title: "Commission Rules",
    description:
      "Set agent earnings by transaction type and amount range.",
  },
  {
    href: "/admin/agency/settings/agent-limits",
    title: "Agent Limits",
    description:
      "Configure default single and daily transaction limits.",
  },
  {
    href: "/admin/agency/settings/security",
    title: "Security",
    description:
      "OTP rules, session timeout, PIN lock, device binding, and access controls.",
  },
  {
    href: "/admin/agency/settings/fraud-rules",
    title: "Fraud Rules",
    description:
      "Withdrawal velocity, suspicious transaction flags, and admin approval thresholds.",
  },
  //{
  //  href: "/admin/agency/settings/templates",
  //  title: "SMS & Email Templates",
  // description:
  //   "Configure messages sent to agents, members, and admins.",
  //},
];

export default function AgencySettingsPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">
          Agency Banking
        </p>

        <h1 className="mt-1 text-3xl text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage agency banking configuration, commissions,
          limits, security, fraud controls, and templates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((item) => (
          <SettingCard
            key={item.href}
            href={item.href}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

function SettingCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-[#0F3D2E]/10 px-3 py-2 text-sm font-black text-[#0F3D2E] transition group-hover:bg-[#0F3D2E] group-hover:text-white">
          →
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <span className="text-sm font-black text-[#0F3D2E]">
          Open Settings
        </span>
      </div>
    </Link>
  );
}