"use client";

type Props = {
    rows: {
        report: string;
        count: number;
        amount: string;
    }[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportMobileReportsButton({ rows }: Props) {
    function handleExport() {
        const headers = ["Report", "Count", "Amount"];

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) =>
                [row.report, row.count, row.amount].map(escapeCsv).join(",")
            ),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `mobile-reports-${new Date()
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