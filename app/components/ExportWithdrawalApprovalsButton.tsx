"use client";

type Props = {
    approvals: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(v: any) {
    return Number(v || 0);
}

export default function ExportWithdrawalApprovalsButton({ approvals }: Props) {
    function handleExport() {
        const headers = [
            "Date",
            "Agent",
            "Agent Code",
            "Client ID",
            "Savings ID",
            "Phone",
            "Amount",
            "Status",
        ];

        const rows = approvals.map((a) => [
            a.created_at ? new Date(a.created_at).toLocaleString("en-KE") : "",
            a.agent_name || "",
            a.agent_code || `Agent #${a.agent_id || ""}`,
            a.client_id || "",
            a.savings_id || "",
            a.phone || "",
            moneyNumber(a.amount),
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
        link.download = `withdrawal-approvals-${new Date()
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