"use client";

import React from "react";
import { Radio } from "antd";
import { useTranslation } from "react-i18next";

export function FilterSwitcher({
  value,
  onChange,
}: {
  value: "hour" | "all";
  onChange: (value: "hour" | "all") => void;
}) {
  const { t } = useTranslation();

  return (
    <div style={{ marginRight: "0.8em", display: "inline-flex" }}>
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        buttonStyle="solid"
        size="small"
      >
        <Radio.Button
          value="hour"
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            width: "80px",
            textAlign: "center",
            padding: 0,
            background: value === "hour" ? "var(--text-color)" : "var(--card-color)",
            color: value === "hour" ? "var(--card-color)" : "var(--text-color)",
            borderRadius: "999px 0 0 999px",
          }}
        >
          {t("Bus.FilterHour")}
        </Radio.Button>
        <Radio.Button
          value="all"
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            width: "80px",
            textAlign: "center",
            padding: 0,
            background: value === "hour" ? "var(--card-color)" : "var(--text-color)",
            color: value === "hour" ? "var(--text-color)" : "var(--card-color)",
            borderRadius: "0 999px 999px 0",
          }}
        >
          {t("Bus.FilterAll")}
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}

export default FilterSwitcher;
