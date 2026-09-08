"use client";

import React, { useState, useCallback } from "react";
import { Button, Segmented, Space, Typography, Select } from "antd";
import { MobileOutlined, DesktopOutlined, UndoOutlined, DragOutlined, UserOutlined, SettingOutlined, ShopOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { StudioState, StudioLayoutConfig, DEFAULT_LAYOUT, EventConfig } from "@/types/studio";
import { RealPreviewCard, PreviewBottomNav } from "../preview";
import dynamic from "next/dynamic";
import { useTheme } from "@/mock/MockProviders";
import { StepTitle, StepDescription, ActionButtons } from "./shared";
const PreviewContainer = dynamic(() => import("../preview").then((m) => m.PreviewContainer), { ssr: false });

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
  pointerWithin,
  rectIntersection,
  closestCorners,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Text } = Typography;

interface Props {
  state: StudioState;
  onChange: (next: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AVAILABLE_CARDS_BY_ROLE: Record<"user" | "admin" | "stallAdmin", string[]> = {
  user: ["Header", "HotNews", "Events", "Vote", "News", "Lost", "BoothFav", "Booth", "Booth1", "Booth2", "Exhibition", "Bus", "QA", "Homepage", "InfoTitle"],
  admin: ["NewsManager", "QAManager", "LostManager"],
  stallAdmin: ["BoothManager", "News"],
};

const CARD_INFO: Record<string, { label: string; desc: string }> = {
  Header: { label: "メインヘッダー", desc: "トップページテキスト・日付" },
  HotNews: { label: "速報バナー", desc: "最新のお知らせ" },
  Events: { label: "タイムテーブル", desc: "ステージ企画" },
  Vote: { label: "人気投票", desc: "オンライン投票" },
  News: { label: "お知らせ", desc: "最新情報タイムライン" },
  NewsManager: { label: "お知らせ管理 (配信)", desc: "本部からの新規配信・編集" },
  Lost: { label: "落とし物", desc: "写真付き拾得物" },
  LostManager: { label: "落とし物管理 (登録)", desc: "拾得物の登録・写真・管理" },
  BoothFav: { label: "お気に入り模擬店", desc: "ピン留めした模擬店" },
  Booth: { label: "模擬店ステータス (結合)", desc: "混雑・在庫ランプ" },
  Booth1: { label: "模擬店 (前半)", desc: "2カラムに分割配置用" },
  Booth2: { label: "模擬店 (後半)", desc: "2カラムに分割配置用" },
  BoothManager: { label: "混雑・在庫更新", desc: "出店者用ステータス更新" },
  Exhibition: { label: "展示一覧", desc: "教室展示・研究" },
  Bus: { label: "バス時刻表", desc: "バス発着時刻一覧" },
  QA: { label: "Q&A 掲示板", desc: "質問・回答" },
  QAManager: { label: "Q&A管理 (回答)", desc: "質問への回答・削除" },
  Homepage: { label: "公式ホームページ", desc: "外部リンク" },
  InfoTitle: { label: "インフォヘッダー", desc: "インフォページテキスト・設定" },
};

const isCardFeatureEnabled = (cardId: string, features: EventConfig["features"]): boolean => {
  if (cardId === "Spot" || cardId === "Settings" || cardId.startsWith("VoteAdmin") || cardId === "ServerStatus" || cardId === "ServerConfig") return false;
  switch (cardId) {
    case "Booth":
    case "Booth1":
    case "Booth2":
    case "BoothFav":
    case "BoothManager":
      return !!features.booth;
    case "HotNews":
    case "News":
    case "NewsManager":
      return !!features.news;
    case "Events":
      return !!features.event;
    case "Vote":
      return !!features.vote;
    case "Exhibition":
      return !!features.exhibition;
    case "Bus":
      return !!features.bus;
    case "QA":
    case "QAManager":
      return !!features.qa;
    case "Lost":
    case "LostManager":
      return !!features.lost;
    default:
      return true;
  }
};

function SortableCard({ id, label, desc, isUnused = false }: { id: string; label: string; desc: string; isUnused?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        padding: isUnused ? "10px 14px" : "12px 16px",
        backgroundColor: "var(--ft-bg-page)",
        border: "1px solid var(--ft-border)",
        borderRadius: 8,
        marginBottom: isUnused ? 0 : 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
        cursor: "grab",
        zIndex: isDragging ? 999 : 1,
        width: "100%",
        boxSizing: "border-box",
      }}
      {...attributes}
      {...listeners}
    >
      <Space style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
        <DragOutlined style={{ color: "var(--text-secondary)", cursor: "grab", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <Text strong style={{ display: "block", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Text>
          <Text type="secondary" style={{ fontSize: 11, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</Text>
        </div>
      </Space>
    </div>
  );
}

function DroppableContainer({ id, children, style }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        outline: isOver ? "2px dashed var(--ft-brand-primary, #6366f1)" : undefined,
        outlineOffset: -2,
        borderRadius: 8,
        transition: "outline 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}

const EmptyPlaceholder = ({ label }: { label: string }) => (
  <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-secondary)", fontSize: 13, border: "2px dashed var(--ft-border)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
    <div>{label}</div>
    <div style={{ fontSize: 11, opacity: 0.7 }}>カードをここにドラッグして配置</div>
  </div>
);

export function StepLayout({ state, onChange, onNext, onPrev }: Props) {
  const { layout, config } = state;
  const { isDarkMode } = useTheme();

  const activePrimary = isDarkMode
    ? config.theme?.primaryColor?.dark || "#f0f0f0"
    : config.theme?.primaryColor?.light || "#1f1f1f";

  const activeBg = isDarkMode
    ? config.theme?.backgroundColor?.dark || "#080809"
    : config.theme?.backgroundColor?.light || "#f1f0f5";

  const [deviceMode, setDeviceMode] = useState<"mobile" | "pc">("mobile");
  const [targetRole, setTargetRole] = useState<"user" | "admin" | "stallAdmin">("user");
  const [pcColumnCount, setPcColumnCount] = useState<2 | 3 | 4>(4);

  const [leftTabIdx, setLeftTabIdx] = useState(0);
  const [rightTabIdx, setRightTabIdx] = useState(1);
  const [previewTabIdx, setPreviewTabIdx] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const updateLayout = (updates: Partial<StudioLayoutConfig>) => {
    onChange({ ...state, layout: { ...state.layout, ...updates } });
  };

  const handleResetLayout = () => {
    if (confirm("レイアウトを初期状態に戻しますか？")) {
      updateLayout(DEFAULT_LAYOUT);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;
    return closestCorners(args);
  }, []);

  const getContainers = () => {
    let activeContainers: { id: string; title: string; items: string[] }[] = [];

    if (deviceMode === "mobile") {
      activeContainers = layout[targetRole].mobileTabs.map((t) => ({
        id: t.id,
        title: t.title,
        items: t.cards.filter((c) => isCardFeatureEnabled(c, config.features)),
      }));
    } else {
      const pcCols = targetRole === "user"
        ? layout.user.pcColumns[`col${pcColumnCount}` as const] || []
        : (Array.isArray(layout[targetRole]?.pcColumns) && layout[targetRole].pcColumns.length > 0
            ? layout[targetRole].pcColumns
            : DEFAULT_LAYOUT[targetRole]?.pcColumns || []);

      activeContainers = pcCols.map((cards, idx) => ({
        id: `col-${idx}`,
        title: `カラム ${idx + 1}`,
        items: cards.filter((c) => isCardFeatureEnabled(c, config.features)),
      }));
    }

    const usedCards = new Set<string>();
    activeContainers.forEach((c) => c.items.forEach((item) => usedCards.add(item)));
    const unusedCards = AVAILABLE_CARDS_BY_ROLE[targetRole]
      .filter((c) => isCardFeatureEnabled(c, config.features))
      .filter((c) => !usedCards.has(c));

    activeContainers.push({
      id: "unused-cards",
      title: "未使用のカード (ここにドラッグして除外)",
      items: unusedCards,
    });

    return activeContainers;
  };

  const containers = getContainers();

  const findContainerIdx = (id: string) => containers.findIndex((c) => c.id === id || c.items.includes(id));

  const saveContainers = (newContainers: any[]) => {
    const isExcluded = (item: string) =>
      !item || item === "Spot" || item === "Settings" || item.startsWith("VoteAdmin") || item === "ServerStatus" || item === "ServerConfig";
    const validContainers = newContainers
      .filter((c: any) => c.id !== "unused-cards")
      .map((c: any) => ({ ...c, items: c.items.filter((item: string) => !isExcluded(item)) }));

    const newLayout = JSON.parse(JSON.stringify(layout));

    if (deviceMode === "mobile") {
      const containerMap = new Map(validContainers.map((c: any) => [c.id, c.items]));
      newLayout[targetRole].mobileTabs.forEach((tab: any) => {
        if (containerMap.has(tab.id)) {
          tab.cards = containerMap.get(tab.id).filter((item: string) => !isExcluded(item));
        }
      });
    } else {
      if (targetRole === "user") {
        newLayout.user.pcColumns[`col${pcColumnCount}` as const] = validContainers.map((c: any) => c.items);
      } else {
        newLayout[targetRole].pcColumns = validContainers.map((c: any) => c.items);
      }
    }
    updateLayout(newLayout);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeContainerIdx = findContainerIdx(active.id as string);
    const overContainerIdx = findContainerIdx(over.id as string);
    if (activeContainerIdx === -1 || overContainerIdx === -1 || activeContainerIdx === overContainerIdx) return;

    const newContainers = JSON.parse(JSON.stringify(containers));
    const activeItems = newContainers[activeContainerIdx].items;
    const overItems = newContainers[overContainerIdx].items;
    const activeIndex = activeItems.indexOf(active.id as string);
    const overIndex = overItems.indexOf(over.id as string);

    activeItems.splice(activeIndex, 1);
    const isBelow = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
    const newIndex = over.id === newContainers[overContainerIdx].id ? overItems.length : overIndex >= 0 ? overIndex + (isBelow ? 1 : 0) : overItems.length;
    overItems.splice(newIndex, 0, active.id as string);

    saveContainers(newContainers);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeContainerIdx = findContainerIdx(active.id as string);
    const overContainerIdx = findContainerIdx(over.id as string);
    if (activeContainerIdx === -1 || overContainerIdx === -1) return;

    if (activeContainerIdx !== overContainerIdx) {
      const newContainers = JSON.parse(JSON.stringify(containers));
      const activeItems = newContainers[activeContainerIdx].items;
      const overItems = newContainers[overContainerIdx].items;
      const activeIndex = activeItems.indexOf(active.id as string);
      const overIndex = overItems.indexOf(over.id as string);
      if (activeIndex !== -1) {
        activeItems.splice(activeIndex, 1);
        overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, active.id as string);
        saveContainers(newContainers);
      }
      return;
    }

    const items = containers[activeContainerIdx].items;
    const activeIndex = items.indexOf(active.id as string);
    const overIndex = items.indexOf(over.id as string);
    if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
      const newContainers = [...containers];
      newContainers[activeContainerIdx].items = arrayMove(items, activeIndex, overIndex);
      saveContainers(newContainers);
    }
  };

  const renderUnusedCards = () => {
    const unusedContainer = containers.find((c) => c.id === "unused-cards");
    if (!unusedContainer) return null;
    return (
      <div style={{ margin: "16px 0", padding: 16, backgroundColor: "var(--card-color)", borderRadius: 16, border: "1px solid rgba(128, 128, 128, 0.4)" }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: "var(--text-color)" }}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          {unusedContainer.title}
        </div>
        <SortableContext id={unusedContainer.id} items={unusedContainer.items} strategy={rectSortingStrategy}>
          <DroppableContainer id={unusedContainer.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, minHeight: 80 }}>
            {unusedContainer.items.map((cardKey) => (
              <SortableCard key={cardKey} id={cardKey} label={CARD_INFO[cardKey]?.label || cardKey} desc={CARD_INFO[cardKey]?.desc || ""} isUnused />
            ))}
            {unusedContainer.items.length === 0 && (
              <div style={{ gridColumn: "1 / -1", color: "var(--text-secondary)", fontSize: 13, padding: "24px 16px", textAlign: "center", border: "2px dashed var(--ft-border)", borderRadius: 8 }}>
                <div>すべてのカードが配置されています</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>カードをここにドラッグして除外 (未使用に移動)</div>
              </div>
            )}
          </DroppableContainer>
        </SortableContext>
      </div>
    );
  };

  const renderMobileEditor = () => {
    const tabOptions = layout[targetRole].mobileTabs.map((t, idx) => ({ value: idx, label: t.title }));
    const safeLeft = Math.min(leftTabIdx, tabOptions.length - 1);
    const safeRight = Math.min(rightTabIdx, tabOptions.length - 1);
    const leftContainer = containers.find((c) => c.id === layout[targetRole].mobileTabs[safeLeft]?.id);
    const rightContainer = containers.find((c) => c.id === layout[targetRole].mobileTabs[safeRight]?.id);

    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { idx: safeLeft, setIdx: setLeftTabIdx, container: leftContainer },
            { idx: safeRight, setIdx: setRightTabIdx, container: rightContainer },
          ].map(({ idx, setIdx, container }, i) => (
            <div key={i} style={{ backgroundColor: "var(--card-color)", padding: 12, borderRadius: 16, border: "1px solid rgba(128, 128, 128, 0.4)" }}>
              <div style={{ marginBottom: 16 }}>
                <Select value={idx} onChange={setIdx} options={tabOptions} style={{ width: "100%" }} size="large" />
              </div>
              {container && (
                <SortableContext id={container.id} items={container.items} strategy={verticalListSortingStrategy}>
                  <DroppableContainer id={container.id} style={{ minHeight: 180 }}>
                    {container.items.map((cardKey) => (
                      <SortableCard key={cardKey} id={cardKey} label={CARD_INFO[cardKey]?.label || cardKey} desc={CARD_INFO[cardKey]?.desc || ""} />
                    ))}
                    {container.items.length === 0 && <EmptyPlaceholder label="空のタブ" />}
                  </DroppableContainer>
                </SortableContext>
              )}
            </div>
          ))}
        </div>
        {renderUnusedCards()}
      </>
    );
  };

  const renderPcEditor = () => {
    const validContainers = containers.filter((c) => c.id !== "unused-cards");
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${validContainers.length}, 1fr)`, gap: 16 }}>
          {validContainers.map((col) => (
            <div key={col.id} style={{ backgroundColor: "var(--card-color)", padding: 12, borderRadius: 16, border: "1px solid rgba(128, 128, 128, 0.4)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, textAlign: "center", paddingBottom: 8, borderBottom: "2px solid var(--ft-border)" }}>{col.title}</div>
              <SortableContext id={col.id} items={col.items} strategy={verticalListSortingStrategy}>
                <DroppableContainer id={col.id} style={{ minHeight: 180 }}>
                  {col.items.map((cardKey) => (
                    <SortableCard key={cardKey} id={cardKey} label={CARD_INFO[cardKey]?.label || cardKey} desc={CARD_INFO[cardKey]?.desc || ""} />
                  ))}
                  {col.items.length === 0 && <EmptyPlaceholder label="空のカラム" />}
                </DroppableContainer>
              </SortableContext>
            </div>
          ))}
        </div>
        {renderUnusedCards()}
      </>
    );
  };

  const DragOverlayItem = () => (
    <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }) }}>
      {activeId ? (
        <div style={{
          width: 260,
          padding: "12px 16px",
          backgroundColor: "var(--ft-card-bg)",
          border: "2px solid var(--ft-brand-primary)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxSizing: "border-box",
          boxShadow: "0 12px 24px rgba(222, 222, 223, 0.2)",
        }}>
          <DragOutlined style={{ color: "var(--ft-brand-primary)", flexShrink: 0 }} />
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <Text strong style={{ display: "block", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {CARD_INFO[activeId]?.label || activeId}
            </Text>
            <Text type="secondary" style={{ fontSize: 11, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {CARD_INFO[activeId]?.desc || ""}
            </Text>
          </div>
        </div>
      ) : null}
    </DragOverlay>
  );

  const EditorSectionHeader = () => (
    <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>カードの配置</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>カードをドラッグして移動</div>
      </div>
      <Button icon={<UndoOutlined />} onClick={handleResetLayout}>デフォルトに戻す</Button>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto 24px" }}>
        <StepTitle>Layout / Order</StepTitle>
        <StepDescription>カードをドラッグ & ドロップして、スマートフォンやPCで表示するレイアウトを設定してください。</StepDescription>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Segmented
            options={[
              { label: <Space><UserOutlined /> 参加者</Space>, value: "user" },
              { label: <Space><SettingOutlined /> 本部</Space>, value: "admin" },
              { label: <Space><ShopOutlined /> 模擬店</Space>, value: "stallAdmin" },
            ]}
            value={targetRole}
            onChange={(v) => { setTargetRole(v as any); setPreviewTabIdx(0); setLeftTabIdx(0); setRightTabIdx(1); }}
            size="large"
          />
          <Segmented
            options={[
              { label: <Space><MobileOutlined /> スマホ</Space>, value: "mobile" },
              { label: <Space><DesktopOutlined /> PC</Space>, value: "pc" },
            ]}
            value={deviceMode}
            onChange={(v) => setDeviceMode(v as any)}
            size="large"
          />
          {deviceMode === "pc" && targetRole === "user" && (
            <Segmented
              options={[
                { label: "4カラム (最大幅)", value: 4 },
                { label: "3カラム (中幅)", value: 3 },
                { label: "2カラム (最小幅)", value: 2 },
              ]}
              value={pcColumnCount}
              onChange={(v) => setPcColumnCount(v as any)}
              size="large"
            />
          )}
        </div>
      </div>

      {deviceMode === "mobile" ? (
        <div className="preview-full-bleed" style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(500px, 1fr) 400px", gap: 32, alignItems: "start", minWidth: 960, maxWidth: 1400, margin: "0 auto" }}>
            <div>
              <EditorSectionHeader />
              <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                {renderMobileEditor()}
                <DragOverlayItem />
              </DndContext>
            </div>

            <div style={{ position: "sticky", top: 20, flexShrink: 0 }}>
              <div
                style={{
                  width: 375,
                  height: 700,
                  margin: "0 auto",
                  borderRadius: "50px",
                  border: "1px solid #6b6b6b",
                  backgroundColor: activeBg,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative",
                  ["--main-color" as any]: activePrimary,
                  ["--mainCanvas-color" as any]: activeBg,
                  ["--bg-color" as any]: activeBg,
                  ["--ft-brand-primary" as any]: activePrimary,
                }}
              >
                <PreviewContainer isMobile config={config}>
                  <div style={{ flex: 1, overflowY: "auto", padding: 12, paddingTop: 4, paddingBottom: 80, display: "flex", flexDirection: "column", gap: 0 }}>
                    {(() => {
                      const mobileTabs = layout[targetRole].mobileTabs;
                      const safePreviewIdx = Math.min(previewTabIdx, mobileTabs.length - 1);
                      const currentPreviewTab = mobileTabs[safePreviewIdx] || mobileTabs[0];
                      return currentPreviewTab?.cards
                        .filter((cardKey) => isCardFeatureEnabled(cardKey, config.features))
                        .map((cardKey) => (
                          <RealPreviewCard key={cardKey} cardKey={cardKey} config={config} role={targetRole} />
                        ));
                    })()}
                  </div>

                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                    <PreviewBottomNav
                      role={targetRole}
                      value={previewTabIdx}
                      onChange={setPreviewTabIdx}
                      tabs={layout[targetRole].mobileTabs}
                      isMapEnabled={config.features.map}
                    />
                  </div>
                </PreviewContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EditorSectionHeader />
          <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            {renderPcEditor()}
            <DragOverlayItem />
          </DndContext>

          <div className="preview-full-bleed">
            <div style={{
              backgroundColor: activeBg,
              borderRadius: 48,
              border: "1px solid var(--ft-border, #e2e8f0)",
              position: "relative",
              overflow: "hidden",
              ["--main-color" as any]: activePrimary,
              ["--mainCanvas-color" as any]: activeBg,
              ["--bg-color" as any]: activeBg,
              ["--ft-brand-primary" as any]: activePrimary,
            }}>
              <PreviewContainer config={config}>
                <div style={{ width: "100%", overflowX: "auto", paddingTop: 8, paddingBottom: 8 }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${containers.filter((c) => c.id !== "unused-cards").length}, 1fr)`,
                    gap: 24,
                    minWidth: containers.filter((c) => c.id !== "unused-cards").length * 300,
                    padding: "0 16px",
                  }}>
                    {containers.filter((c) => c.id !== "unused-cards").map((col) => (
                      <div key={col.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {col.items.map((cardKey) => (
                          <RealPreviewCard key={cardKey} cardKey={cardKey} config={config} role={targetRole} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </PreviewContainer>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: "32px auto 0" }}>
        <ActionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </div>
  );
}
