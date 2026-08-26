"use client";

import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const id = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode ? "dark" : "default",
        });

        const { svg: renderedSvg } = await mermaid.render(id.current, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (!svg) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "var(--ft-text-secondary)" }}>
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      className="mermaid-container"
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "24px 0",
        background: "var(--ft-card-bg)",
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
