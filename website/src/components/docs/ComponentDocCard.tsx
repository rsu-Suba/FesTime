"use client";

import React, { Suspense } from "react";

interface ComponentDocCardProps {
  title: string;
  componentName: string;
  description: string;
  preview?: React.ReactNode;
  secondaryPreview?: React.ReactNode;
  userPreview?: React.ReactNode;
  adminPreview?: React.ReactNode;
  children?: React.ReactNode;
}

function CardSkeleton({ height = "200px" }: { height?: string }) {
  return <div className="card-skeleton" style={{ height, borderRadius: "12px" }}></div>;
}

export function ComponentDocCard({
  title,
  componentName,
  description,
  preview,
  secondaryPreview,
  userPreview,
  adminPreview,
  children,
}: ComponentDocCardProps) {
  const card1 = preview || userPreview;
  const card2 = secondaryPreview || adminPreview;
  const hasTwoCards = Boolean(card1 && card2);

  return (
    <div className="doc-article">
      <div className="doc-header">
        <div className="doc-meta">
          <code className="doc-code-badge">{componentName}</code>
        </div>
        <h1 className="doc-title">{title}</h1>
        <p className="doc-desc">{description}</p>
      </div>

      {(card1 || card2) && (
        <div className="doc-cards-section">
          {hasTwoCards ? (
            <div className="card-two-columns">
              <div className="card-stack">
                <Suspense fallback={<CardSkeleton />}>
                  {card1}
                </Suspense>
              </div>
              <div className="card-stack">
                <Suspense fallback={<CardSkeleton />}>
                  {card2}
                </Suspense>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "480px" }}>
              <Suspense fallback={<CardSkeleton height="180px" />}>
                {card1 || preview}
              </Suspense>
            </div>
          )}
        </div>
      )}

      <div className="doc-content">
        {children}
      </div>
    </div>
  );
}
