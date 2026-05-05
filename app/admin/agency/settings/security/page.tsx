import { adminApiGet } from "@/app/lib/agencyAdminApi";
import SecuritySettingsForm from "./SecuritySettingsForm";

export default async function SecuritySettingsPage() {
    const res = await adminApiGet("/api/admin/agency/settings/security");

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
                Security Settings
            </h1>

            <p style={{ color: "#64748b", marginTop: 8 }}>
                Manage OTP, session, PIN, device binding, and access protection rules.
            </p>

            <div style={{ marginTop: 24 }}>
                <SecuritySettingsForm initialSettings={res.settings} />
            </div>
        </div>
    );
}