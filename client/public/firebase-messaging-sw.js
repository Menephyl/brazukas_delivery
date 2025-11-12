/**
 * Brazukas Delivery - Firebase Service Worker
 * Handles push notifications in the background
 */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD...", // Will be replaced by build process
  authDomain: "brazukas-delivery.firebaseapp.com",
  projectId: "brazukas-delivery",
  storageBucket: "brazukas-delivery.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
});

const messaging = firebase.messaging();

/**
 * Handle background messages
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'brazukas-notification',
    requireInteraction: false,
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'Abrir',
      },
      {
        action: 'close',
        title: 'Fechar',
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Handle notification click
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data.link || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there's already a window open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Handle notification close
 */
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);
});

/**
 * Handle push event (for non-Firebase push notifications)
 */
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received:', event);

  if (!event.data) {
    console.log('Push notification received but no data');
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'brazukas-push',
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Brazukas Delivery', options)
  );
});

/**
 * Handle service worker installation
 */
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting();
});

/**
 * Handle service worker activation
 */
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(clients.claim());
});
