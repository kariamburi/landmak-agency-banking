"use client";

type Props = {
    settlements: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function moneyNumber(v: any) {
    return Number(v || 0);
}

export default function ExportCommissionsButton({
    settlements,
}: Props) {
    function handleExport() {
        const headers = [
            "Agent",
            "Agent Code",
            "Date",
            "Commission",
            "Status",
        ];

        const rows = settlements.map((s) => [
            s.name || "",
            s.agent_code || "",
            s.settlement_date || "",
            moneyNumber(s.total_commission),
            s.status || "",
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

        link.download = `commissions-${new Date()
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