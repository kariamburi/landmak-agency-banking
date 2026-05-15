"use client";

type Props = {
    agents: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(v: any) {
    return Number(v || 0);
}

export default function ExportAgentsButton({ agents }: Props) {
    function handleExport() {
        const headers = [
            "Code",
            "Name",
            "Phone",
            "Email",
            "Branch",
            "Status",
            "Deposit Limit",
            "Withdrawal Limit",
            "Single Tx Limit",
            "Float",
            "Cash",
            "Created",
        ];

        const rows = agents.map((a) => [
            a.agent_code,
            a.name,
            a.phone,
            a.email || "",
            a.branch_id || "",
            a.status || "",
            moneyNumber(a.daily_deposit_limit),
            moneyNumber(a.daily_withdrawal_limit),
            moneyNumber(a.single_transaction_limit),
            moneyNumber(a.available_float),
            moneyNumber(a.cash_on_hand),
            a.created_at ? new Date(a.created_at).toLocaleDateString("en-KE") : "",
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
        link.download = `agents-export-${new Date().toISOString().slice(0, 10)}.csv`;
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