// import { createBrowserRouter, Navigate } from "react-router";
// import Home from "../Home/Home";
// import Root from "../Root/Root";

// // Account-related components
// import Signup from "../Accounts/Signup/Signup";
// import Signin from "../Accounts/Signin/Signin";
// import JobSeekingForm from "../Accounts/Signup/JobSeekingForm";
// import RecruiterForm from "../Accounts/Signup/RecruiterForm";

// // Job & Company related components
// import Job from './../Pages/Jobs/Jobs';
// import JobsDetails from "../Pages/Users/JobSeeker/JobsDetails";
// import Company from "../Company/Company";
// import CompanyDetails from "../Company/CompanyDetails";
// import CategoryJobs from "../Home/Category/CategoryJobs";

// // User Profile and Modal
// import Profile from "../Pages/Profile/Profile";
// import ShowProfileModal from "../Home/Modal/ShowProfileModal";

// // Network
// import Network from "../Network/Network";
// import IncomingRequest from "../Network/IncomingRequest";

// // Recruiter Dashboard components
// import Dashboard from "../Users/Recruiter/Dashboard/Dashboard";
// import SummaryCards from "../Users/Recruiter/Dashboard/SummaryCards/SummaryCards";
// import ActiveJobs from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobs";
// import ActiveJobsDetails from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobsDetails";
// import ExpiredJobs from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ExpiredJobs";
// import TotalApplicants from "../Users/Recruiter/Dashboard/SummaryCards/TotalApplicants/TotalApplicants";
// import ApplicantsDetails from "../Users/Recruiter/Dashboard/SummaryCards/TotalApplicants/ApplicantsDetails";
// import ShortListed from "../Users/Recruiter/Dashboard/SummaryCards/ShortListed/ShortListed";
// import InterviewScheduled from "../Users/Recruiter/Dashboard/SummaryCards/InterviewScheduled/InterviewScheduled";
// import Inbox from "../Users/Recruiter/Dashboard/Inbox/Inbox";
// import LastestApplicants from "../Users/Recruiter/Dashboard/LatestApplicants/LastestApplicants";
// import ApplicatoinGraph from "../Users/Recruiter/Dashboard/ApplicationGraph/ApplicatoinGraph";
// import CompanyProfile from "../Pages/Users/Recruiter/CompanyProfile/CompanyProfile";

// // Search and Notification
// import SearchResults from "../Pages/SearchResults/SearchResults";
// import Notification from "../Pages/Notification/Notification";

// // Shared components
// import JobLayout from "../Pages/Jobs/shared/JobLayout/JobLayout";
// import Admin_Dashboard from "../Users/Admin/Dashboard/Admin_Dashboard";
// import Admin_DashboardContenet from "../Users/Admin/Dashboard/Admin_DashboardContent";
// // import AllJobs from "../Users/Admin/Dashboard/Manage/Jobseeker/AllJobs";
// import Admin_DashboardContent from "../Users/Admin/Dashboard/Admin_DashboardContent";
// import Manage from "../Users/Admin/Dashboard/Manage/Manage";
// import Jobseeker_Dashboard from "../Users/Admin/Dashboard/Manage/Jobseeker/Jobseeker_Dashboard";
// import ActiveProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/ActiveProfiles";
// import SuspendedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/SuspendedProfiles";
// import VerifiedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/VerifiedProfiles";
// import UnverifiedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/UnverifiedProfiles";
// // import Admin_Dashboard from "../Pages/Users/Admin/Admin_Dashboard";
// // import ApplicationGraphDashboard from "../Users/Recruiter/Dashboard/ApplicationGraph/ApplicatoinGraph";
// // import Admin_DashboardContent from "../Pages/Users/Admin/Admin_DashboardContenet";
// // import Admin_Dashboard_Content from "../Pages/Users/Admin/Admin_Dashboard_Content";
// import SearchByName from './../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/SearchByName';
// import FilterByStatus from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/FilterByStatus";
// import AdvancedSearchFilters from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/AdvancedSearchFilters";
// import Tracking from "../Users/Admin/Dashboard/Manage/Jobseeker/Analytics/Tracking";
// import ExportProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/ExportProfiles";
// import DownloadData from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/DownloadData";
// import ApplicationReports from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/ApplicationReports";
// import Recruiter_Dashboard from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Dashboard";
// import ActiveRecruiter from "../Users/Admin/Dashboard/Manage/Recruiter/All_Recruiter/ActiveRecruiter";
// import InactiveRecruiter from "../Users/Admin/Dashboard/Manage/Recruiter/All_Recruiter/InactiveRecruiter";
// import Approve_Recruiters from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Approve_Recruiters";
// import Suspended_Recruiter from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Suspended_Recruiter";
// import Verify_Documents from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Verify_Documents";
// import JobPosting from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/JobPosting";
// import Applications from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/Applications";
// import Recruiter_Performance from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/Recruiter_Performance";
// import Export_RecruiterData from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/Export_RecruiterData";
// import Export_ApplicationData from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/Export_ApplicationData";
// import ActivityReports from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/ActivityReports";

// // Main Router setup
// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <Root />,
//         children: [
//             {
//                 path: "/",
//                 element: <Home />,
//             },

//             // Category-based job listings
//             {
//                 path: "/category/:categoryName",
//                 element: <CategoryJobs />,
//                 loader: ({ params }) => fetch(`http://localhost:5000/api/v1/category/${params.categoryName}`),
//             },

//             // General pages
//             {
//                 path: "/jobs",
//                 element: <Job />,
//             },
//             {
//                 path: "/search",
//                 element: <SearchResults />,
//             },
//             {
//                 path: "/companies",
//                 element: <Company />,
//             },
//             {
//                 path: "/company/:id",
//                 element: <CompanyDetails />,
//                 loader: ({ params }) => fetch(`http://localhost:5000/api/v1/company/${params.id}`),
//             },

//             // Account-related routes
//             {
//                 path: "/signup",
//                 element: <Signup />,
//             },
//             {
//                 path: "/job-seeking-form",
//                 element: <JobSeekingForm />,
//             },
//             {
//                 path: "/recruiter-form",
//                 element: <RecruiterForm />,
//             },
//             {
//                 path: "/signin",
//                 element: <Signin />,
//             },

//             // Profile and Modals
//             {
//                 path: "/profile",
//                 element: <Profile />,
//             },
//             {
//                 path: "complete-profile",
//                 element: <ShowProfileModal />,
//             },

//             // Network routes
//             {
//                 path: "/network",
//                 element: <Network />,
//             },
//             {
//                 path: "/incoming-request",
//                 element: <IncomingRequest />,
//             },

//             // Recruiter Dashboard and Details
//             {
//                 path: "/recruiter/dashboard",
//                 element: <Dashboard />,
//                 children: [
//                     {
//                         index: true,
//                         element: <Navigate to="active-Jobs" replace />,
//                     },
//                     {
//                         path: "summary-cards",
//                         element: <SummaryCards />,
//                         children: [
//                             {
//                                 path: "active-Jobs",
//                                 element: <ActiveJobs />,
//                             },
//                             {
//                                 path: "expired-Jobs",
//                                 element: <ExpiredJobs />,
//                             },
//                             {
//                                 path: "active-job/:id",
//                                 element: <ActiveJobsDetails />,
//                                 loader: ({ params }) => fetch(`http://localhost:5000/api/v1/job/${params.id}`),
//                             },
//                             {
//                                 path: "total-applications",
//                                 element: <TotalApplicants />,
//                             },
//                             {
//                                 path: "applicant-details/recruiter/:recruiterId/applicant/:applicantId/job/:jobId",
//                                 element: <ApplicantsDetails />,
//                                 loader: ({ params }) =>
//                                     fetch(`http://localhost:5000/api/v1/recruiter/${params.recruiterId}/applicant/${params.applicantId}/job/${params.jobId}`),
//                             },
//                             {
//                                 path: "shortlisted",
//                                 element: <ShortListed />,
//                             },
//                             {
//                                 path: "interviews-scheduled",
//                                 element: <InterviewScheduled />,
//                             },
//                         ],
//                     },
//                     {
//                         path: "application-graph",
//                         element: <ApplicatoinGraph />,
//                     },
//                     {
//                         path: "inbox",
//                         element: <Inbox />,
//                     },
//                     {
//                         path: "latest-applicants",
//                         element: <LastestApplicants />,
//                     },
//                 ],
//             },

//             //Admin
//             {
//                 path: "/admin/dashboard",
//                 element: <Admin_Dashboard />, // Admin Dashboard layout/container
//                 children: [
//                     {
//                         index: true, // Default route when accessing /admin/dashboard
//                         element: <Admin_DashboardContent />, // Render the content here when accessing /admin/dashboard
//                     },
//                 ],
//             },
//             {
//                 path: "/admin/job-seeker/",
//                 element: <Manage />, // Parent route for jobseeker management
//                 children: [
//                     {
//                         path: "dashboard",
//                         element: <Jobseeker_Dashboard />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/active-profile",
//                         element: <ActiveProfiles />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/suspended-profile",
//                         element: <SuspendedProfiles />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/verified-porfile",
//                         element: <VerifiedProfiles />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/unverified-profile",
//                         element: <UnverifiedProfiles />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "search/name",
//                         element: <SearchByName />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "search/status",
//                         element: <FilterByStatus />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "search/advanced",
//                         element: <AdvancedSearchFilters />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "analytics/activity-tracking",
//                         element: <Tracking />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/active-profiles",
//                         element: <ExportProfiles />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/application-reports",
//                         element: <DownloadData />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/downloaded-data",
//                         element: <ApplicationReports />, // All jobs component for jobseeker management
//                     },

//                 ],
//             },
//             {
//                 path: "/admin/recruiter/",
//                 element: <Manage />, // Parent route for jobseeker management
//                 children: [
//                     {
//                         path: "recruiter_dashboard",
//                         element: <Recruiter_Dashboard />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/active_recruiters",
//                         element: <ActiveRecruiter />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "all/inactive_recruiters",
//                         element: <InactiveRecruiter />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "action/approve_recruiter",
//                         element: <Approve_Recruiters />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "action/Suspended_Recruiter",
//                         element: <Suspended_Recruiter />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "action/verify-documents",
//                         element: <Verify_Documents />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "analytics/recruiter_job-postings",
//                         element: <JobPosting />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "analytics/application",
//                         element: <Applications />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "analytics/performance",
//                         element: <Recruiter_Performance />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/recruiter-data",
//                         element: <Export_RecruiterData />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/application_data",
//                         element: <Export_ApplicationData />, // All jobs component for jobseeker management
//                     },
//                     {
//                         path: "export/activity-reports",
//                         element: <ActivityReports />, // All jobs component for jobseeker management
//                     },

//                 ],
//             },




//             // Company profile
//             {
//                 path: "company-profile",
//                 element: <CompanyProfile />,
//             },

//             // Notification
//             {
//                 path: "/notification",
//                 element: <Notification />,
//             },

//             // Job Details
//             {
//                 path: "/job/:id",
//                 element: <JobsDetails />,
//                 loader: ({ params }) => fetch(`http://localhost:5000/api/v1/job/${params.id}`),
//             },
//         ],
//     },
// ]);

// export default router;




import { createBrowserRouter, Navigate } from "react-router";

// 🔹 Core Layouts
import Root from "../Root/Root";

// 🔹 Home & Public Pages
import Home from "../Home/Home";
import Job from "../Pages/Jobs/Jobs";
import JobsDetails from "../Pages/Users/JobSeeker/JobsDetails";
import CategoryJobs from "../Home/Category/CategoryJobs";
import Company from "../Company/Company";
import CompanyDetails from "../Company/CompanyDetails";
import SearchResults from "../Pages/SearchResults/SearchResults";
import Notification from "../Pages/Notification/Notification";

// 🔹 Account & Authentication
import Signup from "../Accounts/Signup/Signup";
import Signin from "../Accounts/Signin/Signin";
import JobSeekingForm from "../Accounts/Signup/JobSeekingForm";
import RecruiterForm from "../Accounts/Signup/RecruiterForm";

// 🔹 Profile & Modal
import Profile from "../Pages/Profile/Profile";
import ShowProfileModal from "../Home/Modal/ShowProfileModal";

// 🔹 Network
import Network from "../Network/Network";
import IncomingRequest from "../Network/IncomingRequest";

// 🔹 Recruiter Dashboard
import Dashboard from "../Users/Recruiter/Dashboard/Dashboard";
import SummaryCards from "../Users/Recruiter/Dashboard/SummaryCards/SummaryCards";
import ActiveJobs from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobs";
import ActiveJobsDetails from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobsDetails";
import ExpiredJobs from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ExpiredJobs";
import TotalApplicants from "../Users/Recruiter/Dashboard/SummaryCards/TotalApplicants/TotalApplicants";
import ApplicantsDetails from "../Users/Recruiter/Dashboard/SummaryCards/TotalApplicants/ApplicantsDetails";
import ShortListed from "../Users/Recruiter/Dashboard/SummaryCards/ShortListed/ShortListed";
import InterviewScheduled from "../Users/Recruiter/Dashboard/SummaryCards/InterviewScheduled/InterviewScheduled";
import Inbox from "../Users/Recruiter/Dashboard/Inbox/Inbox";
import LastestApplicants from "../Users/Recruiter/Dashboard/LatestApplicants/LastestApplicants";
import ApplicatoinGraph from "../Users/Recruiter/Dashboard/ApplicationGraph/ApplicatoinGraph";
import CompanyProfile from "../Pages/Users/Recruiter/CompanyProfile/CompanyProfile";

// 🔹 Admin Dashboard
import Admin_Dashboard from "../Users/Admin/Dashboard/Admin_Dashboard";
import Admin_DashboardContent from "../Users/Admin/Dashboard/Admin_DashboardContent";

// 🔸 Admin - Jobseeker Management
import Manage from "../Users/Admin/Dashboard/Manage/Manage";

import ActiveProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/ActiveProfile/ActiveProfiles";

// import VerifiedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/VerifiedProfiles";
import UnverifiedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/UnverifiedProfiles";
import SearchByName from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/SearchByName";
import FilterByStatus from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/FilterByStatus";
import AdvancedSearchFilters from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/AdvancedSearchFilters";
import Tracking from "../Users/Admin/Dashboard/Manage/Jobseeker/Analytics/Tracking";
import ExportProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/ExportProfiles";
import DownloadData from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/DownloadData";
import ApplicationReports from "../Users/Admin/Dashboard/Manage/Jobseeker/Reports/ApplicationReports";

// 🔸 Admin - Recruiter Management
import Recruiter_Dashboard from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Dashboard";
import ActiveRecruiter from "../Users/Admin/Dashboard/Manage/Recruiter/All_Recruiter/ActiveRecruiter";
import InactiveRecruiter from "../Users/Admin/Dashboard/Manage/Recruiter/All_Recruiter/InactiveRecruiter";
import Approve_Recruiters from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Approve_Recruiters";
import Suspended_Recruiter from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Suspended_Recruiter";
import Verify_Documents from "../Users/Admin/Dashboard/Manage/Recruiter/Recruiter_Action/Verify_Documents";
import JobPosting from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/JobPosting";
import Applications from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/Applications";
import Recruiter_Performance from "../Users/Admin/Dashboard/Manage/Recruiter/Analytics/Recruiter_Performance";
import Export_RecruiterData from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/Export_RecruiterData";
import Export_ApplicationData from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/Export_ApplicationData";
import ActivityReports from "../Users/Admin/Dashboard/Manage/Recruiter/Reports/ActivityReports";

// 🔹 Shared Components
import JobLayout from "../Pages/Jobs/shared/JobLayout/JobLayout";
import JobSeeker_Dashboard from "../Users/Admin/Dashboard/Manage/Jobseeker/Dashboard/Jobseeker_Dashboard";
import SuspendedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/SuspendedProfile/SuspendedProfiles";
import VerifiedProfiles from "../Users/Admin/Dashboard/Manage/Jobseeker/All_Jobseeker/VerifiedProfiles/VerifiedProfiles";
import Search from "../Users/Admin/Dashboard/Manage/Jobseeker/Search&Filter/Search";

// ROUTER CONFIGURATION
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/category/:categoryName", element: <CategoryJobs />, loader: ({ params }) => fetch(`http://localhost:5000/api/v1/category/${params.categoryName}`) },
            { path: "/jobs", element: <Job /> },
            { path: "/search", element: <SearchResults /> },
            { path: "/companies", element: <Company /> },
            { path: "/company/:id", element: <CompanyDetails />, loader: ({ params }) => fetch(`http://localhost:5000/api/v1/company/${params.id}`) },

            // 🔐 Auth
            { path: "/signup", element: <Signup /> },
            { path: "/job-seeking-form", element: <JobSeekingForm /> },
            { path: "/recruiter-form", element: <RecruiterForm /> },
            { path: "/signin", element: <Signin /> },

            // 👤 Profile
            { path: "/profile", element: <Profile /> },
            { path: "/complete-profile", element: <ShowProfileModal /> },

            // 🌐 Network
            { path: "/network", element: <Network /> },
            { path: "/incoming-request", element: <IncomingRequest /> },

            // 🧑‍💼 Recruiter Dashboard
            {
                path: "/recruiter/dashboard",
                element: <Dashboard />,
                children: [
                    { index: true, element: <Navigate to="active-Jobs" replace /> },
                    {
                        path: "summary-cards",
                        element: <SummaryCards />,
                        children: [
                            { path: "active-Jobs", element: <ActiveJobs /> },
                            { path: "expired-Jobs", element: <ExpiredJobs /> },
                            { path: "active-job/:id", element: <ActiveJobsDetails />, loader: ({ params }) => fetch(`http://localhost:5000/api/v1/job/${params.id}`) },
                            { path: "total-applications", element: <TotalApplicants /> },
                            { path: "applicant-details/recruiter/:recruiterId/applicant/:applicantId/job/:jobId", element: <ApplicantsDetails />, loader: ({ params }) => fetch(`http://localhost:5000/api/v1/recruiter/${params.recruiterId}/applicant/${params.applicantId}/job/${params.jobId}`) },
                            { path: "shortlisted", element: <ShortListed /> },
                            { path: "interviews-scheduled", element: <InterviewScheduled /> },
                        ],
                    },
                    { path: "application-graph", element: <ApplicatoinGraph /> },
                    { path: "inbox", element: <Inbox /> },
                    { path: "latest-applicants", element: <LastestApplicants /> },
                ],
            },

            // 🛠 Admin
            {
                path: "/admin/dashboard",
                element: <Admin_Dashboard />,
                children: [{ index: true, element: <Admin_DashboardContent /> }],
            },

            // 🔸 Admin - Jobseeker Routes
            {
                path: "/admin/job-seeker/",
                element: <Manage />,
                children: [
                    { path: "dashboard", element: <JobSeeker_Dashboard /> },
                    { path: "all/active-profile", element: <ActiveProfiles /> },
                    { path: "all/suspended-profile", element: <SuspendedProfiles /> },
                    { path: "all/verified-porfile", element: <VerifiedProfiles /> },
                    { path: "all/unverified-profile", element: <UnverifiedProfiles /> },
                    // { path: "search", element: <SearchByName /> },

                    { path: "search", element: <Search /> },


                    // { path: "search/status", element: <FilterByStatus /> },
                    // { path: "search/advanced", element: <AdvancedSearchFilters /> },
                    { path: "analytics/activity-tracking", element: <Tracking /> },
                    { path: "export/active-profiles", element: <ExportProfiles /> },
                    { path: "export/application-reports", element: <DownloadData /> },
                    { path: "export/downloaded-data", element: <ApplicationReports /> },
                ],
            },

            // 🔸 Admin - Recruiter Routes
            {
                path: "/admin/recruiter/",
                element: <Manage />,
                children: [
                    { path: "recruiter_dashboard", element: <Recruiter_Dashboard /> },
                    { path: "all/active_recruiters", element: <ActiveRecruiter /> },
                    { path: "all/inactive_recruiters", element: <InactiveRecruiter /> },
                    { path: "action/approve_recruiter", element: <Approve_Recruiters /> },
                    { path: "action/Suspended_Recruiter", element: <Suspended_Recruiter /> },
                    { path: "action/verify-documents", element: <Verify_Documents /> },
                    { path: "analytics/recruiter_job-postings", element: <JobPosting /> },
                    { path: "analytics/application", element: <Applications /> },
                    { path: "analytics/performance", element: <Recruiter_Performance /> },
                    { path: "export/recruiter-data", element: <Export_RecruiterData /> },
                    { path: "export/application_data", element: <Export_ApplicationData /> },
                    { path: "export/activity-reports", element: <ActivityReports /> },
                ],
            },

            // 🏢 Company Profile
            { path: "company-profile", element: <CompanyProfile /> },

            // 🔔 Notification
            { path: "/notification", element: <Notification /> },

            // 🔍 Job Details
            { path: "/job/:id", element: <JobsDetails />, loader: ({ params }) => fetch(`http://localhost:5000/api/v1/job/${params.id}`) },
        ],
    },
]);

export default router;
