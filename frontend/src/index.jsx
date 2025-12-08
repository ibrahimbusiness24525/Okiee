import React from 'react';
import { createRoot } from 'react-dom/client';

import { ConfigProvider } from './contexts/ConfigContext';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

reportWebVitals();
