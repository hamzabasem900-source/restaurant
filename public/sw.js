// Lightweight PWA Service Worker for Bab Sharqi
const CACHE_NAME = 'bab-sharqi-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Always let requests go through normally, with a fallback for offline assets if needed
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("مطعم باب شرقي - الخدمة غير متصلة حالياً بالإنترنت");
    })
  );
});
