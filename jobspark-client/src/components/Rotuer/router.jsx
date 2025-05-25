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
            }
        ]
    }
])


export default router