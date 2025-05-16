import { createBrowserRouter } from "react-router"
import Home from "../Home/Home"
import Root from "../Root/Root"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            },
        ]
    }
])


export default router