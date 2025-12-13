import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.okiiee.com',
  // baseURL: 'http://localhost:8000',
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

storeBaseURL(api.baseURL);

// Add the new endpoint for getting all IMEIs
export const getAllImeis = () => api.get('/api/Purchase/all-imeis');

// Repair Job API endpoints
export const toggleRepairJobStatusPrevious = (id) =>
  api.patch(`/api/repair/repair-job/${id}/toggle-status-previous`);

export const updateRepairJob = (id, data) =>
  api.put(`/api/repair/repair-job/${id}`, data);

// New: delete repair job (backend: DELETE /repair-job/:id with auth)
export const deleteRepairJob = (id) =>
  api.delete(`/api/repair/repair-job/${id}`);

// Edit accessory endpoint: PUT /api/accessory/:id
export const editAccessory = (id, data) =>
  api.put(`/api/accessory/${id}`, data);

// Return repair job endpoint: POST /api/repair/repair-job/:id/return
export const returnRepairJob = (id, data) =>
  api.post(`/api/repair/repair-job/${id}/return`, data);

// -------- Expense Module APIs --------

// Expense Types
export const createExpenseType = (data) => api.post('/api/expense/types', data);

export const getExpenseTypes = () => api.get('/api/expense/types');

// Expenses
export const createExpenseApi = (data) => api.post('/api/expense', data);

export const getExpenses = (params = {}) => api.get('/api/expense', { params });

// Reduce accessory stock endpoint: POST /api/accessory/:id/reduce-stock
export const reduceAccessoryStock = (id, quantity) =>
  api.post(`/api/accessory/${id}/reduce-stock`, { quantity });

// Return purchase phone endpoint: POST /api/Purchase/return-purchase-phone/:id
export const returnPurchasePhone = (id, data) =>
  api.post(`/api/Purchase/return-purchase-phone/${id}`, data);

// Return accessory purchase endpoint: POST /api/accessory/accessoryRecord/purchase/return/:id
export const returnAccessoryPurchase = (id, data) =>
  api.post(`/api/accessory/accessoryRecord/purchase/return/${id}`, data);

// Return sold accessory endpoint: POST /api/accessory/accessoryRecord/sale/return/:id
export const returnSoldAccessory = (id, data) =>
  api.post(`/api/accessory/accessoryRecord/sale/return/${id}`, data);