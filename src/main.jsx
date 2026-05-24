import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import AppContextProvider from './Context/AppContextProvider.jsx'

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </HashRouter>
)
