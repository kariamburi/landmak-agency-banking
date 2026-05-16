import Link from "next/link";
import { adminApiGet } from "@/app/lib/agencyAdminApi";
import DeviceStatusActions from "./DeviceStatusActions";


const PAGE_SIZE = 10;

function formatDate(v: any) {
  if (!v) return "—";

  return new Date(v).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: string) {
  const s = String(status || "").toLowerCase();

  if (s === "active") return "bg-[#0F3D2E]/10 text-[#0F3D2E]";
  if (s === "blocked") return "bg-red-100 text-red-700";
  if (s === "revoked") return "bg-slate-100 text-slate-700";

  return "bg-yellow-100 text-yellow-700";
}

export default async function AgencyDevicesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    phone?: string;
    agent?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params?.page || 1), 1);
  const phone = String(params?.phone || "").trim();
  const agent = String(params?.agent || "").trim().toLowerCase();
  const status = String(params?.status || "").trim().toLowerCase();

  const res = await adminApiGet("/api/admin/agency/devices");
  const devices = res.devices || [];

  const filteredDevices = devices.filter((d: any) => {
    const dPhone = String(d.phone || "");
    const dAgent = String(d.agent_name || "").toLowerCase();
    const dStatus = String(d.status || "").toLowerCase();

    return (
      (!phone || dPhone.includes(phone)) &&
      (!agent || dAgent.includes(agent)) &&
      (!status || dStatus === status)
    );
  });

  const total = filteredDevices.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  const safePage = Math.min(currentPage, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;

  const paginatedDevices = filteredDevices.slice(
    start,
    start + PAGE_SIZE
  );

  const active = filteredDevices.filter(
    (d: any) => d.status === "active"
  ).length;

  const blocked = filteredDevices.filter(
    (d: any) => d.status === "blocked"
  ).length;

  const revoked = filteredDevices.filter(
    (d: any) => d.status === "revoked"
  ).length;

  const query = new URLSearchParams();

  if (phone) query.set("phone", phone);
  if (agent) query.set("agent", agent);
  if (status) query.set("status", status);

  const prevQuery = new URLSearchParams(query);
  prevQuery.set("page", String(Math.max(safePage - 1, 1)));

  const nextQuery = new URLSearchParams(query);
  nextQuery.set("page", String(Math.min(safePage + 1, totalPages)));

  return (
    <div className="space-y-5">
      <div className="rounded-t-2xl px-6 py-5 text-white shadow">
        <p className="text-sm font-semibold text-slate-500">
          Agency Banking
        </p>

        <h1 className="mt-1 text-3xl text-slate-900">
          Agent Devices
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor connected agent devices, app versions, activity, and access status.
        </p>
      </div>

      <form
        action="/admin/agency/devices"
        className="w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 border-b border-slate-300 bg-slate-100 px-4 py-2 text-sm font-black text-slate-800">
          Search Devices
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[180px_minmax(0,1fr)_150px_auto]">
          <input
            name="phone"
            defaultValue={params?.phone || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Phone"
          />

          <input
            name="agent"
            defaultValue={params?.agent || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
            placeholder="Agent name"
          />

          <select
            name="status"
            defaultValue={params?.status || ""}
            className="h-10 min-w-0 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#0F3D2E]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="revoked">Revoked</option>
          </select>

          <div className="flex min-w-0 gap-2">
            <button className="h-10 rounded-md bg-[#0F3D2E] px-5 text-sm font-black text-white hover:bg-[#145A43]">
              Search
            </button>

            <Link
              href="/admin/agency/devices"
              className="flex h-10 items-center rounded-md border border-slate-300 px-5 text-sm font-black hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Devices" value={total} />
        <SummaryCard label="Active" value={active} />
        <SummaryCard label="Blocked" value={blocked} />
        <SummaryCard label="Revoked" value={revoked} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <p className="text-sm text-slate-500">
            Total {total} • Page {safePage} of {totalPages}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Agent
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Phone
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Device
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  OS
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  App
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  IP
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Last Seen
                </th>

                <th className="border-r border-slate-200 px-2 py-2 text-left font-bold">
                  Status
                </th>

                <th className="px-2 py-2 text-left font-bold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No agent devices found.
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((d: any) => (
                  <tr
                    key={d.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-2 py-2 font-semibold">
                      {d.agent_name || `Agent #${d.agent_id || "—"}`}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {d.phone || "—"}
                    </td>

                    <td className="px-2 py-2">
                      <div className="font-semibold">
                        {d.device_model || "Unknown Device"}
                      </div>

                      <div className="max-w-[220px] truncate text-[11px] text-slate-500">
                        {d.device_id || "—"}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {d.os_version || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {d.app_version || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      {d.last_login_ip || "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">
                      {formatDate(d.last_seen_at)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-bold ${statusClass(
                          d.status
                        )}`}
                      >
                        {d.status || "unknown"}
                      </span>
                    </td>

                    <td className="px-2 py-2">
                      <DeviceStatusActions
                        deviceId={d.id}
                        agentId={d.agent_id}
                        status={d.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/admin/agency/devices?${prevQuery.toString()}`}
            className={`rounded-md border px-4 py-2 text-sm font-black ${safePage <= 1
              ? "pointer-events-none border-slate-200 text-slate-300"
              : "border-slate-300 hover:bg-slate-50"
              }`}
          >
            ← Previous
          </Link>

          <Link
            href={`/admin/agency/devices?${nextQuery.toString()}`}
            className={`rounded-md border px-4 py-2 text-sm font-black ${safePage >= totalPages
              ? "pointer-events-none border-slate-200 text-slate-300"
              : "border-slate-300 hover:bg-slate-50"
              }`}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl bg-[#0F3D2E] p-5 text-white shadow-sm">
      <p className="text-sm font-semibold text-white/70">
        {label}
      </p>

      <h2 className="mt-2 text-xl font-black">
        {value}
      </h2>
    </div>
  );
}