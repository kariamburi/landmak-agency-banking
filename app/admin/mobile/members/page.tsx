import Link from "next/link";
import { mobileAdminGet } from "@/app/lib/mobileAdminApi";
import ExportMobileMembersButton from "@/app/components/ExportMobileMembersButton";

const PAGE_SIZE = 10;

export default async function MobileMembersPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        name?: string;
        clientId?: string;
        phone?: string;
    }>;
}) {
    const params = await searchParams;

    const currentPage = Math.max(Number(params?.page || 1), 1);
    const name = String(params?.name || "").trim().toLowerCase();
    const clientId = String(params?.clientId || "").trim();
    const phone = String(params?.phone || "").trim();

    const res = await mobileAdminGet("/api/admin/mobile/members");
    const members = res.members || [];

    const filteredMembers = members.filter((m: any) => {
        const memberName = String(m.display_name || "").toLowerCase();
        const memberClientId = String(m.client_id || "");
        const memberPhone = String(m.phone || "");

        return (
            (!name || memberName.includes(name)) &&
            (!clientId || memberClientId.includes(clientId)) &&
            (!phone || memberPhone.includes(phone))
        );
    });

    const total = filteredMembers.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const paginatedMembers = filteredMembers.slice(start, start + PAGE_SIZE);

    const query = new URLSearchParams();
    if (name) query.set("name", name);
    if (clientId) query.set("clientId", clientId);
    if (phone) query.set("phone", phone);

    const prevQuery = new URLSearchParams(query);
    prevQuery.set("page", String(Math.max(safePage - 1, 1)));

    const nextQuery = new URLSearchParams(query);
    nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

    return (
        <div className="space-y-5">
            <div className="rounded-t-2xl px-6 py-5 text-white shadow">
                <p className="text-sm font-semibold text-slate-500">
                    Mobile Banking
                </p>

                <h1 className="mt-1 text-3xl text-slate-900">
                    Member Registry
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View linked members, mobile numbers, account status, and app access.
                </p>
            </div>

            <form
                action="/admin/mobile/members"
                className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
                    Search Members
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_150px_150px_auto]">
                    <input
                        name="name"
                        defaultValue={params?.name || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Search name"
                    />

                    <input
                        name="clientId"
                        defaultValue={params?.clientId || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="Client ID"
                    />

                    <input
                        name="phone"
                        defaultValue={params?.phone || ""}
                        className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
                        placeholder="2547..."
                    />

                    <div className="flex min-w-0 gap-2">
                        <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
                            Search
                        </button>

                        <Link
                            href="/admin/mobile/members"
                            className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <ExportMobileMembersButton members={filteredMembers} />

                    <p className="text-sm text-slate-500">
                        Total {total} • Page {safePage} of {totalPages}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-[12px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900">
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Member Name
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Client ID
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Account No.
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Phone
                                </th>
                                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                                    Status
                                </th>
                                <th className="px-2 py-2 text-left font-bold">
                                    Operation
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                                        No mobile banking members found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedMembers.map((m: any) => {
                                    const active = Number(m.status_enum) === 300;

                                    return (
                                        <tr
                                            key={`${m.client_id}-${m.phone}`}
                                            className="border-b hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-2 py-2 font-semibold">
                                                {m.display_name || "Unknown Member"}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                {m.client_id}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                {m.account_no || "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                {m.phone}
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide ${active
                                                        ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {active ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-2 py-2">
                                                <button className="cursor-pointer rounded bg-[#0F3D2E]/10 px-3 py-1.5 text-[12px] font-bold text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3 border-t pt-4 text-sm">
                    <span className="text-slate-600">Total {total}</span>

                    <Link
                        href={`/admin/mobile/members?${prevQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === 1 ? "pointer-events-none opacity-40" : ""
                            }`}
                    >
                        Prev
                    </Link>

                    <span className="rounded bg-[#0F3D2E] px-3 py-1.5 font-bold text-white">
                        {safePage}
                    </span>

                    <Link
                        href={`/admin/mobile/members?${nextQuery.toString()}`}
                        className={`rounded border px-3 py-1.5 font-semibold ${safePage === totalPages ? "pointer-events-none opacity-40" : ""
                            }`}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}