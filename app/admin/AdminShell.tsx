"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = [
    { title: "Home", href: "/admin", icon: "⌂" },
    { title: "Settings", href: "/admin/settings/global", icon: "⚙" },
    { title: "Audit", href: "/admin/audit", icon: "▤" },
];

export default function AdminShell({
    children,
    username,
    email,
    initials,
}: any) {
    const pathname = usePathname();

    const isChannelPage =
        pathname.startsWith("/admin/agency") ||
        pathname.startsWith("/admin/mobile");

    if (isChannelPage) {
        return <main className="min-h-screen bg-slate-50">{children}</main>;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-24 bg-white shadow-sm md:block">
                <div className="flex h-24 flex-col items-center justify-center bg-[#0F3D2E] text-white">
                    <div className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-[18px] bg-white/10">
                        <Image
                            src="/assets/images/icon.png"
                            alt="Landmak Logo"
                            width={34}
                            height={34}
                            className="object-contain"
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
                                    ? "bg-[#0F3D2E] text-white"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-[#0F3D2E]"
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

            <div className="md:ml-24">
                <header className="sticky top-0 z-30 flex h-[92px] items-center justify-between bg-[#0F3D2E] px-6 text-white shadow-sm md:px-8">
                    <div>
                        <p className="tracking-[0.45em] text-[#F6D56B] text-sm font-black">
                            LANDMAK DIGITAL BANKING
                        </p>
                        <h1 className="mt-1 text-2xl font-black leading-none">
                            SACCO Digital Banking Admin
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-white/75">
                            Agency • Mobile • Digital Banking
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right md:block">
                            <p className="font-black">{username}</p>
                            <p className="text-sm font-semibold text-white/80">{email}</p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0F3D2E] text-xl font-black">
                            {initials}
                        </div>

                        <form action="/logout" method="GET">
                            <button
                                type="submit"
                                className="rounded-2xl bg-white px-5 py-3 font-black text-[#0F3D2E]"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                <main className="p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}