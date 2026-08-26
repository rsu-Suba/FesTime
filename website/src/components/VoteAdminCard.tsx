"use client";

import React, { useState, useEffect } from "react";
import { Segmented } from "antd";
import dynamic from "next/dynamic";

const VoteAdmin = dynamic(() => import("@festime/features/vote/components/VoteAdmin"), { ssr: false });

export default function VoteAdminCard() {
  const [category, setCategory] = useState<string>("s");

  useEffect(() => {
    const handleCategorySync = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string }>;
      if (customEvent.detail?.category) {
        setCategory(customEvent.detail.category);
      }
    };
    window.addEventListener("festime-mock-vote-category-change", handleCategorySync);
    return () => {
      window.removeEventListener("festime-mock-vote-category-change", handleCategorySync);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ padding: "0 4px" }}>
        <Segmented
          block
          size="middle"
          value={category}
          onChange={(val) => setCategory(val as string)}
          options={[
            { label: "模擬店集計", value: "s" },
            { label: "展示部門集計", value: "e" },
          ]}
        />
      </div>
      <VoteAdmin filterCategory={category} />
    </div>
  );
}
