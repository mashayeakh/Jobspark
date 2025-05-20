import { createBrowserRouter } from "react-router"
import Home from "../Home/Home"
import Root from "../Root/Root"
// import random from './../random';
import Test from "../Test/test"
import Job from "../Job/Job"
import Company from "../Company/Company"


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
        ]
    }
])


export default router