"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CardBase, CardInside, Divider } from "@/components/Layout/CardComp";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayerBar from "@/components/Layout/MusicPlayerBar";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { FilterSwitcher } from "@/components/Misc/FilterSwitcher";
import { useEventData } from "../hooks/useEventData";
import styles from "./EventStatus.module.css";

export default function EventStatus() {
  const { t } = useTranslation();
  const { filterMode, setFilterMode, filteredEvents, currentTime, getEventTime, newIndexMap } = useEventData();

  return (
    <CardBase
      title={t("CardTitles.EVENTS")}
      SubjectUpdated={<FilterSwitcher value={filterMode} onChange={setFilterMode} />}
      disableTapAnimation={filterMode === "all"}
    >
      <CardInside>
        <div className={styles.listContainer}>
          <AnimatePresence initial={false} mode="sync">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const start = getEventTime(event.start);
                const end = getEventTime(event.end);

                const isOngoing =
                  (currentTime.isAfter(start) || currentTime.isSame(start)) && currentTime.isBefore(end);
                const isFinished = currentTime.isAfter(end) || currentTime.isSame(end);
                const isUpcoming = start.isAfter(currentTime);

                const newIndex = newIndexMap.get(event.name);
                const isNewItem = newIndex !== undefined;
                const enterDelay = isNewItem ? 0.1 + newIndex * 0.06 : 0;

                return (
                  <motion.div
                    key={event.name}
                    layout
                    initial={isNewItem ? { opacity: 0, y: 30, scale: 0.8 } : false}
                    animate={{ opacity: isFinished ? 0.4 : 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: -30,
                      scale: 0.8,
                      transition: { duration: 0.1 },
                    }}
                    transition={{
                      layout:
                        filterMode === "all"
                          ? {
                              duration: 0.2,
                              ease: "easeOut",
                            }
                          : {
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                            },
                      opacity: {
                        delay: enterDelay,
                        duration: isNewItem ? 0.25 : 0.08,
                      },
                      y: {
                        delay: enterDelay,
                        duration: isNewItem ? 0.25 : 0.08,
                      },
                      scale: {
                        delay: enterDelay,
                        duration: isNewItem ? 0.25 : 0.08,
                      },
                    }}
                  >
                    {index !== 0 && <Divider margin="20px 0" height="0px" />}
                    <div className={styles.eventItem}>
                      <div>
                        <h4 className={styles.eventName}>{event.name}</h4>
                      </div>
                      {isOngoing ? (
                        <span className={styles.nowTag}>NOW</span>
                      ) : isUpcoming ? (
                        <span className={styles.upcomingTag}>
                          {(() => {
                            const diffMin = start.diff(currentTime, "minute");
                            if (diffMin >= 60) {
                              const hours = Math.floor(diffMin / 60);
                              return t("Time.HoursLater", { count: hours });
                            }
                            return t("Time.MinsLater", { count: diffMin });
                          })()}
                        </span>
                      ) : (
                        <span className={styles.finishedTag}>終了</span>
                      )}
                    </div>

                    <MusicPlayerBar
                      start={event.start}
                      end={event.end}
                      now={currentTime.format("H:mm:ss")}
                      upcoming={isUpcoming}
                      isOngoing={isOngoing}
                    />
                  </motion.div>
                );
              })
            ) : (
              <p className={styles.noEvent}>
                <EventBusyRoundedIcon className={styles.noEventIcon} />
                {t("Event.NoEvent")}
              </p>
            )}
          </AnimatePresence>
        </div>
      </CardInside>
    </CardBase>
  );
}
