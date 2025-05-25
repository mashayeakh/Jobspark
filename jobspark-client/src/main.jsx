import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import router from './components/Rotuer/router.jsx';
import ThemeProvider from './components/Context/ThemeProvider.jsx'
import AuthContextProvider from './components/Context/AuthContextProvider.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
    {/* </ThemeProvider>gvbcncgvnfgvngfnfgnvb  */}
  </StrictMode>,
)
