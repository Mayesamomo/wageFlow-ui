import { useNavigate, Outlet } from "react-router-dom"

export const ProtectedRoutes = () => {
    const navigate = useNavigate()
const user = JSON.parse(localStorage.getItem('profile'))
if(!user){
    navigate('/login');
 }
    return (
        <div>
            <Outlet/>
        </div>
    )

}