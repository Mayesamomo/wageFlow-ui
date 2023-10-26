/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import{login , register,logout} from '../api/ApiService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const[loading , setLoading] = useState(true)    
   const[user, setUser] = useState(null)    


useEffect(() => {
    const initializeUser = async () => {
        const user = localStorage.getItem("user");
        if (user) {
            const foundUser = JSON.parse(user);
            setUser(foundUser);
        }
        setLoading(false);
    };
    initializeUser();
}, []); // <-- remove extra semicolon and closing bracket

    const handleLogin = async (email, password) => {
        const user = await login(email, password);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
    };

    const handleRegister = async (email, password, name) => {
        const user = await register(email, password, name);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/login");
    };

    const handleLogout = () => {
const user = logout();
        setUser(user);
        localStorage.removeItem("user");
        navigate("/login");
    };

    const value = {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

 export default AuthContext;