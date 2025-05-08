import { loadPlugins } from '@/plugins/manager'
import PortalTarget from '@/slots/PortalTarget.tsx'
import { DialogProvider } from '@contexts/DialogProvider.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import RootProviderSlot from './RootProviderSlot.tsx'

loadPlugins().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RootProviderSlot>
        <DialogProvider>
          <App />
        </DialogProvider>
      </RootProviderSlot>
      <PortalTarget id="global-overlay" />
    </StrictMode>,
  )
});