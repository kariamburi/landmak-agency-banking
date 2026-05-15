import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import SubmitButton from "../components/SubmitButton";

const API_BASE =
  process.env.AGENCY_API_BASE_URL ||
  process.env.ADMIN_API_BASE_URL ||
  "https://landmak.co.ke/sms-gateway";

async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": process.env.ADMIN_API_KEY || "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || data.message || `Request failed: ${res.status}`);
  }

  return data;
}

async function login(formData: FormData) {
  "use server";

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  let data: any;

  try {
    data = await apiPost("/api/admin/agency/auth/login", {
      username,
      password,
    });
  } catch (e: any) {
    redirect(`/login?error=${encodeURIComponent(e.message || "Login failed")}`);
  }

  const cookieStore = await cookies();

  cookieStore.set("agency_admin_otp_token", data.tempToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  cookieStore.set("agency_admin_otp_email", data.emailMasked || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  redirect("/login?step=otp");
}

async function verifyOtpAction(formData: FormData) {
  "use server";

  const code = String(formData.get("code") || "").trim();
  const cookieStore = await cookies();

  const tempToken = cookieStore.get("agency_admin_otp_token")?.value;

  if (!tempToken) {
    redirect("/login?error=OTP session expired. Login again.");
  }

  let data: any;

  try {
    data = await apiPost("/api/admin/agency/auth/verify-otp", {
      tempToken,
      code,
    });
  } catch (e: any) {
    redirect(`/login?step=otp&error=${encodeURIComponent(e.message || "Invalid OTP")}`);
  }

  cookieStore.set("agency_admin_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  cookieStore.set("agency_admin_user", JSON.stringify(data.user || {}), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  cookieStore.delete("agency_admin_otp_token");
  cookieStore.delete("agency_admin_otp_email");
  cookieStore.delete("agency_admin_otp_phone");
  cookieStore.delete("agency_admin_auth");

  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; step?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const isOtpStep = params?.step === "otp";
  const emailMasked = cookieStore.get("agency_admin_otp_email")?.value || "";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#F4F7F5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          background: "#0F3D2E",
          color: "white",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
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

          <h1 style={{ fontSize: 52, lineHeight: 1.05, marginTop: 40 }}>
            Landmak Digital Banking
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, maxWidth: 520 }}>
            Secure access for approved users assigned the digital banking role.
          </p>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Role Based", "Email OTP", "Audit Logs"].map((item) => (
            <div
              key={item}
              style={{
                padding: 18,
                borderRadius: 20,
                background: "rgba(255,255,255,0.12)",
                fontWeight: 800,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <form
          action={isOtpStep ? verifyOtpAction : login}
          style={{
            width: "100%",
            maxWidth: 460,
            background: "white",
            borderRadius: 32,
            padding: 36,
            boxShadow: "0 20px 60px rgba(15,61,46,0.14)",
            border: "1px solid #E5E7EB",
          }}
        >
          <p style={{ color: "#0F3D2E", fontWeight: 900, letterSpacing: 3 }}>
            DIGITAL BANKING ADMIN PORTAL
          </p>

          <h2 style={{ fontSize: 36, margin: "12px 0 0", color: "#0F172A" }}>
            {isOtpStep ? "Verify Email OTP" : "Welcome back"}
          </h2>

          <p style={{ color: "#64748B", marginTop: 8 }}>
            {isOtpStep
              ? `Enter the OTP sent to ${emailMasked || "your Fineract email"}.`
              : "Login using your Fineract username and password."}
          </p>

          {params?.error && (
            <div
              style={{
                marginTop: 22,
                padding: 14,
                borderRadius: 16,
                background: "#FEF2F2",
                color: "#B42318",
                fontWeight: 800,
              }}
            >
              {params.error}
            </div>
          )}

          {!isOtpStep ? (
            <>
              <Label text="Username" />
              <Input name="username" placeholder="Enter username" required />

              <Label text="Password" />
              <Input name="password" type="password" placeholder="Enter password" required />

              <SubmitButton text="Send Email OTP" />
            </>
          ) : (
            <>
              <Label text="Email OTP code" />
              <Input name="code" placeholder="Enter 6-digit OTP" required />

              <SubmitButton text="Verify & Login" />

              <a
                href="/login"
                style={{
                  display: "block",
                  marginTop: 18,
                  textAlign: "center",
                  color: "#0F3D2E",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Use another account
              </a>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

function Label({ text }: { text: string }) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 24,
        fontWeight: 800,
        color: "#334155",
      }}
    >
      {text}
    </label>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        marginTop: 8,
        padding: "16px 18px",
        borderRadius: 18,
        border: "1px solid #CBD5E1",
        outline: "none",
        fontSize: 16,
        boxSizing: "border-box",
      }}
    />
  );
}

