import { createBrowserRouter } from "react-router"
import Home from "../Home/Home"
import Root from "../Root/Root"
// import random from './../random';
import Test from "../Test/test"
import Job from "../Job/Job"
import Company from "../Company/Company"
import Network from "../Network/Network"
import Signup from "../Accounts/Signup/Signup"
import Signin from "../Accounts/Signin/Signin"
import JobSeekingForm from "../Accounts/Signup/JobSeekingForm"
import RecruiterForm from "../Accounts/Signup/RecruiterForm"
import Dashboard from "../Users/Recruiter/Dashboard/Dashboard"
import SummaryCards from "../Users/Recruiter/Dashboard/SummaryCards/SummaryCards"
import ApplicatoinGraph from "../Users/Recruiter/Dashboard/ApplicationGraph/ApplicatoinGraph"
import Inbox from "../Users/Recruiter/Dashboard/Inbox/Inbox"
import LastestApplicants from "../Users/Recruiter/Dashboard/LatestApplicants/LastestApplicants"
import ActiveJobs from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobs"
import TotalApplicants from "../Users/Recruiter/Dashboard/SummaryCards/TotalApplicants/TotalApplicants"
import ShortListed from "../Users/Recruiter/Dashboard/SummaryCards/ShortListed/ShortListed"
import InterviewScheduled from "../Users/Recruiter/Dashboard/SummaryCards/InterviewScheduled/InterviewScheduled"
import ActiveJobsDetails from "../Users/Recruiter/Dashboard/SummaryCards/ActiveJobs/ActiveJobsDetails"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [

            {
                path: "/",
                element: <Home />
            },
            {
                path: "/test",
                element: <Test />
            },
            {
                path: "/jobs",
                element: <Job />
            },
            {
                path: "/companies",
                element: <Company />
            },
            {
                path: "/network",
                element: <Network />
            },
            // Accounts
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/job-seeking-form",
                element: <JobSeekingForm />
            },
            {
                path: "/recruiter-form",
                element: <RecruiterForm />
            },
            {
                path: "/signin",
                element: <Signin />
            },
            //* for recruiter Dashbaord -----------------------------------------------------
            {
                path: "/recruiter/dashboard",
                element: <Dashboard />,
                children: [
                    {
                        index: true,
                        element: <SummaryCards />

                    },
                    {
                        path: "summary-cards",
                        element: <SummaryCards />,
                        children: [
                            {
                                path: "active-Jobs",
                                element: <ActiveJobs />
                            },
                            {
                                path: "active-job/:id",
                                element: <ActiveJobsDetails />,
                                loader: ({ params }) => fetch(`http://localhost:5000/api/v1/${params.id}`)

                            },

                            {
                                path: "total-applications",
                                element: <TotalApplicants />
                            },
                            {
                                path: "shortlisted",
                                element: <ShortListed />
                            },
                            {
                                path: "interviews-scheduled",
                                element: <InterviewScheduled />
                            }
                        ]
                    },
                    {
                        path: "application-graph",
                        element: <ApplicatoinGraph />
                    },
                    {
                        path: "inbox",
                        element: <Inbox />
                    },
                    {
                        path: "latest-applicants",
                        element: <LastestApplicants />
                    },
                    // {
                    //     path: "application-graph",
                    //     element: <ApplicatoinGraph />
                    // },

                ]
            },
        ]
    }
])


export default router