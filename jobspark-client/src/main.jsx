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
import CompanyContextProvider, { CompanyContext } from './components/Context/CompanyContextProvider.jsx'
import UserContextProvider from './components/Context/UserContextProvider.jsx'
import NetworkContextProvider from './components/Context/NetworkContextProvider.jsx'
import { Toaster } from 'react-hot-toast';
import GraphsContextProvider from './components/Context/GraphsContextProvider.jsx'
import AdminDashboardContextProvider from './components/Context/AdminContext/AdminDashboardContextProvider.jsx'
import JobSeekerDashboardContextProvider from './components/Context/AdminContext/JobSeekerDashboardContextProvider.jsx'
import JobSeekerVerifiedContextProvider from './components/Context/AdminContext/JobSeekerVerifiedContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <AdminDashboardContextProvider>
        <JobSeekerDashboardContextProvider>


          <JobSeekerVerifiedContextProvider>
            <UserContextProvider>
              <NotificationContextProvider>

                <GraphsContextProvider>
                  <NetworkContextProvider>
                    <CompanyContextProvider>
                      <ActiveJobsContextProvider>
                        <TotalApplicationProvider>
                          <InterviewContextProvider>

                            {/* ✅ Custom global toast notifications */}
                            <Toaster
                              position="top-center"
                              reverseOrder={false}
                              toastOptions={{
                                duration: 4000,
                                style: {
                                  background: '#1f2937', // dark background
                                  color: '#fff',
                                  fontSize: '15px',
                                  padding: '14px 22px',
                                  borderRadius: '10px',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                },
                                success: {
                                  style: {
                                    background: '#34a0a4',
                                  },
                                  iconTheme: {
                                    primary: '#ffffff',
                                    secondary: '#22c55e',
                                  },
                                },
                                error: {
                                  style: {
                                    background: '#ef4444',
                                  },
                                  iconTheme: {
                                    primary: '#ffffff',
                                    secondary: '#ef4444',
                                  },
                                },
                              }}
                            />

                            {/* 👇 App routes */}
                            <RouterProvider router={router} />
                          </InterviewContextProvider>
                        </TotalApplicationProvider>
                      </ActiveJobsContextProvider>
                    </CompanyContextProvider>
                  </NetworkContextProvider>
                </GraphsContextProvider>




              </NotificationContextProvider>
            </UserContextProvider>

          </JobSeekerVerifiedContextProvider>





        </JobSeekerDashboardContextProvider>
      </AdminDashboardContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
