import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

async function hydrateCmsCache() {
  try {
    const response = await fetch('/api/cms/services', { cache: 'no-store' });
    const result = await response.json();
    if (response.ok && Array.isArray(result.records)) {
      window.localStorage.setItem('iou-finance-services-cms-v2', JSON.stringify(result.records));
    }
  } catch {
    // Keep the last locally cached content when the CMS is temporarily unavailable.
  }
}

async function bootstrap() {
  await hydrateCmsCache();
  const { default: App } = await import('./App.jsx');
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
