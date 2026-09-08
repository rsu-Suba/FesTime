import React from "react";

export function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {children}
    </div>
  );
}

export function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--ft-text-primary)", marginBottom: 12, lineHeight: 1.3 }}>
      {children}
    </h1>
  );
}

export function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "1.1rem", color: "var(--ft-text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

export function ActionButtons({ onNext, onPrev, nextLabel = "OK", isNextDisabled = false }: { onNext: () => void; onPrev?: () => void; nextLabel?: string, isNextDisabled?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
      {onPrev && (
        <button
          onClick={onPrev}
          style={{
            background: "none",
            color: "var(--ft-text-secondary)",
            border: "1px solid var(--ft-border)",
            padding: "12px 24px",
            borderRadius: 999,
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        style={{
          background: "var(--ft-brand-primary)",
          color: "var(--bg-color)",
          border: "none",
          padding: "12px 32px",
          borderRadius: 999,
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: isNextDisabled ? "not-allowed" : "pointer",
          opacity: isNextDisabled ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.2s ease"
        }}
      >
        {nextLabel}
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
