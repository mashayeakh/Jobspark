import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import router from './components/Rotuer/router.jsx';
import ThemeProvider from './components/Context/ThemeProvider.jsx'
import AuthContextProvider from './components/Context/AuthContextProvider.jsx'
import ActiveJobsContextProvider from './components/Context/ActiveJobsContextProvider.jsx'
import TotalApplicationProvider from './components/Context/TotalApplicationProvider.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    <AuthContextProvider>
      <ActiveJobsContextProvider>
        <TotalApplicationProvider>
          <RouterProvider router={router} />
        </TotalApplicationProvider>
      </ActiveJobsContextProvider>
    </AuthContextProvider>
    {/* </ThemeProvider>gvbcncgvnfgvngfnfgnvb  */}
  </StrictMode>,
)
