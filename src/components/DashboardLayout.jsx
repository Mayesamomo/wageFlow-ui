import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../pages/Dashboard";
import Invoice from "../pages/Invoice";
import Client from "../pages/Client";
import PrivateRoutes from "../utils/PrivateRoute";
import { AuthProvider } from "../utils/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
const DashboardLayout = () => {
    // const { state } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close the sidebar when the screen is less than 768px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Set the initial state on component mount
        handleResize();

        // Add a resize event listener to handle changes in screen size
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <AuthProvider>
            <div className="flex flex-col h-screen bg-gray-100">
                <Header toggleSidebar={toggleSidebar} />
                <div className="flex-1 flex">
                    <Sidebar isOpen={sidebarOpen} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoutes />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/invoice" element={<Invoice />} />
                            <Route path="/client" element={<Client />} />
                        </Route>
                    </Routes>
                </div>
            </div>
        </AuthProvider>

    );
};

export default DashboardLayout;

