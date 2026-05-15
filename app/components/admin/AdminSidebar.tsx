import Link from "next/link";

const menu = [
  { title: "Dashboard", href: "/admin" },

  // Mobile Banking
  { title: "Mobile Banking Overview", href: "/admin/mobile" },
  { title: "Members", href: "/admin/mobile/members" },
  { title: "STK Deposits", href: "/admin/mobile/stk" },
  { title: "Withdrawals", href: "/admin/mobile/withdrawals" },

  // Future
  { title: "Agency Banking", href: "/admin/agency" },
  { title: "Security Logs", href: "/admin/security" },
  { title: "Reports", href: "/admin/reports" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r bg-slate-950 text-white md:block">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-xl font-bold">SACCO Admin</h1>

        <p className="mt-1 text-xs text-slate-400">
          Digital Banking Platform
        </p>
      </div>

      <nav className="space-y-1 p-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 text-sm text-slate-200 hover:bg-white/10 hover:text-white"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}