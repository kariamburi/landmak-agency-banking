
import { adminApiGet } from "@/app/lib/agencyAdminApi";
import AgentDefaultSettingsForm from "./AgentDefaultSettingsForm";

export default async function AgencySettingsPage() {
  const res = await adminApiGet("/api/admin/agency/settings/agent-defaults");

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Agency Settings
        </h1>
        <p style={{ color: "#64748b", marginTop: 6 }}>
          Configure default limits, OTP rules, and system-wide agency controls.
        </p>
      </div>

      <AgentDefaultSettingsForm initialSettings={res.settings} />
    </div>
  );
}