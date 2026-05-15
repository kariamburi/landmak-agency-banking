"use client";

type Props = {
    transactions: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(v: any) {
    return Number(v || 0);
}

export default function ExportTransactionsButton({ transactions }: Props) {
    function handleExport() {
        const headers = [
            "Date",
            "Agent",
            "Type",
            "Amount",
            "Commission",
            "Status",
            "Receipt",
            "Reference",
        ];

        const rows = transactions.map((t) => [
            t.created_at ? new Date(t.created_at).toLocaleString("en-KE") : "",
            t.agent_name || "",
            String(t.transaction_type || "").replaceAll("_", " "),
            moneyNumber(t.amount),
            moneyNumber(t.commission_amount),
            t.status || "",
            t.receipt_no || "",
            t.reference || "",
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
        link.download = `transactions-export-${new Date()
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