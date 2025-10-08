import React from 'react';
import ReactDOM from 'react-dom/client';
import PaymentApp from './payment/PaymentApp';

const rootElement = document.getElementById('payment-root');
if (!rootElement) {
  throw new Error('Could not find root element to mount payment app.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PaymentApp />
  </React.StrictMode>
);
