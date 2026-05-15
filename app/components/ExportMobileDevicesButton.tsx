"use client";

type Props = {
    devices: any[];
};

function escapeCsv(value: any) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export default function ExportMobileDevicesButton({ devices }: Props) {
    function handleExport() {
        const headers = [
            "Member",
            "Client ID",
            "Phone",
            "Device ID",
            "Device Model",
            "OS Version",
            "App Version",
            "IP",
            "Last Seen",
            "Status",
        ];

        const rows = devices.map((d) => [
            d.member_name || "",
            d.client_id || "",
            d.phone || "",
            d.device_id || "",
            d.device_model || "",
            d.os_version || "",
            d.app_version || "",
            d.last_login_ip || "",
            d.last_seen_at ? new Date(d.last_seen_at).toLocaleString("en-KE") : "",
            d.status || "active",
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
        link.download = `mobile-devices-${new Date()
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