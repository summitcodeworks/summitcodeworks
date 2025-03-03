// Unregister service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered');
    }
  });
}

// Clear browser storage
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log('Browser storage cleared');
  
  // Clear all cookies
  document.cookie.split(';').forEach(function(c) {
    document.cookie = c.trim().split('=')[0] + '=;expires=' + new Date(0).toUTCString() + ';path=/';
  });
  console.log('Cookies cleared');
} catch (e) {
  console.error('Error clearing storage:', e);
} 