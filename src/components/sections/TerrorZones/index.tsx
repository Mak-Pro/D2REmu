"use client";
import { zones } from "@public/data/zones";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { TerrorZonesProps } from "@/Types";
import { sendTelegramNotification } from "@/api";

// 128 - Worldstone Keep/Throne of Destruction/Worldstone Chamber
// 108 - Chaos Sanctuary
// 83  - Travincal
// 39  - The Secret Cow Level
const favoriteZones = ["128", "108", "83", "39"];

export const TerrorZones = () => {
  const [data, setData] = useState<TerrorZonesProps | null>(null);
  const [trigger, setTrigger] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/zones");
      const result: TerrorZonesProps = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTrigger((prev) => !prev);
    }, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchData();

    if (data && data.current) {
      const currentMatches = data.next.filter((value) =>
        favoriteZones.includes(value)
      );
      if (currentMatches.length > 0) {
        const result: string[] = [];
        currentMatches.filter(
          (zone) =>
            Object.keys(zones).includes(zone) &&
            result.push(zones[zone].location)
        );
        const currentBody = result.join(" ");
        sendTelegramNotification(
          `Current Terror Zone:\n 🔥<strong>${currentBody}</strong>!!!`
        );
      }
    }

    if (data && data.next) {
      const nextMatches = data.next.filter((value) =>
        favoriteZones.includes(value)
      );
      if (nextMatches.length > 0) {
        const result: string[] = [];
        nextMatches.filter(
          (zone) =>
            Object.keys(zones).includes(zone) &&
            result.push(zones[zone].location)
        );
        const nextBody = result.join(" ");
        sendTelegramNotification(
          `Next Terror Zone:\n 🔥<strong>${nextBody}</strong>!!!`
        );
      }
    }
  }, [trigger]);

  return (
    <div className={styles.zones}>
      {data && (
        <>
          <div className={styles.zones__info}>
            <h2>Current Terror Zone:</h2>
            <div className={styles.zones__info_list}>
              {data.current.map((zone) => {
                if (zones[zone]) {
                  const zonesList = zones[zone].location.split("/");
                  return zonesList.map((zone) => {
                    return <span key={zone}>{zone}</span>;
                  });
                } else {
                  return null;
                }
              })}
            </div>
          </div>
          <div className={styles.zones__info}>
            <h2>Next Terror Zone:</h2>
            <div className={styles.zones__info_list}>
              {data.next.map((zone) => {
                if (zones[zone]) {
                  const zonesList = zones[zone].location.split("/");
                  return zonesList.map((zone) => {
                    return <span key={zone}>{zone}</span>;
                  });
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
