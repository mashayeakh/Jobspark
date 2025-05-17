import { createBrowserRouter } from "react-router"
import Home from "../Home/Home"
import Root from "../Root/Root"
// import random from './../random';
import Test from "../Test/test"


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
        ]
    }
])


export default router