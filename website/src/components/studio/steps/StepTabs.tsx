"use client";

import React, { useState } from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { Input, Button, Space, Typography, Popconfirm, Select, Segmented } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  UserOutlined,
  SettingOutlined,
  ShopOutlined,
} from "@ant-design/icons";

import { AVAILABLE_ICONS, IconName } from "../utils/iconMap";
import { PreviewBottomNav } from "../preview";
import { useTheme } from "@/mock/MockProviders";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Text } = Typography;

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

const roleDescriptions: Record<"user" | "admin" | "stallAdmin", string> = {
  user: "参加者が利用するスマホアプリの画面下部 (ボトムナビゲーション) のメニュー構成を決めます。ドラッグして順番を入れ替えたり、名前やアイコンを変更できます。",
  admin: "本部スタッフが利用するスマホ管理画面の画面下部メニュー構成を決めます。ドラッグして順番を入れ替えたり、名前やアイコンを変更できます。",
  stallAdmin: "模擬店運営者が利用するスマホ管理画面の画面下部メニュー構成を決めます。ドラッグして順番を入れ替えたり、名前やアイコンを変更できます。",
};

function SortableTabItem({
  id,
  title,
  icon,
  onTitleChange,
  onIconChange,
  onDelete,
}: {
  id: string;
  title: string;
  icon?: string;
  onTitleChange: (val: string) => void;
  onIconChange: (val: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    padding: "16px",
    backgroundColor: "var(--ft-card-bg, #ffffff)",
    border: "1px solid var(--ft-border, #e2e8f0)",
    borderRadius: 12,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
    zIndex: isDragging ? 999 : 1,
  };

  const iconOptions = Object.entries(AVAILABLE_ICONS).map(([key, value]) => ({
    value: key,
    label: (
      <Space>
        <value.component style={{ fontSize: 16 }} />
        {value.label}
      </Space>
    )
  }));

  return (
    <div ref={setNodeRef} style={style}>
      <Space size="large" style={{ flex: 1 }}>
        <div {...attributes} {...listeners} style={{ cursor: "grab", padding: "8px" }}>
          <DragOutlined style={{ color: "#94a3b8", fontSize: 18 }} />
        </div>
        
        <Select
          value={icon || "MoreHorizRounded"}
          size="large"
          onChange={onIconChange}
          options={iconOptions}
          style={{ width: 140 }}
        />

        <Input 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          prefix={<EditOutlined style={{ color: "#cbd5e1" }} />}
          size="large"
          style={{ width: 200, fontWeight: 600 }}
          className="hover-border"
        />
      </Space>
      
      <Popconfirm
        title="このタブを削除しますか？"
        description="タブ内に配置されていたカードは、最初のタブに移動します。"
        onConfirm={onDelete}
        okText="削除"
        cancelText="キャンセル"
        okButtonProps={{ danger: true }}
      >
        <Button danger type="text" icon={<DeleteOutlined />} />
      </Popconfirm>
    </div>
  );
}

export function StepTabs({ state, onChange, onNext, onPrev }: Props) {
  const [targetRole, setTargetRole] = useState<"user" | "admin" | "stallAdmin">("user");
  const [previewTabIdx, setPreviewTabIdx] = useState<number>(0);
  const { isDarkMode } = useTheme();

  const activePrimary = isDarkMode
    ? state.config.theme?.primaryColor?.dark || "#f0f0f0"
    : state.config.theme?.primaryColor?.light || "#1f1f1f";

  const tabs = state.layout[targetRole]?.mobileTabs || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateTabs = (newTabs: typeof tabs) => {
    onChange({
      ...state,
      layout: {
        ...state.layout,
        [targetRole]: {
          ...state.layout[targetRole],
          mobileTabs: newTabs,
        },
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex((t) => t.id === active.id);
      const newIndex = tabs.findIndex((t) => t.id === over?.id);
      
      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      updateTabs(newTabs);
    }
  };

  const updateTabTitle = (id: string, newTitle: string) => {
    const newTabs = tabs.map(t => t.id === id ? { ...t, title: newTitle } : t);
    updateTabs(newTabs);
  };

  const updateTabIcon = (id: string, newIcon: string) => {
    const newTabs = tabs.map(t => t.id === id ? { ...t, icon: newIcon } : t);
    updateTabs(newTabs);
  };

  const deleteTab = (id: string) => {
    if (tabs.length <= 1) {
      alert("最低1つのタブは必要です");
      return;
    }
    
    const tabToDelete = tabs.find(t => t.id === id);
    let newTabs = tabs.filter(t => t.id !== id);
    
    if (tabToDelete && tabToDelete.cards.length > 0) {
      newTabs[0].cards = [...newTabs[0].cards, ...tabToDelete.cards];
    }

    updateTabs(newTabs);
    if (previewTabIdx >= newTabs.length) {
      setPreviewTabIdx(Math.max(0, newTabs.length - 1));
    }
  };

  const addTab = () => {
    if (tabs.length >= 5) {
      alert("ボトムナビゲーションのタブは最大5つまでです");
      return;
    }
    const defaultIcons: Record<string, string> = {
      user: "MoreHorizRounded",
      admin: "SettingsRounded",
      stallAdmin: "StorefrontRounded",
    };
    const newTab = {
      id: `${targetRole}-tab-${Date.now()}`,
      title: `新規タブ`,
      icon: defaultIcons[targetRole] || "MoreHorizRounded",
      cards: []
    };
    updateTabs([...tabs, newTab]);
  };

  return (
    <StepContainer>
      <StepTitle>Navigation Tabs</StepTitle>
      <StepDescription>
        {roleDescriptions[targetRole]}
      </StepDescription>

      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <Segmented
          options={[
            { label: <Space><UserOutlined /> 参加者</Space>, value: "user" },
            { label: <Space><SettingOutlined /> 本部</Space>, value: "admin" },
            { label: <Space><ShopOutlined /> 模擬店</Space>, value: "stallAdmin" },
          ]}
          value={targetRole}
          onChange={(v) => {
            setTargetRole(v as any);
            setPreviewTabIdx(0);
          }}
          size="large"
        />
      </div>


      <div style={{ marginTop: 24 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tabs.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tabs.map(tab => (
              <SortableTabItem 
                key={tab.id} 
                id={tab.id} 
                title={tab.title} 
                icon={tab.icon}
                onTitleChange={(val) => updateTabTitle(tab.id, val)}
                onIconChange={(val) => updateTabIcon(tab.id, val)}
                onDelete={() => deleteTab(tab.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div style={{ marginTop: 16 }}>
          <Button 
            block 
            icon={<PlusOutlined />} 
            onClick={addTab}
            size="large"
            disabled={tabs.length >= 5}
            style={{ border: "1px solid var(--ft-text-muted) !important" }}
          >
            タブを追加 (最大5つ)
          </Button>
        </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 375, marginTop: 24, ["--main-color" as any]: activePrimary }}>
              <PreviewBottomNav
                role={targetRole}
                value={previewTabIdx}
                onChange={setPreviewTabIdx}
                tabs={tabs}
                isMapEnabled={targetRole === "user" && !!state.config.features.map}
              />
            </div>
        </div>
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} />
    </StepContainer>
  );
}
