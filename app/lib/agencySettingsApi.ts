const BASE_URL =
    process.env.AGENCY_API_BASE_URL ||
    process.env.NEXT_PUBLIC_AGENCY_API_BASE_URL ||
    "https://landmak.co.ke/sms-gateway";

const ADMIN_KEY = process.env.AGENCY_ADMIN_KEY || process.env.ADMIN_API_KEY || "";

export async function agencySettingsGet(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            "x-admin-key": ADMIN_KEY,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}

export async function agencySettingsPost(path: string, body: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}

export async function agencySettingsPut(path: string, body: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}

export async function agencySettingsDelete(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        cache: "no-store",
        headers: {
            "x-admin-key": ADMIN_KEY,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}