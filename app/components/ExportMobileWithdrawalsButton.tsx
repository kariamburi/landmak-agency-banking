"use client";

type Props = {
    withdrawals: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(value: any) {
    return Number(value || 0);
}

export default function ExportMobileWithdrawalsButton({
    withdrawals,
}: Props) {
    function handleExport() {
        const headers = [
            "Phone",
            "Amount",
            "Member",
            "Account",
            "Status",
            "M-Pesa Result",
            "Date",
        ];

        const rows = withdrawals.map((w) => [
            w.phone || "",
            moneyNumber(w.amount),
            w.member_name || "",
            w.account_no || "",
            w.status || "",
            w.mpesa_result_desc || "",
            w.created_at ? new Date(w.created_at).toLocaleString("en-KE") : "",
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
        link.download = `mobile-withdrawals-${new Date()
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