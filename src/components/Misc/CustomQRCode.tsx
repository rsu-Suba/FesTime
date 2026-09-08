import React from "react";
import { QRCode } from "antd";

interface CustomQRCodeProps {
  value: string;
  size?: number;
  icon?: string;
  iconW?: number;
  type?: "canvas" | "svg";
  className?: string;
  style?: React.CSSProperties;
}

const colors = {
  c1: "#2551a5",
  c2: "#a633cb",
  c3: "#cc2c74",
  c4: "#ffce3c",
};

export default function CustomQRCode({
  value,
  size = 200,
  icon = "/img/common/mainlogo.webp",
  iconW = 77,
  type = "svg",
  className,
  style,
}: CustomQRCodeProps) {
  const padding = 32;
  const lSize = 64;
  const lThickness = 6;
  const iconSize = { width: iconW, height: iconW * 0.684877 };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        padding: `${padding}px`,
        background: "#fff",
        display: "inline-block",
        ...style,
      }}
    >
      {[
        { top: 8, left: 8, borderLeft: `${lThickness}px solid ${colors.c1}`, borderTop: `${lThickness}px solid ${colors.c1}`, borderTopLeftRadius: 24 },
        { top: 8, right: 8, borderRight: `${lThickness}px solid ${colors.c2}`, borderTop: `${lThickness}px solid ${colors.c2}`, borderTopRightRadius: 24 },
        { bottom: 8, left: 8, borderLeft: `${lThickness}px solid ${colors.c3}`, borderBottom: `${lThickness}px solid ${colors.c3}`, borderBottomLeftRadius: 24 },
        { bottom: 8, right: 8, borderRight: `${lThickness}px solid ${colors.c4}`, borderBottom: `${lThickness}px solid ${colors.c4}`, borderBottomRightRadius: 24 },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", width: lSize, height: lSize, ...pos }} />
      ))}
      <QRCode value={value} size={size} bordered={false} errorLevel="H" type={type} icon={icon} iconSize={iconSize} />
    </div>
  );
}
