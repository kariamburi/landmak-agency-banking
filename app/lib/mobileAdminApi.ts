const BASE_URL = "https://landmak.co.ke/sms-gateway";

function getAdminKey() {
    const key = process.env.AGENCY_ADMIN_KEY;

    if (!key) {
        throw new Error("Missing AGENCY_ADMIN_KEY in .env.local");
    }

    return key;
}
export async function mobileAdminPost(path: string, body?: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-admin-key": getAdminKey(),
        },
        body: JSON.stringify(body || {}),
    });

    const data = await res.json();

    if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}
export async function mobileAdminGet(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "x-admin-key": getAdminKey(),
        },
    });

    const data = await res.json();

    if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}