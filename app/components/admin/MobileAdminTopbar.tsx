import { cookies } from "next/headers";

export default async function MobileAdminTopbar() {
    const cookieStore = await cookies();
    const rawUser = cookieStore.get("agency_admin_user")?.value;

    let user: any = {};

    try {
        user = rawUser ? JSON.parse(rawUser) : {};
    } catch { }

    const username = user?.username || "Admin";
    const email = user?.email || "";
    const initials = String(username).slice(0, 1).toUpperCase();

    return (
        <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0F3D2E] to-[#145A43] px-6 py-4 text-white shadow">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.35em] text-[#D8C46C]">
                        Landmak Digital Banking
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                        Mobile Banking Admin Portal
                    </h2>
                    <p className="text-sm text-white/80">
                        Member App • STK Deposits • Withdrawals • Security
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <div className="hidden text-right sm:block">
                        <p className="font-black">{username}</p>
                        <p className="text-xs font-bold text-white/75">{email}</p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0F3D2E] font-black">
                        {initials}
                    </div>

                    <form action="/logout" method="GET">
                        <button className="rounded-xl bg-white px-4 py-2 font-black text-[#0F3D2E] hover:bg-[#F8FAFC]">
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}