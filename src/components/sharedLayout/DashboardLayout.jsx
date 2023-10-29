import { useState, useEffect } from "react";
import { Outlet, Navigate} from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Sidebar from "../Sidebar";
import Header from "../Header";
const DashboardLayout = () => {
  const { user } = useAuthContext();
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
 if(!user) return <Navigate to="/login" replace:true />;
        return (
        
            <div className="flex flex-col h-screen bg-gray-100">
                <Header toggleSidebar={toggleSidebar} />
                <div className="flex-1 flex">
                    <Sidebar isOpen={sidebarOpen} />
                    {/* <Outlet>
                        <DashboardStats />
                    </Outlet> */}
                    <Outlet />
                </div>
            </div>
    

    );
     
};

export default DashboardLayout;

