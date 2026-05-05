"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                width: "100%",
                marginTop: 24,
                padding: 16,
                borderRadius: 18,
                border: "none",
                background: pending ? "#64748B" : "#0F3D2E",
                color: "white",
                fontWeight: 900,
                fontSize: 16,
                cursor: pending ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
            }}
        >
            {pending && (
                <span
                    style={{
                        width: 18,
                        height: 18,
                        border: "3px solid rgba(255,255,255,0.4)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
            )}

            {pending ? "Please wait..." : text}

            <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </button>
    );
}