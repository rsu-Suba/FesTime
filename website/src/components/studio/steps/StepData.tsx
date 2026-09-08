"use client";

import React, { useState } from "react";
import { Tabs, Table, Button, Input, InputNumber, Space, Card, Upload, Popconfirm, message, Radio, Empty } from "antd";
import { PlusOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, CodeOutlined, TableOutlined, SyncOutlined } from "@ant-design/icons";
import { StudioState, StudioJsonData, BoothItem, SpotItem, VoteItem, EventScheduleItem, ExhibitionItem } from "@/types/studio";
import { parseCsvToBooths, parseCsvToEvents, parseCsvToSpots, parseCsvToVotes } from "@/utils/csvConverters";
import { StepTitle, StepDescription, ActionButtons } from "./shared";

interface Props {
  state: StudioState;
  onChange: (next: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SAMPLE_CSVS: Record<string, { file: string; content: string }> = {
  booth: {
    file: "sample_booths.csv",
    content: "ID,店名,団体名,場所,メニュー,価格\n1,ポップコーン,チームA,テント番号1,100g,200\n2,チュロス,チームB,テント番号2,チョコ,200\n3,たこ焼き,チームC,テント3,6個,180\n4,焼き鳥,チームD,テント4,1本,150",
  },
  events: {
    file: "sample_events.csv",
    content: "日,イベント名,開始時刻,終了時刻\nday1,オープニング,10:00,10:20\nday1,カラオケ,10:40,11:10\nday2,オープニング,10:00,10:05\nday2,軽音楽部,10:10,12:10",
  },
  spots: {
    file: "sample_spots.csv",
    content: "ID,設置場所,周辺模擬店ID,周辺展示ID\n1F_NW,校舎 1階 北西,,\nLibrary,図書館,,",
  },
  vote: {
    file: "sample_vote.csv",
    content: "ID,項目名,部門\n31,写真展示,e\n01,ポップコーン,s",
  },
};

const CSV_PARSERS = {
  booth: parseCsvToBooths,
  events: parseCsvToEvents,
  spots: parseCsvToSpots,
  vote: parseCsvToVotes,
};

export function StepData({ state, onChange, onNext, onPrev }: Props) {
  const { config, jsonData } = state;
  const [activeTab, setActiveTab] = useState<string>("");
  const [editMode, setEditMode] = useState<"table" | "json">("table");

  const updateJsonData = (updates: Partial<StudioJsonData>) => {
    onChange({ ...state, jsonData: { ...state.jsonData, ...updates } });
  };

  const updateItem = <K extends "booth" | "spots" | "vote" | "exhibitions">(
    key: K,
    index: number,
    patch: Partial<StudioJsonData[K][number]>
  ) => {
    const updated = [...jsonData[key]];
    updated[index] = { ...updated[index], ...patch };
    updateJsonData({ [key]: updated } as any);
  };

  const deleteItem = (key: "booth" | "spots" | "vote" | "exhibitions", index: number) => {
    updateJsonData({ [key]: jsonData[key].filter((_, i) => i !== index) } as any);
  };

  const deleteCol = (onDelete: (index: number) => void) => ({
    title: "操作",
    width: 70,
    render: (_: any, __: any, i: number) => (
      <Popconfirm
        title="削除しますか？"
        okText="削除"
        cancelText="キャンセル"
        okButtonProps={{ danger: true, size: "large" }}
        cancelButtonProps={{ size: "large" }}
        onConfirm={() => onDelete(i)}
      >
        <Button type="text" danger size="large" icon={<DeleteOutlined style={{ fontSize: 18 }} />} />
      </Popconfirm>
    ),
  });

  const handleAddBooth = () => {
    const nextId = jsonData.booth.length > 0 ? Math.max(...jsonData.booth.map((b) => Number(b.id) || 0)) + 1 : 1;
    const newBooth: BoothItem = { id: nextId, name: `新規模擬店 ${nextId}`, team: "", place: "", menu: [{ content: "通常メニュー", price: 300 }] };
    updateJsonData({ booth: [...jsonData.booth, newBooth] });
  };

  const handleAddEvent = (dayKey: "day1" | "day2") => {
    const current = jsonData.events[dayKey] || [];
    updateJsonData({ events: { ...jsonData.events, [dayKey]: [...current, { name: "新規ステージ", start: "12:00", end: "12:30" }] } });
  };

  const handleUpdateEvent = (dayKey: "day1" | "day2", index: number, patch: Partial<EventScheduleItem>) => {
    const current = [...(jsonData.events[dayKey] || [])];
    current[index] = { ...current[index], ...patch };
    updateJsonData({ events: { ...jsonData.events, [dayKey]: current } });
  };

  const handleDeleteEvent = (dayKey: "day1" | "day2", index: number) => {
    const current = (jsonData.events[dayKey] || []).filter((_, i) => i !== index);
    updateJsonData({ events: { ...jsonData.events, [dayKey]: current } });
  };

  const handleAddSpot = () => {
    const newSpot: SpotItem = { id: String(jsonData.spots.length + 1), location: "新規スポット", nearbyStalls: [], nearbyExhibitions: [] };
    updateJsonData({ spots: [...jsonData.spots, newSpot] });
  };

  const handleAddVote = () => {
    const newVote: VoteItem = { id: String(jsonData.vote.length + 1).padStart(2, "0"), name: "新規投票企画", category: config.features.booth ? "s" : "e" };
    updateJsonData({ vote: [...jsonData.vote, newVote] });
  };

  const handleSyncVote = () => {
    const synced: VoteItem[] = [];
    let sIdx = 1;
    let eIdx = 1;
    if (config.features.booth) {
      jsonData.booth.forEach((b) => synced.push({ id: String(sIdx++).padStart(2, "0"), name: b.team ? `${b.name} (${b.team})` : b.name, category: "s" }));
    }
    if (config.features.exhibition) {
      jsonData.exhibitions.forEach((e) => synced.push({ id: String(30 + eIdx++).padStart(2, "0"), name: e.team ? `${e.name} (${e.team})` : e.name, category: "e" }));
    }
    updateJsonData({ vote: synced });
    message.success(`模擬店・展示から ${synced.length} 件の投票項目を生成しました`);
  };

  const handleAddExhibition = () => {
    const nextId = jsonData.exhibitions.length > 0 ? Math.max(...jsonData.exhibitions.map((e) => Number(e.id) || 0)) + 1 : 1;
    updateJsonData({ exhibitions: [...jsonData.exhibitions, { id: nextId, name: `新規展示 ${nextId}`, team: "", place: "" }] });
  };

  const mutateBus = (direction: "Outbound" | "Inbound", mutate: (b: { route: string[]; time: string[][] }) => void) => {
    const bus = { ...jsonData.bus };
    const cur = {
      route: [...(bus[direction]?.route || (direction === "Outbound" ? ["キャンパス 発", "中央駅 着"] : ["中央駅 発", "キャンパス 着"]))],
      time: [[...(bus[direction]?.time?.[0] || [])], [...(bus[direction]?.time?.[1] || [])]],
    };
    mutate(cur);
    bus[direction] = cur;
    updateJsonData({ bus });
  };

  const handleCsvUpload = (file: File, type: keyof typeof CSV_PARSERS) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        const parsed = CSV_PARSERS[type](text);
        updateJsonData({ [type]: parsed } as any);
        message.success(`${type} CSV をインポートしました`);
      } catch {
        message.error("CSV のパース失敗。フォーマットを確認してください。");
      }
    };
    reader.readAsText(file, "UTF-8");
    return false;
  };

  const downloadSampleCsv = (type: string) => {
    const sample = SAMPLE_CSVS[type];
    if (!sample) return;
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), sample.content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sample.file;
    link.click();
    URL.revokeObjectURL(url);
  };

  const TableHeaderBar = ({ onAdd, addLabel, csvType, extra }: { onAdd?: () => void; addLabel?: string; csvType?: keyof typeof CSV_PARSERS; extra?: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <Space>
        {onAdd && (
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={onAdd}>
            {addLabel}
          </Button>
        )}
        {extra}
        {csvType && (
          <>
            <Upload accept=".csv" showUploadList={false} beforeUpload={(file) => handleCsvUpload(file, csvType)}>
              <Button icon={<UploadOutlined />} size="large">CSV インポート</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} size="large" onClick={() => downloadSampleCsv(csvType)}>
              サンプル CSV
            </Button>
          </>
        )}
      </Space>
    </div>
  );

  const tabItems = [
    config.features.booth && {
      key: "booth",
      label: `模擬店 (${jsonData.booth.length}件)`,
      children: (
        <div>
          <TableHeaderBar onAdd={handleAddBooth} addLabel="模擬店を追加" csvType="booth" />
          <Table
            dataSource={jsonData.booth}
            rowKey="id"
            pagination={{ pageSize: 8, placement: ["bottomCenter"] }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 70,
                render: (val, _, i) => (
                  <InputNumber value={val} onChange={(v) => updateItem("booth", i, { id: v || i + 1 })} style={{ width: "100%", textAlign: "center" }} />
                ),
              },
              {
                title: "模擬店名",
                dataIndex: "name",
                width: 180,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("booth", i, { name: e.target.value })} />,
              },
              {
                title: "出店団体 (クラス/部活)",
                dataIndex: "team",
                width: 160,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("booth", i, { team: e.target.value })} />,
              },
              {
                title: "場所 (テント番号等)",
                dataIndex: "place",
                width: 160,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("booth", i, { place: e.target.value })} />,
              },
              {
                title: "メニュー・価格",
                dataIndex: "menu",
                render: (val: any[], _, i) => (
                  <Space wrap orientation="vertical" style={{ width: "100%" }}>
                    {(val || []).map((m, mIdx) => (
                      <Space key={mIdx} style={{ display: "flex", alignItems: "center" }}>
                        <Input
                          size="small"
                          placeholder="品名"
                          value={m.content}
                          style={{ width: 110 }}
                          onChange={(e) => {
                            const newMenu = [...(val || [])];
                            newMenu[mIdx] = { ...m, content: e.target.value };
                            updateItem("booth", i, { menu: newMenu });
                          }}
                        />
                        <InputNumber
                          size="small"
                          placeholder="価格"
                          value={m.price}
                          prefix="¥"
                          style={{ width: 90 }}
                          onChange={(p) => {
                            const newMenu = [...(val || [])];
                            newMenu[mIdx] = { ...m, price: p || 0 };
                            updateItem("booth", i, { menu: newMenu });
                          }}
                        />
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => updateItem("booth", i, { menu: (val || []).filter((_, idx) => idx !== mIdx) })}
                        />
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      size="small"
                      onClick={() => updateItem("booth", i, { menu: [...(val || []), { content: "新メニュー", price: 200 }] })}
                    >
                      + メニュー追加
                    </Button>
                  </Space>
                ),
              },
              deleteCol((i) => deleteItem("booth", i)),
            ]}
          />
        </div>
      ),
    },
    config.features.event && {
      key: "events",
      label: "タイムテーブル",
      children: (
        <div>
          <TableHeaderBar csvType="events" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {(["day1", "day2"] as const).map((dayKey) => (
              <Card
                key={dayKey}
                title={dayKey === "day1" ? "1日目 スケジュール" : "2日目 スケジュール"}
                extra={
                  <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => handleAddEvent(dayKey)}>
                    追加
                  </Button>
                }
              >
                {(jsonData.events[dayKey] || []).map((ev, evIdx) => (
                  <div key={evIdx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <Input style={{ width: 110 }} size="large" placeholder="09:00" value={ev.start} onChange={(e) => handleUpdateEvent(dayKey, evIdx, { start: e.target.value })} />
                    <span>〜</span>
                    <Input style={{ width: 110 }} size="large" placeholder="10:00" value={ev.end} onChange={(e) => handleUpdateEvent(dayKey, evIdx, { end: e.target.value })} />
                    <Input size="large" placeholder="演目名" value={ev.name} onChange={(e) => handleUpdateEvent(dayKey, evIdx, { name: e.target.value })} />
                    <Popconfirm title="この演目を削除しますか？" okText="削除" cancelText="キャンセル" okButtonProps={{ danger: true, size: "large" }} onConfirm={() => handleDeleteEvent(dayKey, evIdx)}>
                      <Button type="text" danger size="large" icon={<DeleteOutlined style={{ fontSize: 18 }} />} />
                    </Popconfirm>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    config.features.map && {
      key: "spots",
      label: `マップ (${jsonData.spots.length}件)`,
      children: (
        <div>
          <TableHeaderBar onAdd={handleAddSpot} addLabel="スポットを追加" csvType="spots" />
          <Table
            dataSource={jsonData.spots}
            rowKey="id"
            pagination={{ pageSize: 8, placement: ["bottomCenter"] }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 100,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("spots", i, { id: e.target.value })} />,
              },
              {
                title: "設置場所 (location)",
                dataIndex: "location",
                render: (val, record, i) => (
                  <Input
                    value={val !== undefined ? val : (record.name || "")}
                    placeholder="例: 校舎 1階 北西"
                    size="large"
                    onChange={(e) => updateItem("spots", i, { location: e.target.value, name: e.target.value })}
                  />
                ),
              },
              {
                title: "周辺模擬店ID (カンマ区切り)",
                dataIndex: "nearbyStalls",
                width: 200,
                render: (val, _, i) => (
                  <Input
                    value={Array.isArray(val) ? val.join(", ") : (val ?? "")}
                    placeholder="例: 1, 2"
                    size="large"
                    onChange={(e) => {
                      const nums = e.target.value.split(",").map((s) => s.trim()).filter(Boolean).map(Number).filter((n) => !isNaN(n));
                      updateItem("spots", i, { nearbyStalls: nums });
                    }}
                  />
                ),
              },
              {
                title: "周辺展示ID (カンマ区切り)",
                dataIndex: "nearbyExhibitions",
                width: 200,
                render: (val, _, i) => (
                  <Input
                    value={Array.isArray(val) ? val.join(", ") : (val ?? "")}
                    placeholder="例: 31, 32"
                    size="large"
                    onChange={(e) => {
                      const nums = e.target.value.split(",").map((s) => s.trim()).filter(Boolean).map(Number).filter((n) => !isNaN(n));
                      updateItem("spots", i, { nearbyExhibitions: nums });
                    }}
                  />
                ),
              },
              deleteCol((i) => deleteItem("spots", i)),
            ]}
          />
        </div>
      ),
    },
    config.features.vote && {
      key: "vote",
      label: `投票項目 (${jsonData.vote.length}件)`,
      children: (
        <div>
          <TableHeaderBar
            onAdd={handleAddVote}
            addLabel="投票項目を追加"
            csvType="vote"
            extra={(config.features.booth || config.features.exhibition) && (
              <Button icon={<SyncOutlined />} size="large" onClick={handleSyncVote}>
                模擬店・展示から自動同期
              </Button>
            )}
          />
          <Table
            dataSource={jsonData.vote}
            rowKey="id"
            pagination={{ pageSize: 8, placement: ["bottomCenter"] }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 80,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("vote", i, { id: e.target.value })} />,
              },
              {
                title: "投票項目名",
                dataIndex: "name",
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("vote", i, { name: e.target.value })} />,
              },
              {
                title: "部門",
                dataIndex: "category",
                width: 180,
                render: (val, _, i) => (
                  <Radio.Group value={val} onChange={(e) => updateItem("vote", i, { category: e.target.value })} buttonStyle="solid" size="large">
                    {(config.features.booth || (!config.features.booth && !config.features.exhibition)) && <Radio.Button value="s">模擬店</Radio.Button>}
                    {(config.features.exhibition || (!config.features.booth && !config.features.exhibition)) && <Radio.Button value="e">展示</Radio.Button>}
                  </Radio.Group>
                ),
              },
              deleteCol((i) => deleteItem("vote", i)),
            ]}
          />
        </div>
      ),
    },
    config.features.exhibition && {
      key: "exhibitions",
      label: `展示 (${jsonData.exhibitions.length}件)`,
      children: (
        <div>
          <TableHeaderBar onAdd={handleAddExhibition} addLabel="追加" />
          <Table
            dataSource={jsonData.exhibitions}
            rowKey="id"
            pagination={{ pageSize: 8, placement: ["bottomCenter"] }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 70,
                render: (val, _, i) => (
                  <InputNumber size="large" value={val} onChange={(v) => updateItem("exhibitions", i, { id: v || i + 1 })} style={{ width: "100%" }} />
                ),
              },
              {
                title: "展示名",
                dataIndex: "name",
                width: 200,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("exhibitions", i, { name: e.target.value })} />,
              },
              {
                title: "出店団体 (クラス/部活)",
                dataIndex: "team",
                width: 180,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("exhibitions", i, { team: e.target.value })} />,
              },
              {
                title: "場所 (教室等)",
                dataIndex: "place",
                width: 160,
                render: (val, _, i) => <Input value={val} size="large" onChange={(e) => updateItem("exhibitions", i, { place: e.target.value })} />,
              },
              deleteCol((i) => deleteItem("exhibitions", i)),
            ]}
          />
        </div>
      ),
    },
    config.features.bus && {
      key: "bus",
      label: "バス時刻表",
      children: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {(["Outbound", "Inbound"] as const).map((direction) => {
            const busInfo = jsonData.bus[direction] || { route: ["", ""], time: [[], []] };
            const departs = busInfo.time?.[0] || [];
            const arrives = busInfo.time?.[1] || [];
            const tripList = Array.from({ length: Math.max(departs.length, arrives.length) }).map((_, idx) => ({
              index: idx,
              depart: departs[idx] || "",
              arrive: arrives[idx] || "",
            }));

            return (
              <Card
                key={direction}
                title={direction === "Outbound" ? "往路ダイヤ (行き)" : "復路ダイヤ (帰り)"}
                extra={
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => mutateBus(direction, (b) => { b.time[0].push("09:00"); b.time[1].push("09:30"); })}
                  >
                    追加
                  </Button>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--ft-text-muted)", marginBottom: 4, fontWeight: 600 }}>ルート名 (発着地)</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Input
                      size="large"
                      value={busInfo.route?.[0] || ""}
                      onChange={(e) => mutateBus(direction, (b) => { b.route[0] = e.target.value; })}
                      placeholder="例: キャンパス 発"
                    />
                    <span>→</span>
                    <Input
                      size="large"
                      value={busInfo.route?.[1] || ""}
                      onChange={(e) => mutateBus(direction, (b) => { b.route[1] = e.target.value; })}
                      placeholder="例: 中央駅 着"
                    />
                  </div>
                </div>

                <Table
                  dataSource={tripList}
                  rowKey="index"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "便",
                      width: 44,
                      render: (_, __, i) => <span style={{ color: "var(--ft-text-muted)", fontSize: 12 }}>#{i + 1}</span>,
                    },
                    {
                      title: "発車時刻",
                      dataIndex: "depart",
                      render: (val, _, i) => (
                        <Input
                          size="large"
                          placeholder="09:00"
                          value={val}
                          style={{ textAlign: "center" }}
                          onChange={(e) => mutateBus(direction, (b) => { b.time[0][i] = e.target.value; })}
                        />
                      ),
                    },
                    {
                      title: "到着時刻",
                      dataIndex: "arrive",
                      render: (val, _, i) => (
                        <Input
                          size="large"
                          placeholder="09:30"
                          value={val}
                          style={{ textAlign: "center" }}
                          onChange={(e) => mutateBus(direction, (b) => { b.time[1][i] = e.target.value; })}
                        />
                      ),
                    },
                    deleteCol((i) => mutateBus(direction, (b) => {
                      b.time[0] = b.time[0].filter((_, idx) => idx !== i);
                      b.time[1] = b.time[1].filter((_, idx) => idx !== i);
                    })),
                  ]}
                />
              </Card>
            );
          })}
        </div>
      ),
    },
  ].filter(Boolean) as any[];

  const resolvedActiveTab = tabItems.some((t) => t.key === activeTab) ? activeTab : (tabItems[0]?.key || "");

  const handleTabJsonChange = (key: string, val: string) => {
    const parsed = JSON.parse(val);
    updateJsonData(key in jsonData ? ({ [key]: parsed } as any) : parsed);
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", width: "100%" }}>
      <StepTitle>Master Data: JSON</StepTitle>
      <StepDescription>
        前のステップで有効にした機能に応じて、必要なデータを入力します。<br />
        エクセルやCSVファイルから一括でインポートすることも可能です。
      </StepDescription>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Radio.Group value={editMode} onChange={(e) => setEditMode(e.target.value)} buttonStyle="solid">
          <Radio.Button value="table"><TableOutlined /> テーブル</Radio.Button>
          <Radio.Button value="json"><CodeOutlined /> Raw JSON</Radio.Button>
        </Radio.Group>
      </div>

      <div>
        {tabItems.length > 0 ? (
          <div>
            <Tabs
              activeKey={resolvedActiveTab}
              onChange={setActiveTab}
              items={tabItems.map((item) => ({ key: item.key, label: item.label }))}
              style={{ marginBottom: editMode === "json" ? 16 : 0 }}
              type="card"
            />
            {editMode === "table" ? (
              tabItems.find((item) => item.key === resolvedActiveTab)?.children
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "var(--ft-text-secondary)", marginBottom: 12 }}>
                  選択中のデータ（<code>{resolvedActiveTab}.json</code>）を直接編集できます。構文エラーに注意してください。
                </p>
                <Input.TextArea
                  key={resolvedActiveTab}
                  rows={32}
                  style={{ fontFamily: "monospace", fontSize: 13 }}
                  defaultValue={JSON.stringify((jsonData as any)[resolvedActiveTab] ?? jsonData, null, 2)}
                  onChange={(e) => handleTabJsonChange(resolvedActiveTab, e.target.value)}
                />
              </div>
            )}
          </div>
        ) : (
          <Empty
            description="有効になっている機能で登録が必要なマスターデータ (JSON) はありません。「次へ」進んでください。"
            style={{ padding: "40px 0" }}
          />
        )}
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
}
