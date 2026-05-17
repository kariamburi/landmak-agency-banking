"use client";

type Props = {
    topups: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportAgentTopupsButton({ topups }: Props) {
    function handleExport() {
        const headers = [
            "Date",
            "Agent Code",
            "Agent Name",
            "Phone",
            "Amount",
            "Method",
            "Reference",
            "Reason",
            "Admin",
        ];

        const rows = topups.map((t) => [
            t.created_at
                ? new Date(t.created_at).toLocaleString("en-KE")
                : "",
            t.agent_code || "",
            t.agent_name || "",
            t.phone || "",
            Number(t.amount || 0),
            t.method || "",
            t.reference || "",
            t.reason || "",
            t.admin_id || "",
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
        link.download = `agent-topup-history-${new Date()
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