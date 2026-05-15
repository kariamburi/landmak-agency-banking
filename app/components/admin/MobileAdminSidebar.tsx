"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
const menu = [
    { title: "Home", href: "/admin", icon: "⌂" },
    { title: "Overview", href: "/admin/mobile", icon: "▣" },
    { title: "Members", href: "/admin/mobile/members", icon: "☷" },
    { title: "STK", href: "/admin/mobile/stk", icon: "↗" },
    { title: "Withdraw", href: "/admin/mobile/withdrawals", icon: "⇄" },
    { title: "Security", href: "/admin/mobile/security", icon: "◇" },
    { title: "Devices", href: "/admin/mobile/devices", icon: "▧" },
    { title: "Sessions", href: "/admin/mobile/sessions", icon: "◷" },
    { title: "Reports", href: "/admin/mobile/reports", icon: "▤" },
    { title: "Agency", href: "/admin/agency", icon: "🧾" },
];

export default function MobileAdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-24 bg-white shadow-sm md:block">
            <div className="flex h-24 flex-col items-center justify-center bg-[#0F3D2E] text-white">
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <Image
                        src="/assets/images/icon.png"
                        alt="Landmak Logo"
                        width={34}
                        height={34}
                        style={{ objectFit: "contain" }}
                    />
                </div>

            </div>

            <nav className="mt-4 flex flex-col items-center gap-2">
                {menu.map((item) => {
                    const active =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.title}
                            className={`flex w-20 flex-col items-center justify-center rounded-xl px-1 py-2 transition ${active
                                ? "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            <span className="mt-1 text-[10px] font-bold leading-none">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}