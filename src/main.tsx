import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from './routers/index.tsx'
import { ConnectionProvider } from './contexts/ConnectionProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <AppRouter />
    </ConnectionProvider>
  </React.StrictMode>,
)
