import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    const cookieStore = await cookies();

    cookieStore.delete("agency_admin_token");
    cookieStore.delete("agency_admin_user");
    cookieStore.delete("agency_admin_auth");
    cookieStore.delete("agency_admin_otp_token");
    cookieStore.delete("agency_admin_otp_phone");

    redirect("/login");
}