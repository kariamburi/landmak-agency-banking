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
                        <button
                            type="submit"
                            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-[#0F3D2E] transition hover:opacity-90"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.5 3.75A2.25 2.25 0 0 0 5.25 6v12a2.25 2.25 0 0 0 2.25 2.25h6A2.25 2.25 0 0 0 15.75 18v-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 0 1.5 0V6a2.25 2.25 0 0 0-2.25-2.25h-6Z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M16.72 8.47a.75.75 0 0 0 0 1.06l1.97 1.97H9a.75.75 0 0 0 0 1.5h9.69l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25a.75.75 0 0 0-1.06 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}