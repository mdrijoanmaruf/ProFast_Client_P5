import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import Root from "../Layouts/Root";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoutes from "../Routes/PrivateRoutes";
import SendParcel from "../Pages/SendParcel/SendParcel";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AboutUs from "../Pages/AboutUs/AboutUs";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import Tracking from "../Pages/Dashboard/Tracking/Tracking";
import PublicTracking from "../Pages/PublicTracking/PublicTracking";

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
            },
            {
                path: "*",
                element: <ErrorPage></ErrorPage>
            },
            {
                path: 'about',
                Component: AboutUs
            },
            {
                path: 'track',
                Component: PublicTracking
            },          
            
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
    },
    {
        path: '/dashboard',
        element: <PrivateRoutes>
            <DashboardLayout></DashboardLayout>
        </PrivateRoutes>,
        children : [
            {
                path: 'myParcels',
                Component : MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component : Payment
            },
            {
                path: 'payments',
                Component : PaymentHistory
            },
            {
                path: 'tracking',
                Component : Tracking
            }
        ]
    }
])
