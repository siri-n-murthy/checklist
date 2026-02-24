import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

console.log('%c⚛️ React App Starting...', 'color: #61dafb; font-size: 16px; font-weight: bold')

// Register service worker for PWA (optional)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    console.log('ℹ️ Service worker not available')
  })
}

const root = document.getElementById('root')
console.log('Root element:', root)

if (root) {
  console.log('✓ Root element found, rendering app...')
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </React.StrictMode>,
    )
    console.log('%c✅ App rendered successfully!', 'color: #10b981; font-size: 14px; font-weight: bold')
  } catch (err) {
    console.error('❌ Error rendering app:', err)
    root.innerHTML = `<div style="color: #ef4444; padding: 20px; font-family: system-ui;"><h1>Error loading app</h1><p>${err.message}</p><p style="font-size: 12px; color: #999; margin-top: 20px;">Check browser console for details</p></div>`
  }
} else {
  console.error('❌ Root element (#root) not found!')
  document.body.innerHTML = `<div style="color: #ef4444; padding: 20px; font-family: system-ui;"><h1>Error: Root element not found</h1><p>Did you add &lt;div id="root"&gt;&lt;/div&gt; to index.html?</p></div>`
}
