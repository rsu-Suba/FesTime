"use client";

import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n/i18n";

import BoothStatus from "@/features/booth/components/BoothStatus";
import VoteFormCard from "@/components/VoteFormCard";
import LostStatus from "@/features/lost/components/LostStatus";
import EventStatus from "@/features/event/components/EventStatus";
import BusStatus from "@/features/bus/components/BusStatus";
import NewsStatus from "@/features/news/components/NewsStatus";

function HeroCardsInner() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n && i18n.language !== "ja") {
      i18n.changeLanguage("ja");
    }
  }, [i18n]);

  return (
    <div className="card-two-columns" id="app-root-cards">
      <div className="card-stack">
        <BoothStatus />
        <VoteFormCard />
      </div>
      <div className="card-stack">
        <EventStatus />
        <BusStatus />
        <NewsStatus />
        <LostStatus />
      </div>
    </div>
  );
}

export default function HeroCardsClient() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="card-two-columns">
        <div className="card-stack">
          <div className="card-skeleton" style={{ height: "200px" }}></div>
          <div className="card-skeleton" style={{ height: "240px" }}></div>
          <div className="card-skeleton" style={{ height: "100px" }}></div>
        </div>
        <div className="card-stack">
          <div className="card-skeleton" style={{ height: "160px" }}></div>
          <div className="card-skeleton" style={{ height: "140px" }}></div>
          <div className="card-skeleton" style={{ height: "120px" }}></div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="card-two-columns">
        <div className="card-stack">
          <div className="card-skeleton" style={{ height: "200px" }}></div>
          <div className="card-skeleton" style={{ height: "240px" }}></div>
          <div className="card-skeleton" style={{ height: "100px" }}></div>
        </div>
        <div className="card-stack">
          <div className="card-skeleton" style={{ height: "160px" }}></div>
          <div className="card-skeleton" style={{ height: "140px" }}></div>
          <div className="card-skeleton" style={{ height: "120px" }}></div>
        </div>
      </div>
    }>
      <HeroCardsInner />
    </Suspense>
  );
}
