"use client";

export default function Modal({ open, onClose, title, subtitle, children }: any) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: 24,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 720,
                    maxHeight: "95vh",
                    background: "#fff",
                    borderRadius: 28,
                    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.35)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        padding: "22px 28px",
                        borderBottom: "1px solid #E2E8F0",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                        flexShrink: 0,
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#0F172A" }}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p style={{ margin: "6px 0 0", color: "#64748B" }}>{subtitle}</p>
                        )}
                    </div>

                    <button type="button" onClick={onClose} style={{
                        width: 42, height: 42, borderRadius: 14,
                        border: "1px solid #E2E8F0", background: "#F8FAFC",
                        fontSize: 22, cursor: "pointer",
                    }}>
                        ×
                    </button>
                </div>

                <div
                    style={{
                        padding: 28,
                        overflowY: "auto",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}