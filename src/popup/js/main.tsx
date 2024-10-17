import { StrictMode, Suspense, useState } from 'react'
import '../css/popup.css'
import { createRoot } from 'react-dom/client'
import Popup from './popup'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Popup />
    </StrictMode>,
)