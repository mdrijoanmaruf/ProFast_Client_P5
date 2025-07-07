import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import Root from "../Layouts/Root";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoutes from "../Routes/PrivateRoutes";
import SendParcel from "../Pages/SendParcel/SendParcel";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children : [
            {
                index: true ,
                Component : Home
            },
            {
                path: "coverage",
                Component: Coverage
            },
            {
                path: "sendParcel",
                element : <PrivateRoutes>
                    <SendParcel></SendParcel>
                </PrivateRoutes>
            }
            
        ]
    },
    {
        path: '/',
        Component : AuthLayout,
        children : [
            {
                path : 'login',
                Component : Login
            },
            {
                path : 'register',
                Component : Register
            }
        ]
    }
])
