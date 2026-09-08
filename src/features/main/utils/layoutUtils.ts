import React from "react";

export interface LayoutOptions {
  isMobile: boolean;
  columns: number;
  isStallAdmin: boolean;
  hasVotedBoth?: boolean;
}

export const calculateLayout = (cards: Record<string, React.ReactNode>, options: LayoutOptions) => {
  const { isMobile, columns, isStallAdmin, hasVotedBoth } = options;

  if (isMobile) {
    const mainColumn = hasVotedBoth
      ? [cards.Header, cards.HotNews, cards.Events, cards.News, cards.Vote, cards.Lost]
      : [cards.Header, cards.HotNews, cards.Events, cards.Vote, cards.News, cards.Lost];

    return [
      mainColumn,
      !isStallAdmin ? [cards.BoothFav, cards.Booth] : [],
      !isStallAdmin ? [cards.Exhibition] : [],
      [cards.InfoTitle, cards.Bus, cards.QA, cards.Homepage],
    ].filter((col) => col && col.length > 0);
  }

  if (columns === 4) {
    return [
      [cards.BoothFav, cards.Booth1],
      [cards.Booth2],
      [cards.Events, cards.Bus, cards.Vote, cards.Exhibition],
      [cards.News, cards.QA, cards.Lost, cards.Homepage],
    ];
  }

  if (columns === 3) {
    return [
      [cards.BoothFav, cards.Booth],
      [cards.Events, cards.Bus, cards.Vote, cards.Exhibition],
      [cards.News, cards.QA, cards.Lost, cards.Homepage],
    ];
  }

  return [
    [cards.HotNews, cards.BoothFav, cards.Booth, cards.Exhibition, cards.News],
    [cards.Events, cards.Bus, cards.QA, cards.Lost, cards.Vote, cards.Homepage],
  ];
};

export const calculateAdminLayout = (
  managers: Record<string, React.ReactNode>,
  options: { isMobile: boolean; columns?: number }
) => {
  const { isMobile } = options;

  if (isMobile) {
    return [
      [managers.NewsManager || managers.News],
      [managers.QAManager || managers.QA],
      [managers.LostManager || managers.Lost],
      [managers.Settings],
    ].filter((col) => col && col.length > 0 && col[0] != null);
  }

  return [
    [managers.NewsManager || managers.News],
    [managers.QAManager || managers.QA],
    [managers.LostManager || managers.Lost],
  ].filter((col) => col && col.length > 0);
};

export const calculateStallAdminLayout = (
  managers: Record<string, React.ReactNode>,
  options: { isMobile: boolean; columns?: number }
) => {
  const { isMobile } = options;

  if (isMobile) {
    return [
      [managers.BoothManager || managers.Booth],
      [managers.News || managers.NewsStatus],
    ].filter((col) => col && col.length > 0 && col[0] != null);
  }

  return [
    [managers.BoothManager || managers.Booth],
    [managers.News || managers.NewsStatus],
  ].filter((col) => col && col.length > 0);
};

