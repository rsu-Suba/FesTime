"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>予期せぬエラーが発生しました</h2>
          <p style={{ color: "#666", margin: "16px 0" }}>{error?.message || "エラーが発生しました。"}</p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            再試行する
          </button>
        </div>
      </body>
    </html>
  );
}
