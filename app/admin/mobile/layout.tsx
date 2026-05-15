import MobileAdminSidebar from "@/app/components/admin/MobileAdminSidebar";
import MobileAdminTopbar from "@/app/components/admin/MobileAdminTopbar";

export default function MobileAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <MobileAdminSidebar />

            <div className="min-h-screen md:pl-20">
                <MobileAdminTopbar />
                <main className="p-5 md:p-8">{children}</main>
            </div>
        </div>
    );
}