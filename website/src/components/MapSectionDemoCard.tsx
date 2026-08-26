"use client";

import React, { useState } from "react";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { mapList } from "@festime/features/map/utils/MapPins";
import styles from "@festime/features/map/components/MapSection.module.css";

const categories = Array.from(new Set(mapList.map((item) => item.category)));

export default function MapSectionDemoCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentMap = mapList[activeIndex];

  return (
    <div className="carddiv" style={{ margin: 0 }}>
      <div className="subProp">
        <div className="cardTitle">
          <p>Maps</p>
        </div>
      </div>
      <div className={`card ${styles.mapCard}`} style={{ overflow: "hidden" }}>
        <div className={styles.mapWrapper}>
          <table className={styles.navTable}>
            <tbody>
              {categories.map((category) => (
                <tr key={category} className={styles.navRow}>
                  <th className={styles.categoryCell}>{category}</th>
                  <td className={styles.buttonsCell}>
                    {mapList
                      .map((map, index) => ({ ...map, index }))
                      .filter((map) => map.category === category)
                      .map((map) => (
                        <button
                          key={map.index}
                          onClick={() => setActiveIndex(map.index)}
                          className={`${styles.mapButton} ${activeIndex === map.index ? styles.mapButtonActive : styles.mapButtonInactive
                            }`}
                        >
                          {map.title}
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className={styles.mapContainer}
            style={{
              border: "none",
              height: "45vh",
              maxHeight: "380px",
              minHeight: "260px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundSize: "24px 24px",
                opacity: 0.35,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 3,
                textAlign: "center",
              }}
            >
              <MapIcon style={{ fontSize: "32px", color: "var(--ft-brand-primary)", marginBottom: "4px" }} />
              <p style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: 700, color: "var(--ft-text-primary)" }}>
                {currentMap.category} - {currentMap.title}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "11px", color: "var(--ft-text-primary)" }}>
                アプリではLeafletによりフロアマップとピンが描画されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
