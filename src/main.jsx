import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import TokenContextProvider from './components/TokenContextProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TokenContextProvider>
    <App />
    </TokenContextProvider>
  </StrictMode>,
)
