import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // REAL INTEGRATION - NO MOCK DATA
import { ToastProvider } from './components/feedback/ToastSystem';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
