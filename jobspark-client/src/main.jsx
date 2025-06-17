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
import InterviewContextProvider from './components/Context/InterviewContextProvider.jsx'
import NotificationContextProvider from './components/Context/NotificationContextProvider.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <NotificationContextProvider> {/* ⬅️ Move this higher */}
        <ActiveJobsContextProvider>
          <TotalApplicationProvider>
            <InterviewContextProvider>
              <RouterProvider router={router} />
            </InterviewContextProvider>
          </TotalApplicationProvider>
        </ActiveJobsContextProvider>
      </NotificationContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
