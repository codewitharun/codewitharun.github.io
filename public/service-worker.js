// The old (CRA) version of this site installed a caching service worker at this address. It still lives on
// some phones and breaks requests the board makes (e.g. to Titen). This replacement removes itself:
// browsers fetch the newest copy of this file, run it, it clears the old caches and unregisters for good.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
