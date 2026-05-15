"use client";

type Props = {
    logs: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportAuditLogsButton({
    logs,
}: Props) {
    function handleExport() {
        const headers = [
            "Date",
            "Action",
            "Agent",
            "Entity Type",
            "Entity ID",
            "Old Status",
            "New Status",
            "Reason",
        ];

        const rows = logs.map((l) => [
            l.created_at
                ? new Date(l.created_at).toLocaleString("en-KE")
                : "",
            l.action || "",
            l.agent_name || l.agent_id || "",
            l.entity_type || "",
            l.entity_id || "",
            l.old_status || "",
            l.new_status || "",
            l.reason || "",
        ]);

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) =>
                row.map(escapeCsv).join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `audit-logs-${new Date()
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