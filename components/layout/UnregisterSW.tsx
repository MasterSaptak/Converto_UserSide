'use client';

import { useEffect } from 'react';

export function UnregisterSW() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log('Unregistered stale service worker');
        }
      });
    }
  }, []);

  return null;
}
