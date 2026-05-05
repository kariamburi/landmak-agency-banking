// app/components/ActionSubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export default function ActionSubmitButton({
    text,
    loadingText = "Processing...",
}: {
    text: string;
    loadingText?: string;
}) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                border: "none",
                borderRadius: 12,
                padding: "10px 14px",
                fontWeight: 900,
                cursor: pending ? "not-allowed" : "pointer",
                background: pending ? "#BAE6FD" : "#E0F2FE",
                color: "#075985",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                opacity: pending ? 0.8 : 1,
            }}
        >
            {pending && (
                <span
                    style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(7,89,133,0.25)",
                        borderTopColor: "#075985",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
            )}

            {pending ? loadingText : text}

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