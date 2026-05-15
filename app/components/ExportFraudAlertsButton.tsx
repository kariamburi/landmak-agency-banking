"use client";

type Props = {
    alerts: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportFraudAlertsButton({ alerts }: Props) {
    function handleExport() {
        const headers = [
            "Date",
            "Severity",
            "Type",
            "Agent",
            "Agent Code",
            "Message",
            "Status",
        ];

        const rows = alerts.map((a) => [
            a.created_at
                ? new Date(a.created_at).toLocaleString("en-KE")
                : "",
            a.severity || "",
            a.alert_type || "",
            a.agent_name || "",
            a.agent_code || "",
            a.message || "",
            a.status || "",
        ]);

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(",")),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `fraud-alerts-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            className="cursor-pointer text-sm font-semibold text-[#008A3D]"
        >
            Export Excel ⌄
        </button>
    );
}