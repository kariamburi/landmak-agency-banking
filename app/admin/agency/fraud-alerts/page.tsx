import { adminApiGet } from "@/app/lib/agencyAdminApi";
import FraudAlertsTable from "./FraudAlertsTable";


export default async function FraudAlertsPage() {
    const res = await adminApiGet("/api/admin/agency/fraud-alerts");

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
                Fraud Alerts
            </h1>

            <p style={{ color: "#64748b", marginTop: 8 }}>
                Review suspicious activities, high-value withdrawal alerts, and fraud flags.
            </p>

            <div style={{ marginTop: 24 }}>
                <FraudAlertsTable alerts={res.alerts || []} />
            </div>
        </div>
    );
}