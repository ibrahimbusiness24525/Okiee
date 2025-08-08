import axios from 'axios';

export const api = axios.create({
  // baseURL: 'https://api.okiiee.com',
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// ✅ Add an interceptor to update the token dynamically before each
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get latest tokenGIT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const storeBaseURL = (url) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('app-config-db', 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('config', 'readwrite');
      const store = tx.objectStore('config');
      const putRequest = store.put({ key: 'baseURL', value: url });

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject('Failed to store baseURL');
    };

    request.onerror = () => {
      reject('Failed to open IndexedDB');
    };
  });
};

storeBaseURL(api.baseURL)