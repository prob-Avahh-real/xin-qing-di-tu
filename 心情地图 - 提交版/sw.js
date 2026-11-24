// PWA Service Worker - 离线缓存支持
const CACHE_NAME = 'mood-map-v1';
const urlsToCache = [
  './',
  './心情地图 - 导航中心.html',
  './business-pro-rich-routes.html',
  './points-mall-app.html',
  './wishing-pool.html',
  './knowledge-base.html',
  './merchant-partnership.html',
  './admin-dashboard.html',
  './embedded-navigation.html',
  './manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 推送通知支持
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '心情地图';
  const options = {
    body: data.body || '你有新的心愿已到期！',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: '查看'},
      {action: 'close', title: '关闭'}
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./wishing-pool.html')
    );
  } else {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('./');
      })
    );
  }
});
