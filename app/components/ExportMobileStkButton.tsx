"use client";

type Props = {
    transactions: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(value: any) {
    return Number(value || 0);
}

export default function ExportMobileStkButton({ transactions }: Props) {
    function handleExport() {
        const headers = [
            "Phone",
            "Amount",
            "Account Ref",
            "Type",
            "Status",
            "Result",
            "Date",
        ];

        const rows = transactions.map((tx) => [
            tx.phone || "",
            moneyNumber(tx.amount),
            tx.account_ref || "",
            tx.fineract_type || "",
            tx.status || "",
            tx.result_desc || "",
            tx.created_at ? new Date(tx.created_at).toLocaleString("en-KE") : "",
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
        link.download = `mobile-stk-transactions-${new Date()
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