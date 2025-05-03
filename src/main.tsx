import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { DialogProvider } from './contexts/DialogProvider'
import EnterpriseProvider from './contexts/EnterpriseProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnterpriseProvider>
      <DialogProvider>
        <App />
      </DialogProvider>
    </EnterpriseProvider>
  </StrictMode>,
)
