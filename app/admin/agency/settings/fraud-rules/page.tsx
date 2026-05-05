import { adminApiGet } from "@/app/lib/agencyAdminApi";
import FraudRulesForm from "./FraudRulesForm";

export default async function FraudRulesPage() {
    const res = await adminApiGet("/api/admin/agency/settings/fraud-rules");

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
                Fraud Rules
            </h1>

            <p style={{ color: "#64748b", marginTop: 8 }}>
                Configure withdrawal velocity limits, suspicious transaction flags, and approval thresholds.
            </p>

            <div style={{ marginTop: 24 }}>
                <FraudRulesForm initialSettings={res.settings} />
            </div>
        </div>
    );
}