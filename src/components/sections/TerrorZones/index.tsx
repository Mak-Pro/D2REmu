"use client";
import { zones } from "@public/data/zones";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { TerrorZonesProps } from "@/Types";

interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const TerrorZones = () => {
  const favoriteZones = ["128", "108", "83", "39"];
  const [data, setData] = useState<TerrorZonesProps | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

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
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 1800000);
    return () => clearInterval(intervalId);
  }, []);

  // notes
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          return registration.pushManager
            .getSubscription()
            .then(async (existingSubscription) => {
              if (!existingSubscription) {
                const vapidPublicKey =
                  "BPb01NeHLI3QsdiuAPknI_GTbF2KsD5PZOnsCATb5174v6z3Beqjqcallr3mvYEQmgpZcmv0ycmQXAZYrCoIaPY";
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                // Подписываем пользователя на уведомления
                return registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey,
                });
              }
              return existingSubscription;
            });
        })
        .then((newSubscription: PushSubscription | null) => {
          if (newSubscription) {
            console.log("User is subscribed:", newSubscription);
            setSubscription({
              endpoint: newSubscription.endpoint,
              keys: {
                p256dh: newSubscription.toJSON().keys?.p256dh as string,
                auth: newSubscription.toJSON().keys?.auth as string,
              },
            });

            // Отправьте подписку на сервер для сохранения
            fetch("/api/saveSubscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subscription: newSubscription,
              }),
            });
          }
        })
        .catch((error) => {
          console.error(
            "Service Worker registration or subscription failed:",
            error
          );
        });
    }
  }, []);

  // 128 - Worldstone Keep/Throne of Destruction/Worldstone Chamber
  // 108 - Chaos Sanctuary
  // 83  - Travincal
  // 39  - The Secret Cow Level

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
