"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Typography, Segmented } from "antd";
import { CardBase, CardInside } from "@/components/Layout/CardComp";

const { Text } = Typography;

interface VoteResult {
  c: string;
  i: string;
  v: number;
}

const INITIAL_MOCK_RESULTS: VoteResult[] = [
  { i: "03", c: "s", v: 120 },
  { i: "01", c: "s", v: 119 },
  { i: "02", c: "s", v: 118 },
  { i: "04", c: "s", v: 115 },
  { i: "34", c: "e", v: 80 }, 
  { i: "32", c: "e", v: 79 }, 
  { i: "31", c: "e", v: 79 }, 
  { i: "33", c: "e", v: 75 }, 
];

const TARGETS_MAP: Record<string, string> = {
  "03": "たこ焼き",
  "01": "ポップコーン",
  "02": "チュロス",
  "04": "焼き鳥",
  "34": "ロボット展示",
  "32": "フォトスポット",
  "31": "写真展示",
  "33": "学科展示",
};

interface MockVoteAdminProps {
  filterCategory?: string;
}

export default function MockVoteAdmin({ filterCategory }: MockVoteAdminProps) {
  const [results, setResults] = useState<VoteResult[]>(INITIAL_MOCK_RESULTS);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<number>(Date.now());
  const [selectedCategory, setSelectedCategory] = useState(filterCategory || "s");

  useEffect(() => {
    const handleMockVote = (e: any) => {
      const { targetId, previousId, category } = e.detail;
      setResults((prev) => {
        const next = [...prev];

        const targetIdx = next.findIndex((item) => item.i === targetId && item.c === category);
        if (targetIdx >= 0) {
          next[targetIdx] = { ...next[targetIdx], v: next[targetIdx].v + 1 };
        } else {
          next.push({ i: targetId, c: category, v: 1 });
        }

        if (previousId && previousId !== targetId) {
          const prevIdx = next.findIndex((item) => item.i === previousId && item.c === category);
          if (prevIdx >= 0) {
            next[prevIdx] = { ...next[prevIdx], v: Math.max(0, next[prevIdx].v - 1) };
          }
        }

        return next.sort((a, b) => b.v - a.v);
      });
      setLastUpdatedDisplay(Date.now());
    };
    window.addEventListener("festime-mock-vote", handleMockVote);
    return () => window.removeEventListener("festime-mock-vote", handleMockVote);
  }, []);

  const tableColumns = [
    {
      title: "順位",
      key: "rank",
      width: 70,
      render: (_: any, record: VoteResult) => {
        const rank = results.filter((item) => item.c === record.c && item.v > record.v).length + 1;
        return (
          <Space>
            <span style={{ fontWeight: rank <= 3 ? "bold" : "normal" }}>{rank}</span>
            {rank === 1 && record.v > 0 && <Tag color="gold">1位</Tag>}
          </Space>
        );
      },
    },
    {
      title: "名称",
      dataIndex: "i",
      key: "n",
      render: (id: string) => <span style={{ fontWeight: 500 }}>{TARGETS_MAP[id] || id}</span>,
    },
    {
      title: "得票数",
      dataIndex: "v",
      key: "v",
      render: (count: number) => <Text strong>{count.toLocaleString()} 票</Text>,
    },
  ];

  const dataSource = results.filter((item) => item.c === selectedCategory);

  const lastUpdatedStr = new Date(lastUpdatedDisplay).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <CardBase
      title="模擬店 (合計: 472票)"
      SubjectUpdated={
        <span style={{ fontSize: "12px", color: "var(--text-sub-color)", marginRight: "1.5em" }}>
          更新: {lastUpdatedStr}
        </span>
      }
    >
      <CardInside>
        {!filterCategory && (
          <Segmented
            block
            options={[
              { label: "模擬店部門", value: "s" },
              { label: "展示部門", value: "e" },
            ]}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as string)}
            style={{ marginBottom: "16px" }}
          />
        )}
        <Table
          columns={tableColumns}
          dataSource={dataSource}
          rowKey="i"
          pagination={false}
          size="middle"
          scroll={{ y: 250, x: "max-content" }}
        />
      </CardInside>
    </CardBase>
  );
}
