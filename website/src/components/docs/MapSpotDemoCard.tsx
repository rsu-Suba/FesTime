"use client";

import React from "react";
import { CardBase, CardInside, Divider } from "@/components/Layout/CardComp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import {
  TrafficLight,
  BoothLegend,
  BoothTableHeader,
  commonStyles as cStyles,
} from "@festime/features/booth/components/BoothCommon";
import styles from "@festime/features/map/components/SpotStatus.module.css";

export default function MapSpotDemoCard() {
  const mockSpot = {
    location: "A棟 2階 中央階段前",
    nearbyBooths: [
      { id: "1", stallName: "ポップコーン (3-A)", crowdLevel: 0, stockLevel: 0 },
      { id: "2", stallName: "チュロス (2-B)", crowdLevel: 1, stockLevel: 0 },
      { id: "3", stallName: "フランクフルト (1-C)", crowdLevel: 2, stockLevel: 1 },
    ],
    nearbyExhibitions: [
      { id: "e1", name: "美術部作品展", place: "A棟 201教室", team: "美術部" },
      { id: "e2", name: "写真部ギャラリー", place: "A棟 203教室", team: "写真部" },
    ],
  };

  return (
    <CardBase title="Spot Info (QR連動)">
      <CardInside>
        <div>
          <div className={styles.locationHeader} style={{ marginBottom: "16px" }}>
            <div className={styles.iconCircle}>
              <LocationOnIcon className={styles.locIcon} />
            </div>
            <div className={styles.locTextContainer}>
              <p className={styles.locLabel} style={{ margin: 0, fontSize: "12px", color: "var(--text-sub-color)" }}>あなたは今</p>
              <p className={styles.locName} style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{mockSpot.location}</p>
            </div>
          </div>

          <div className={styles.nearbySection} style={{ padding: "0" }}>
            <div className={styles.sectionTitle} style={{ fontSize: "14px", fontWeight: 700, color: "var(--main-color)" }}>
              周辺の模擬店
            </div>
            <BoothLegend />
            <BoothTableHeader />
            <div className={styles.boothList}>
              {mockSpot.nearbyBooths.map((booth, index) => (
                <React.Fragment key={booth.id}>
                  {index !== 0 && <Divider margin="8px 0" height="1px" />}
                  <div className={cStyles.stallRow}>
                    <div className={cStyles.stallInfo}>
                      <span className={cStyles.stallNameContainer}>{booth.stallName}</span>
                      <span className={cStyles.stallDetails}>詳細</span>
                    </div>
                    <div className={cStyles.statusColumn}>
                      <TrafficLight level={booth.crowdLevel as any} disabled />
                    </div>
                    <div className={cStyles.statusColumn}>
                      <TrafficLight level={booth.stockLevel as any} disabled />
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className={styles.sectionTitle} style={{ fontSize: "14px", fontWeight: 700, margin: "20px 0 8px", color: "var(--main-color)" }}>
              周辺の展示・企画
            </div>
            <div className={styles.boothList}>
              {mockSpot.nearbyExhibitions.map((exhibition, index) => (
                <React.Fragment key={exhibition.id}>
                  {index !== 0 && <Divider margin="8px 0" height="1px" />}
                  <div className={styles.exhibitionRow}>
                    <div className={styles.exhibitionMain}>
                      <span className={styles.boothName}>{exhibition.name}</span>
                      <span className={styles.locLabel}>{exhibition.place}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={cStyles.stallDetails}>詳細</span>
                      <span className={styles.exhibitionTeam}>{exhibition.team}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardInside>
    </CardBase>
  );
}
