"use client";

type Props = {
    members: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportMobileMembersButton({ members }: Props) {
    function handleExport() {
        const headers = [
            "Member Name",
            "Client ID",
            "Account No",
            "Phone",
            "Status",
        ];

        const rows = members.map((m) => {
            const active = Number(m.status_enum) === 300;

            return [
                m.display_name || "",
                m.client_id || "",
                m.account_no || "",
                m.phone || "",
                active ? "Active" : "Inactive",
            ];
        });

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
        link.download = `mobile-members-${new Date()
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