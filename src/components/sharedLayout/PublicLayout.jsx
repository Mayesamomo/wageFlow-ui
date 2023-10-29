import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export const PublicLayout = () => {
    const { user } = useAuthContext();
    
    if (user) {
        return <Navigate to="/dashboard" />;
    }
    
    return (
        <div className="flex flex-col h-screen bg-gray-100">
        <Outlet />
        </div>
    );
};