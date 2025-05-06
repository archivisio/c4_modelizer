import { loadPlugins } from '@/plugins/manager'
import { DialogProvider } from '@contexts/DialogProvider'
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
    </StrictMode>,
  )
});