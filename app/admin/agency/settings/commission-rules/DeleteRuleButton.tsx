"use client";

export default function DeleteRuleButton({ ruleId }: { ruleId: number }) {
    return (
        <button
            type="submit"
            onClick={(e) => {
                const ok = confirm(
                    "Are you sure you want to disable this commission rule?"
                );

                if (!ok) {
                    e.preventDefault();
                }
            }}
            style={{
                border: "none",
                padding: "8px 12px",
                borderRadius: 10,
                background: "#FEE2E2",
                color: "#991B1B",
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
            }}
        >
            Delete
        </button>
    );
}