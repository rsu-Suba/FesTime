"use client";

import React, { useState } from "react";
import { Segmented, Tag, Button, Space, App } from "antd";
import { CardBase, CardInside, Divider } from "@/components/Layout/CardComp";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DEMO_TARGETS = [
  { id: "03", name: "たこ焼き", category: "s", team: "チームC" },
  { id: "01", name: "ポップコーン", category: "s", team: "チームA" },
  { id: "02", name: "チュロス", category: "s", team: "チームB" },
  { id: "04", name: "焼き鳥", category: "s", team: "チームD" },
  { id: "32", name: "フォトスポット", category: "e", team: "実行委員会" },
  { id: "31", name: "写真展示", category: "e", team: "写真同好会" },
  { id: "33", name: "学科展示", category: "e", team: "学科" },
];

export default function VoteFormCard() {
  const { message } = App.useApp();
  const [category, setCategory] = useState<string>("s");
  const [votedItems, setVotedItems] = useState<Record<string, string>>({
    s: "03",
    e: "",
  });
  const [votingId, setVotingId] = useState<string | null>(null);

  const filteredTargets = DEMO_TARGETS.filter((t) => t.category === category);
  const currentVotedId = votedItems[category];

  const handleVote = async (item: typeof DEMO_TARGETS[0]) => {
    setVotingId(item.id);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const previousId = votedItems[item.category];
    window.dispatchEvent(
      new CustomEvent("festime-mock-vote", {
        detail: {
          targetId: item.id,
          previousId: previousId,
          category: item.category,
        },
      })
    );

    setVotedItems((prev) => ({ ...prev, [item.category]: item.id }));
    if (message) {
      message.success(`${item.name} に投票しました！`);
    }

    setVotingId(null);
  };

  const votedEId = votedItems["e"];
  const votedSId = votedItems["s"];
  const votedEName = DEMO_TARGETS.find((t) => t.id === votedEId)?.name;
  const votedSName = DEMO_TARGETS.find((t) => t.id === votedSId)?.name;

  return (
    <CardBase title="投票フォーム (参加者側)" disableTapAnimation={true}>
      <CardInside>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-color)", marginBottom: "15px" }}>
            展示や模擬店に 1 票ずつ投票しよう！
            <br />
            <span style={{ fontSize: "12px", color: "#ff4d4f", display: "block" }}>
              それぞれのカテゴリで投票し直すことが可能です (最新の1票が有効になります)
            </span>
          </p>

          <div style={{ fontSize: "1.15em", color: "var(--text-color)", textAlign: "center", margin: "10px 0" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!votedEId || !votedEName ? <ErrorIcon style={{ color: "#ff4a56", marginRight: "4px" }} /> : <CheckCircleIcon style={{ color: "#43aa83", marginRight: "4px" }} />}展示: {!votedEId || !votedEName ? "投票していません！" : `${votedEName}`}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!votedSId || !votedSName ? <ErrorIcon style={{ color: "#ff4a56", marginRight: "4px" }} /> : <CheckCircleIcon style={{ color: "#43aa83", marginRight: "4px" }} />}模擬店: {!votedSId || !votedSName ? "投票していません！" : `${votedSName}`}
            </div>
          </div>

          <Segmented
            block
            size="large"
            value={category}
            onChange={(val) => setCategory(val as string)}
            options={[
              { label: "展示", value: "e" },
              { label: "模擬店", value: "s" },
            ]}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "20px" }}>
          {filteredTargets.map((item, index) => {
            const isCurrentVoted = currentVotedId === item.id;
            return (
              <React.Fragment key={item.id}>
                {index !== 0 && <Divider margin="4px 0" height="1px" />}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                    background: "var(--card-color)",
                    borderRadius: "12px",
                    opacity: isCurrentVoted ? 0.8 : 1,
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: isCurrentVoted ? "#888" : "var(--text-color)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </span>
                      {isCurrentVoted && <Tag color="default" style={{ margin: 0, fontSize: "11px" }}>投票済み</Tag>}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {item.team}
                    </div>
                  </div>
                  <Button
                    type={isCurrentVoted ? "default" : "primary"}
                    loading={votingId === item.id}
                    disabled={isCurrentVoted}
                    onClick={() => handleVote(item)}
                    style={{ borderRadius: "8px", fontWeight: "bold", flexShrink: 0 }}
                  >
                    {isCurrentVoted ? "投票済" : "投票"}
                  </Button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </CardInside>
    </CardBase>
  );
}
