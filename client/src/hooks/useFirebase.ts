/**
 * Brazukas Delivery - useFirebase Hook
 * Gerencia Firebase Messaging e Analytics
 */

import { useEffect, useState } from "react";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
}

export function useFirebase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeFirebase();
  }, []);

  const initializeFirebase = async () => {
    try {
      // Check if service workers are supported
      if (!("serviceWorker" in navigator)) {
        console.warn("Service Workers not supported");
        setIsSupported(false);
        return;
      }

      // Check if notifications are supported
      if (!("Notification" in window)) {
        console.warn("Notifications not supported");
        setIsSupported(false);
        return;
      }

      setIsSupported(true);

      // Register service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" }
      );

      console.log("Service Worker registered:", registration);

      // Request notification permission
      if (Notification.permission === "granted") {
        await requestPushToken();
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await requestPushToken();
        }
      }

      setIsInitialized(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Firebase initialization error:", message);
      setError(message);
    }
  };

  const requestPushToken = async () => {
    try {
      // In production, use Firebase Cloud Messaging
      // For now, generate a mock token
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setPushToken(token);

      // Save token to localStorage
      localStorage.setItem("fcm_token", token);

      console.log("Push token obtained:", token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error getting push token:", message);
      setError(message);
    }
  };

  const sendNotification = (payload: PushNotificationPayload) => {
    if (!isSupported || !("serviceWorker" in navigator)) {
      console.warn("Cannot send notification: not supported");
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/logo.png",
        badge: payload.badge || "/badge.png",
        tag: "brazukas-notification",
        requireInteraction: false,
        data: payload.data || {},
      });
    });
  };

  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // In production, use Firebase Analytics
    console.log(`Analytics Event: ${eventName}`, eventData);

    // Send to analytics endpoint
    if (window.gtag) {
      window.gtag("event", eventName, eventData);
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent("page_view", { page_title: pageName });
  };

  const trackPurchase = (orderId: string, amount: number, currency: string = "BRL") => {
    trackEvent("purchase", {
      transaction_id: orderId,
      value: amount,
      currency: currency,
    });
  };

  const trackOrderStatus = (orderId: string, status: string) => {
    trackEvent("order_status_changed", {
      order_id: orderId,
      status: status,
    });
  };

  return {
    isInitialized,
    isSupported,
    pushToken,
    error,
    sendNotification,
    trackEvent,
    trackPageView,
    trackPurchase,
    trackOrderStatus,
    requestPushToken,
  };
}

// Declare gtag for TypeScript
declare global {
  function gtag(...args: any[]): void;
}
