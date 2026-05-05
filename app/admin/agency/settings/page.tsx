import Link from "next/link";

export default function AgencySettingsPage() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>
        Settings
      </h1>

      <p style={{ marginTop: 8, color: "#64748B", fontSize: 16 }}>
        Manage agency banking configuration, commissions, limits, security, and devices.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        <SettingCard
          href="/admin/agency/settings/commission-rules"
          title="Commission Rules"
          description="Set agent earnings by transaction type and amount range."
        />

        <SettingCard
          href="/admin/agency/settings/agent-limits"
          title="Agent Limits"
          description="Configure default single and daily transaction limits."
        />

        <SettingCard
          href="/admin/agency/settings/security"
          title="Security"
          description="OTP rules, session timeout, PIN lock, device binding, and access controls."
        />

        <SettingCard
          href="/admin/agency/settings/fraud-rules"
          title="Fraud Rules"
          description="Withdrawal velocity, suspicious transaction flags, and admin approval thresholds."
        />

        <SettingCard
          href="/admin/agency/settings/templates"
          title="SMS & Email Templates"
          description="Configure messages sent to agents, members, and admins."
        />
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
      style={{
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>
        {title}
      </h2>

      <p style={{ marginTop: 10, color: "#64748B", lineHeight: 1.5 }}>
        {description}
      </p>

      <p style={{ marginTop: 18, color: "#0F3D2E", fontWeight: 900 }}>
        Open →
      </p>
    </Link>
  );
}