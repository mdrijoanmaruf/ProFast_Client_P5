import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Home,
        children : [
            {
                index: true ,
                Component : Home
            },
            
        ]
    }
])
